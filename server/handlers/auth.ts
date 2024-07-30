import { differenceInMinutes, addMinutes, subMinutes } from "date-fns";
import { Handler } from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import nanoid from "nanoid";
import { v4 as uuid } from "uuid";
import axios from "axios";
import db from "../knex";
import { CustomError } from "../utils";
import * as utils from "../utils";
import * as redis from "../redis";
import * as mail from "../mail";
import query from "../queries";
import env from "../env";
import { AuthorizationCode } from "simple-oauth2";
import{ getKivoConfig }from "./helpers";



// console.log("we are in auth handler::::::::::::::::")

const authenticate = (
  type: "jwt" | "local" | "localapikey",
  error: string,
  isStrict = true
) =>
  async function auth(req, res, next) {
    // console.log("user_details:::::::",req.user, type )
    if (req.user) return next();

    passport.authenticate(type, (err, user) => {
      if (err) {
        console.error("Authentication error:", err);
        return next(err);
      }

      if (!user && isStrict) {
        console.log("Authentication failed, user not found");
        throw new CustomError(error, 401);
      }

      if (user && isStrict && !user.verified) {
        console.log("User email not verified");
        throw new CustomError(
          "Your email address is not verified. Click on signup to get the verification link again.",
          400
        );
      }
  

      if (user && user.banned) {
        // console.log("User is banned");
        throw new CustomError("You're banned from using this website.", 403);
      }

      if (user) {
        req.user = {
          ...user,
          admin: utils.isAdmin(user.email)
        };
        // console.log("User authenticated successfully:", req.user);
        return next();
      }
      return next();
    })(req, res, next);
  };

export const local = authenticate("local", "Login credentials are wrong.");
export const jwt = authenticate("jwt", "Unauthorized.");
export const jwtLoose = authenticate("jwt", "Unauthorized.", false);


export const apikey = authenticate(
  "localapikey",
  "API key is not correct.",
  false
);

// console.log(":::::::::::::::::::::::::::::::::::::::_______________",apikey );
console.log("Controller of user api key api::::", JSON.stringify(apikey))
// console.log(":::::::::::::::::::::::::::::::::::::::_______________",jwt );


// console.table([local,jwt,jwtLoose,apikey]);


export const cooldown: Handler = async (req, res, next) => {
  // if (env.DISALLOW_ANONYMOUS_LINKS) return next();
  const cooldownConfig = env.NON_USER_COOLDOWN;
  if (req.user || !cooldownConfig) return next();

  const ip = await query.ip.find({
    ip: req.realIP.toLowerCase(),
    created_at: [">", subMinutes(new Date(), cooldownConfig).toISOString()]
  });

  if (ip) {
    const timeToWait =
      cooldownConfig - differenceInMinutes(new Date(), new Date(ip.created_at));
    throw new CustomError(
      `Non-logged in users are limited. Wait ${timeToWait} minutes or log in.`,
      400
    );
  }
  next();
};

export const recaptcha: Handler = async (req, res, next) => {
  if (env.isDev || req.user) return next();
  // if (env.DISALLOW_ANONYMOUS_LINKS) return next();
  if (!env.RECAPTCHA_SECRET_KEY) return next();

  const isReCaptchaValid = await axios({
    method: "post",
    url: "https://www.google.com/recaptcha/api/siteverify",
    headers: {
      "Content-type": "application/x-www-form-urlencoded"
    },
    params: {
      secret: env.RECAPTCHA_SECRET_KEY,
      response: req.body.reCaptchaToken,
      remoteip: req.realIP
    }
  });

  if (!isReCaptchaValid.data.success) {
    throw new CustomError("reCAPTCHA is not valid. Try again.", 401);
  }

  return next();
};

export const admin: Handler = async (req, res, next) => {
  if (req.user.admin) return next();
  throw new CustomError("Unauthorized", 401);
};

export const signup: Handler = async (req, res) => {
  const salt = await bcrypt.genSalt(12);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = await query.user.add(
    { email: req.body.email, password },
    req.user
  );

  await mail.verification(user);

  return res.status(201).send({ message: "Verification email has been sent." });
};

export const token: Handler = async (req, res) => {
  const token = utils.signToken(req.user);
  return res.status(200).send({ token });
};

