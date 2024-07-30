import query from "../queries";
import * as utils from "../utils";

export const get = async (req, res) => {
  // console.log("Controller of user get api::::", JSON.stringify(req))
  // console.log("Controller of user get api::::", req)

  console.log("**-- req.user --**", req.user)
  const domains = await query.domain.get({ user_id: req.user.id });

  const data = {
    apikey: req.user.apikey,
    email: req.user.email,
    domains: domains.map(utils.sanitize.domain)
  };

  return res.status(200).send(data);
};




export const remove = async (req, res) => {
  await query.user.remove(req.user);
  return res.status(200).send("OK");
};
