const Blacklist = require("./../model/jwtModel");

exports.checkBlackList = async (token) => {
  const result = await Blacklist.findOne({ jwt: token });
  return result;
};