export const verify: Handler = async (req, res, next) => {
  if (!req.params.verificationToken) return next();

  const [user] = await query.user.update(
    {
      verification_token: req.params.verificationToken,
      verification_expires: [">", new Date().toISOString()]
    },
    {
      verified: true,
      verification_token: null,
      verification_expires: null
    }
  );

  if (user) {
    const token = utils.signToken(user);
    req.token = token;
  }

  return next();
};

export const changePassword: Handler = async (req, res) => {
  const salt = await bcrypt.genSalt(12);
  const password = await bcrypt.hash(req.body.password, salt);

  const [user] = await query.user.update({ id: req.user.id }, { password });

  if (!user) {
    throw new CustomError("Couldn't change the password. Try again later.");
  }

  return res
    .status(200)
    .send({ message: "Your password has been changed successfully." });
};

export const generateApiKey: Handler = async (req, res) => {
  const apikey = nanoid(40);

  redis.remove.user(req.user);

  const [user] = await query.user.update({ id: req.user.id }, { apikey });

  if (!user) {
    throw new CustomError("Couldn't generate API key. Please try again later.");
  }

  return res.status(201).send({ apikey });
};

export const resetPasswordRequest: Handler = async (req, res) => {
  const [user] = await query.user.update(
    { email: req.body.email },
    {
      reset_password_token: uuid(),
      reset_password_expires: addMinutes(new Date(), 30).toISOString()
    }
  );

  if (user) {
    await mail.resetPasswordToken(user);
  }

  return res.status(200).send({
    message: "If email address exists, a reset password email has been sent."
  });
};

export const resetPassword: Handler = async (req, res, next) => {
  const { resetPasswordToken } = req.params;

  if (resetPasswordToken) {
    const [user] = await query.user.update(
      {
        reset_password_token: resetPasswordToken,
        reset_password_expires: [">", new Date().toISOString()]
      },
      { reset_password_expires: null, reset_password_token: null }
    );

    if (user) {
      const token = utils.signToken(user as UserJoined);
      req.token = token;
    }
  }
  return next();
};

export const signupAccess: Handler = (req, res, next) => {
  if (!env.DISALLOW_REGISTRATION) return next();
  return res.status(403).send({ message: "Registration is not allowed." });
};

export const changeEmailRequest: Handler = async (req, res) => {
  const { email, password } = req.body;

  const isMatch = await bcrypt.compare(password, req.user.password);

  if (!isMatch) {
    throw new CustomError("Password is wrong.", 400);
  }

  const currentUser = await query.user.find({ email });

  if (currentUser) {
    throw new CustomError("Can't use this email address.", 400);
  }

  const [updatedUser] = await query.user.update(
    { id: req.user.id },
    {
      change_email_address: email,
      change_email_token: uuid(),
      change_email_expires: addMinutes(new Date(), 30).toISOString()
    }
  );

  redis.remove.user(updatedUser);

  if (updatedUser) {
    await mail.changeEmail({ ...updatedUser, email });
  }

  return res.status(200).send({
    message:
      "If email address exists, an email " +
      "with a verification link has been sent."
  });
};

export const changeEmail: Handler = async (req, res, next) => {
  const { changeEmailToken } = req.params;

  if (changeEmailToken) {
    const foundUser = await query.user.find({
      change_email_token: changeEmailToken
    });

    if (!foundUser) return next();

    const [user] = await query.user.update(
      {
        change_email_token: changeEmailToken,
        change_email_expires: [">", new Date().toISOString()]
      },
      {
        change_email_token: null,
        change_email_expires: null,
        change_email_address: null,
        email: foundUser.change_email_address
      }
    );

    redis.remove.user(foundUser);

    if (user) {
      const token = utils.signToken(user as UserJoined);
      req.token = token;
    }
  }
  return next();
};



export const kivoSignIn: Handler = async (req, res, next) => {
  try {
    const kivoConfig = getKivoConfig();

    const client = new AuthorizationCode({
      client: {
        id: kivoConfig.KIVO_CLIENT_ID,
        secret: kivoConfig.KIVO_CLIENT_SECRET,
      },
      auth: {
        tokenHost: kivoConfig.KIVO_PROVIDER_URL,
        authorizePath: kivoConfig.KIVO_AUTHORIZE_PATH,
      },
    });

    const authorizationUri = client.authorizeURL({
      redirect_uri: kivoConfig.KIVO_CALLBACK_URL,
      scope: kivoConfig.KIVO_SCOPE,
    });

    res.redirect(authorizationUri);
  } catch (error) {
    next(error);
  }
};




