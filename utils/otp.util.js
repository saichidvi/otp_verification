
const fast2sms = require("fast-two-sms");
const {FAST2SMS} = require("../config");

exports.generateOTP = (otp_length) => {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < otp_length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

exports.fast2sms = async ({ message, contactNumber }, next) => {
  console.log({message  : message , contactNumber : contactNumber})
  console.log({FAST2SMS : FAST2SMS})
  const {wallet} = await fast2sms.getWalletBalance(FAST2SMS);
  if(wallet) {
    console.log({wallet : wallet})
  }
  try {
    const response = await fast2sms.sendMessage({
      authorization: FAST2SMS,
      message,
      numbers: [contactNumber],
    });
    if(response){
      console.log({response : response})
    }
  } catch (error) {
    next(error);
  }
};