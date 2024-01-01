const mongoose = require("mongoose");

// twillio otp schema

const otpSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: [true, "Please Enter Your Phone Number"],
        maxLength: [10, "Phone Number cannot exceed 10 characters"],
        minLength: [10, "Phone Number should have 10 characters"],
    },
    otp: {
        type: String,
        required: [true, "Please Enter Your OTP"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    });

module.exports = mongoose.model("Otp", otpSchema);