// export const kivoCallback: Handler = async (req, res, next) => {
//   try {
//     const code = req.query.code as string;
//     const kivoConfig = getKivoConfig();

//     const client = new AuthorizationCode({
//       client: {
//         id: kivoConfig.KIVO_CLIENT_ID,
//         secret: kivoConfig.KIVO_CLIENT_SECRET,
//       },
//       auth: {
//         tokenHost: kivoConfig.KIVO_PROVIDER_URL,
//         // tokenPath: kivoConfig.KIVO_TOKEN_PATH,
//       },
//     });

//     const tokenParams = {
//       code,
//       redirect_uri: kivoConfig.KIVO_CALLBACK_URL,
//     };

//     const accessToken = await client.getToken(tokenParams);

//     const userResponse = await axios.get(
//       `${kivoConfig.KIVO_PROVIDER_URL}/api/v1/users/me.json`,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken.token.access_token}`,
//         },
//       }
//     );

//     const rawInfo = userResponse.data;
//     const kivo_user = {
//       firstName: rawInfo.current_profile.first_name,
//       email: rawInfo.current_profile.email,
//       timeZone: rawInfo.current_profile.time_zone,
//       kivo_id: rawInfo.current_profile.id,
//       refresh_token: accessToken.token.refresh_token,
//       access_token: accessToken.token.access_token,
//     };

//     return res.status(200).json({
//       data: kivo_user,
//       message: "Signed in successfully",
//     });


//   } catch (error) {
//     console.error("Error in auth:kivoCallback service function", error);
//     next(error);
//   }
// };



export const kivoCallback: Handler = async (req, res, next) => {
  try {
    const code = req.query.code as string;
    const kivoConfig = getKivoConfig();

    const client = new AuthorizationCode({
      client: {
        id: kivoConfig.KIVO_CLIENT_ID,
        secret: kivoConfig.KIVO_CLIENT_SECRET,
      },
      auth: {
        tokenHost: kivoConfig.KIVO_PROVIDER_URL,
      },
    });

    const tokenParams = {
      code,
      redirect_uri: kivoConfig.KIVO_CALLBACK_URL,
    };

    const accessToken = await client.getToken(tokenParams);

    const userResponse = await axios.get(
      `${kivoConfig.KIVO_PROVIDER_URL}/api/v1/users/me.json`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.token.access_token}`,
        },
      }
    );

    const rawInfo = userResponse.data;
    const kivo_user = {
      firstName: rawInfo.current_profile.first_name,
      email: rawInfo.current_profile.email,
      timeZone: rawInfo.current_profile.time_zone,
      kivo_id: rawInfo.current_profile.id,
      refresh_token: accessToken.token.refresh_token,
      access_token: accessToken.token.access_token,
    };

    // Generate a random password for the user
    const salt = await bcrypt.genSalt(12);
    const password = await bcrypt.hash(uuid(), salt);











const jwt = require('jsonwebtoken');


const payload = { email: kivo_user.email };
const secretKey = kivoConfig.KIVO_SECRET_KEY;


const token_for_kivo = jwt.sign(payload, secretKey, { expiresIn: '12h' });

// console.log('Generated Token::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::', token_for_kivo);



    // Check if the user already exists
    const existingUser = await db('users').where({ email: kivo_user.email }).first();
    console.log("**-- existingUser **--", existingUser)
    req.user = existingUser;

    if (existingUser) {
      // Update existing user
      await db('users').where({ id: existingUser.id }).update({
        apikey: kivo_user.access_token,
        password: password, // Update password in case it's a new Kivo login for an existing email
        verified: true,
      });
    } else {
      // Insert new user
      await db('users').insert({
        email: kivo_user.email,
        password: password,
        apikey: kivo_user.access_token,
        verified: true,
        verification_token: uuid(),
      });
    }

    // Fetch the user (whether new or existing) to return in the response
    const user = await db('users').where({ email: kivo_user.email }).first();

    return res.status(200).json({
      data: {
        id: user.id,
        email: user.email,
        verified: user.verified,
        user:user,
        refresh_token: accessToken.token.refresh_token,
        access_token: accessToken.token.access_token,
        token_for_kivo : token_for_kivo


      },
      message: "Signed in successfully",
    });

  } catch (error) {
    console.error("Error in auth:kivoCallback service function", error);
    next(error);
  }
};





