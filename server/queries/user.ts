// const { LocalStorage } = require('node-localstorage');
import { v4 as uuid } from "uuid";
import { addMinutes } from "date-fns";

import redisCLient, * as redis from "../redis";
import knex from "../knex";




// Initialize local storage
// const localStorage = new LocalStorage('./scratch');


// export const find = async (match: Partial<User>) => {
//   // Ensure match object has either email or apikey
//   if (!match.email ) {
//     throw new Error('No valid match properties provided');
//   }

//   if (match.email ) {
//     const key = redis.key.user(match.email );
//     const cachedUser = await redisCLient.get(key);
//     if (cachedUser) return JSON.parse(cachedUser) as User;
//   }

//   const user = await knex<User>('users').where((builder) => {
//     if (match.email) builder.where('email', match.email);
//   }).first();

//   if (user) {
//     const emailKey = redis.key.user(user.email);
//     redisCLient.set(emailKey, JSON.stringify(user), 'EX', 60 * 60 * 1);

//   }

//   return user;
// };


// Function to get email from local storage
// const getEmailFromLocalStorage = () => {
//   const localStorageData = localStorage.getItem('user'); 
//   if (localStorageData) {
//     try {
//       const parsedData = JSON.parse(localStorageData);
//       return parsedData.email; // Access email property
//     } catch (error) {
//       console.error('Error parsing local storage data:', error);
//       return null;
//     }
//   }
//   return null;
// };


// console.log( "getEmail::::::::::::",getEmailFromLocalStorage());


export const find = async (match: Partial<User>) => {

  // console.log("match:::::::::::::::::::::::::::::::::::::::::::::::", match)

  match  = {
    // apikey: 'tGVYER2La3zUu3w_lEl3NF-7eS_Egm8xpyhPY88uq38',
    email: match.email
  }


    
  const user = await knex<User>("users").where(match).first();
  // console.log( "getEmail::::::::::::",getEmailFromLocalStorage());
  // console.log("**-- user --**", user)
  if (user) {
    const emailKey = redis.key.user(user.email);
    redisCLient.set(emailKey, JSON.stringify(user), "EX", 60 * 60 * 1);

    // if (user.apikey) {
    //   const apikeyKey = redis.key.user(user.apikey);
    //   redisCLient.set(apikeyKey, JSON.stringify(user), "EX", 60 * 60 * 1);
    // }
  }

  return user;
  
  // if (match.email || match.apikey) {
  //   const key = redis.key.user(match.email || match.apikey);
  //   const cachedUser = await redisCLient.get(key);
  //   if (cachedUser) return JSON.parse(cachedUser) as User;
  // }
  // console.log
  // const user = await knex<User>("users").where(match).first();

  // if (user) {
  //   const emailKey = redis.key.user(user.email);
  //   redisCLient.set(emailKey, JSON.stringify(user), "EX", 60 * 60 * 1);

  //   if (user.apikey) {
  //     const apikeyKey = redis.key.user(user.apikey);
  //     redisCLient.set(apikeyKey, JSON.stringify(user), "EX", 60 * 60 * 1);
  //   }
  // }

  // return user;

};



interface Add {
  email: string;
  password: string;
}

export const add = async (params: Add, user?: User) => {
  const data = {
    email: params.email,
    password: params.password,
    verification_token: uuid(),
    verification_expires: addMinutes(new Date(), 60).toISOString()
  };

  if (user) {
    await knex<User>("users")
      .where("id", user.id)
      .update({ ...data, updated_at: new Date().toISOString() });
  } else {
    await knex<User>("users").insert(data);
  }

  redis.remove.user(user);

  return {
    ...user,
    ...data
  };
};

export const update = async (match: Match<User>, update: Partial<User>) => {
  const query = knex<User>("users");

  Object.entries(match).forEach(([key, value]) => {
    query.andWhere(key, ...(Array.isArray(value) ? value : [value]));
  });

  const users = await query.update(
    { ...update, updated_at: new Date().toISOString() },
    "*"
  );

  users.forEach(redis.remove.user);

  return users;
};

export const remove = async (user: User) => {
  const deletedUser = await knex<User>("users").where("id", user.id).delete();

  redis.remove.user(user);

  return !!deletedUser;
};
