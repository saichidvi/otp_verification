const jwt = require("jsonwebtoken");
const { JWT_DECODE_ERR } = require("../app/src/errors");
const { JWT_SECRET } = require("../app/src/config");

exports.createJwtToken = (payload) => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });
  return token;
};

exports.verifyJwtToken = (token, next) => {
  try {
    const { userId } = jwt.verify(token, JWT_SECRET);
    return userId;
  } catch (err) {
    next(err);
  }
};