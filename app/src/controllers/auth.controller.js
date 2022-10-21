const User = require("../models/user.model");
const { generateOTP, fast2sms } = require("../utils/otp.util");

const {
    PHONE_NOT_FOUND_ERR,
  
    PHONE_ALREADY_EXISTS_ERR,
    USER_NOT_FOUND_ERR,
    INCORRECT_OTP_ERR,
    ACCESS_DENIED_ERR,
  } = require("../errors");


const { checkPassword, hashPassword } = require("../utils/password.util");
const { createJwtToken } = require("../utils/token.util");


exports.createNewUser = async (req, res, next) => {
    try {
      let { phone, name } = req.body;
  
  
      // check duplicate phone Number
      const phoneExist = await User.findOne({ phone });
  
      if (phoneExist) {
        next({ status: 400, message: PHONE_ALREADY_EXISTS_ERR });
        return;
      }
  
  
      // create new user
      const createUser = new User({
        phone,
        name,
        role : phone === process.env.ADMIN_PHONE ? "ADMIN" :"USER"
      });
  
      // save user
  
      const user = await createUser.save();
  
      res.status(200).json({
        type: "success",
        message: "Account created OTP sended to mobile number",
        data: {
          userId: user._id,
        },
      });
  
      // generate otp
      const otp = generateOTP(6);
      // save otp to user collection
      user.phoneOtp = otp;
      await user.save();
      // send otp to phone number
      await fast2sms(
        {
          message: `Your OTP is ${otp}`,
          contactNumber: user.phone,
        },
        next
      );
    } catch (error) {
      next(error);
    }
  };

