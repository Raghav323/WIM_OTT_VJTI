const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt=require('bcryptjs');
const jwt=require("jsonwebtoken");
const crypto=require("crypto");
const Course = require("./coursesModel");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  phone: {
    type: String,
    maxLength: [10, "Phone Number cannot exceed 10 characters"],
    minLength: [10, "Phone Number should have 10 characters"],
    default: null,
  },
  email_verified: {
    type: Boolean,
    default: false,
  },
  phone_verified: {
    type: Boolean,
    default: false,
  },
  otp:{
    type:String,
    default:-1
  },
  coursesEnrolled: [
    {
      courseId: {
        type: mongoose.Schema.ObjectId,
        ref: "Course",
      },
      payment_id: {
        type: String,
        required: true,
      },
      order_id: {
        type: String,
        required: true,
      },
      signature: {
        type: String,
        required: true,
      },
      course: {
        type: Object,
        required: true,
      },
      isCompleted: {
        type: Boolean,
        default: false,
      },

      // score:{
      //   type:Number,
      //   default:0
      // }
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  twitter:{
    id:{
      type:String
    },
    username:
    {
      type:String
    }
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
userSchema.pre("save",async function(next){
  if(!this.isModified("password"))
  {
    next();
  }
  this.password=await bcrypt.hash(this.password,10)
});
//JWT Token
userSchema.methods.getJWTToken=function(){
  return jwt.sign({id:this._id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRE,
  });
};
userSchema.methods.comparePassword=async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password)
}
userSchema.methods.getResetPasswordToken=function(){
  const resetToken=crypto.randomBytes(20).toString("hex");

  //Hashing and adding reset password into userSchema
  this.resetPasswordToken=crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");

  this.resetPasswordExpire=Date.now()+15*60*1000;
  
  return resetToken;
}
module.exports = mongoose.model("User", userSchema);