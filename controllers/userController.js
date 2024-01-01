const errorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');
const sendToken = require('../utils/jwttoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require("crypto");
const nodemailer = require('nodemailer');
const otpModel = require('../models/otpModel');
const v1beta2 = require("@google-ai/generativelanguage").v1beta2;
const GoogleAuth = require("google-auth-library").GoogleAuth;
const twilio = require('twilio');
const axios = require('axios');

// const getResetPasswordToken=require('../models/userModel')
//register user
function generateOTP() {
    // Generate a random 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}

const accountSid = 'AC63ab774766cfa85fc82ed515a4bdae12';
const authToken = "43fed78ab10f9c8fc5261f08339a8467"
const client = new twilio(accountSid, authToken);

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name, email, password, otp:generateOTP(),
        avatar: {
            public_id: "this is a sample id",
            url: "profilepicUrl"
        },
    });
    sendToken(user, 201, res);
});

//Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new errorHandler("Please Enter Email and password", 400))
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new errorHandler("Invalid email or Password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new errorHandler("Invalid email or Password", 401));
    }
    sendToken(user, 200, res);
})
//Logout User
exports.logOut = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new errorHandler("User not found", 404));
    }
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/ap1/v1/password/${resetToken}`;
    const message = `Your password rest token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Password recovery email",
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new errorHandler(error.message, 500));
    }
})
//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
        return next(new errorHandler("Reset Password token is not valid or has been expired", 401));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new errorHandler("Password does not match", 401));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);


});
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.body.id);
    res.status(200).json({
        success: true,
        user,
    })
})
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new errorHandler("Old Password is Incorrect", 400));
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new errorHandler("Password does not match", 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
})

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        user
    })


    sendToken(user, 200, res);
});
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new errorHandler(`User does not exist with id :${req.params.id}`, 400));
    }
    res.status(200).json({
        success: true,
        user,
    })
})
//Update User Role
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        user
    })


    sendToken(user, 200, res);
});

//Delete User

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new errorHandler(`User does not exist with id :${req.params.id}`, 400));
    }
    res.status(200).json({
        success: true,
        user
    })
    await user.remove();


    sendToken(user, 200, res);
});

//delete user course
exports.deleteUserCourse = catchAsyncErrors(async (req, res, next) => {

    // Find the user by ID
    console.log(req.body);
    const user = await User.findById(req.body.userId);
    const course = await Course.findById(req.body.courseId);
    if (!user) {
        return next(new errorHandler(`User does not exist with id: ${req.body.DateuserId}`, 400));
    }

    // Find the index of the course in the user's enrolled courses
    const courseIndex = user.coursesEnrolled.findIndex(course => course.courseId.toString() === req.body.courseId);

    if (courseIndex === -1) {
        return next(new errorHandler(`Course does not exist with id: ${req.body.courseId} for the user with id: ${req.body.userId}`, 400));
    }

    // Remove the course from the user's enrolled courses array
    user.coursesEnrolled.splice(courseIndex, 1);
    // Update the number of students enrolled in the course
    course.studentsEnrolled = course.studentsEnrolled - 1;

    // Save the updated user data
    await user.save();
    await course.save();

    res.status(200).json({
        success: true,
        message: 'Course deleted successfully',
        user: user.coursesEnrolled,
    });
});


//find user by courseid 


exports.getUsersByCourseId = catchAsyncErrors(async (req, res, next) => {
    const courseId = req.params.id;

    // Find all users who are enrolled in the specified course, excluding the 'coursesEnrolled' field
    const users = await User.find({ 'coursesEnrolled.courseId': courseId }, { coursesEnrolled: 0 });

    if (!users || users.length === 0) {
        return next(new errorHandler(`No users found for course with id: ${courseId}`, 404));
    }

    res.status(200).json({
        success: true,
        users,
    });
});


exports.sendEmail = catchAsyncErrors(async (req, res, next) => {



    const text = `Pretend you are a professor named ${req.body.senderName} of VJTI College, 
Write the body of an email requesting the student club in VJTI 
named ${req.body.committee} to upload the video titled ${req.body.videoTitle}  of the event 
${req.body.eventName} to their committee's youtube playlist   

Also incorporate the following comments by the professor in your email  :
${req.body.comments}

Use only the above information and do not invent new information for writing the email . 
Inventing new information can harm the sender's original intentions 
`;

    const model = "models/text-bison-001";

    const API_KEY = process.env.LLM_API_KEY;

    const client = new v1beta2.TextServiceClient({
        authClient: new GoogleAuth().fromAPIKey(API_KEY),
    });


    response_llm_promise = client
        .generateText({
            model,
            prompt: {
                text,
            },
        })

    response_llm_promise.then(
        (result) => {


            const response_llm_text = result[0]["candidates"][0].output
            console.log(response_llm_text)

            let transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'ottvjti@gmail.com',
                    pass: 'crlp daxf thbm bhpy',
                },
            });

            for (const sender_email of req.body.emails) {
                let mailOptions = {
                    from: 'ottvjti@gmail.com',
                    to: sender_email,
                    subject: `Request for access to ${req.body.videoTitle}`,
                    text: response_llm_text
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }

        },
        (error) => {
            console.log(error);
        }
    );
    return res.status(200).send('Email sent')


})

exports.handleTwitterCallback = async (req, res, next) => {
    try {
        const twitterProfile = req.user;

        // Check if the user already exists in the database based on Twitter ID
        const existingUser = await User.findOne({ 'twitter.id': twitterProfile.id });

        if (existingUser) {
            // User already exists, you can update their data if needed
            // For example, you can update the user's display name and profile picture
            existingUser.name = twitterProfile.displayName;
            existingUser.avatar = {
                public_id: 'updated_public_id',
                url: 'updated_url',
            };
            await existingUser.save();
            // Handle any additional actions here
        } else {
            // User doesn't exist, create a new user based on Twitter data
            const newUser = new User({
                name: twitterProfile.displayName,
                email: '', // You can set this to an empty string or any default value
                password: '', // You can set this to an empty string or any default value
                avatar: {
                    public_id: 'new_public_id',
                    url: 'new_url',
                },
                role: 'user',
                twitter: {
                    id: twitterProfile.id,
                    username: twitterProfile.username,
                },
            });

            await newUser.save();
            // Handle any additional actions here
        }

        // Redirect to a success page or send a JSON response
        res.redirect('/');
    } catch (error) {
        console.error('Error processing Twitter OAuth callback:', error);
        // Handle errors and redirect to an error page or send an error response
        next(new errorHandler(error.message, 500));
    }
};

// verify email using otp

exports.verifyEmail = catchAsyncErrors(async (req, res, next) => {
    try {
        const {email,otp}=req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return next(new errorHandler("User not found", 404));
        }
        if (user.otp?.toString() !== otp?.toString()) {
            return next(new errorHandler("Invalid OTP", 401));
        }
        user.email_verified=true;
        await user.save();
        res.status(200).json({
            success: true,
            message: `Email verified successfully`
        })
    } catch (error) {
        console.error('Error Verifying Email: ', error);
        // Handle errors and redirect to an error page or send an error response
        next(new errorHandler(error.message, 500));
    }
})

exports.sendOTP = catchAsyncErrors(async (req, res, next) => {
    try {
        const {phone, email}=req.body;
        const otp = generateOTP();
        const otpData = new otpModel({
            phone,
            otp
        });
        await otpData.save();

        const user = await User.findOne({ email });
        if (!user) {
            return next(new errorHandler("User not found", 404));
        }
        user.phone=phone;
        await user.save();

        client.messages
            .create({
                body: `Your OTP for registration is ${otp}`,
                from: '+14403680987',
                to: `+91${phone}`
            })
            .then(message => {
                console.log(message.sid)
                res.status(200).json({
                    success: true,
                    message: `OTP sent successfully`
                })})
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    success: false,
                    message: `OTP not sent`
                })
            });
       

    } catch (error) {
        console.error('Error Sending OTP: ', error);
        // Handle errors and redirect to an error page or send an error response
        next(new errorHandler(error.message, 500));
    }
})

exports.verifyOTP = catchAsyncErrors(async (req, res, next) => {
    try {
        const {phone,otp}=req.body;
        const otpData = await otpModel.findOne({ phone });
        const user = await User.findOne({ phone });
        if (!otpData) {
            return next(new errorHandler("User not found", 404));
        }
        if (otpData.otp?.toString() !== otp?.toString()) {
            return next(new errorHandler("Invalid OTP", 401));
        }
        user.phone_verified=true;
        await user.save();

        res.status(200).json({
            success: true,
            message: `OTP verified successfully`
        })
        
    } catch (error) {
        console.error('Error Verifying OTP: ', error);
        // Handle errors and redirect to an error page or send an error response
        next(new errorHandler(error.message, 500));
    }
})

exports.generatePDF = catchAsyncErrors(async (req, res, next) => {
    try {
        const {name, desc, date} = req.body;
        const url = `https://api.placid.app/api/rest/pdfs`;
        let body = {
            "pages": [
                {
                    "template_uuid": "mb35p8z4ly5pi",
                    "layers": {
                        "name": {
                            "text": name
                        },
                        "description": {
                            "text": desc
                        },
                        "date": {
                            "text": date
                        }
                    }
                }
            ]
        }
        const config = {
            headers: {
                "Authorization": "Bearer placid-k2kli7z7ji0rh8ie-aahniz31hdqzkoq7",
                "Content-Type": "application/json"
            }
          };
        
        const response = await axios.post(url, body, config);
        console.log(response.data);
        res.status(200).json({
            success: true,
            message: `PDF generated successfully`,
            data: response.data
        })
    } catch (error) {
        console.error('Error Generating PDF: ', error);
        // Handle errors and redirect to an error page or send an error response
        next(new errorHandler(error.message, 500));
    }
});

exports.retrievePDF = catchAsyncErrors(async (req, res, next) => {
    try {
        const url = `https://api.placid.app/api/rest/pdfs/${req.body.id}`;
        const config = {
            headers: {
                "Authorization": "Bearer placid-k2kli7z7ji0rh8ie-aahniz31hdqzkoq7",
                "Content-Type": "application/json"
            }
          };
        
        const response = await axios.get(url, config);
        console.log(response.data);
        res.status(200).json({
            success: true,
            message: `PDF retrieved successfully`,
            data: response.data
        })
    } catch (error) {
        console.error('Error Retrieving PDF: ', error);
        // Handle errors and redirect to an error page or send an error response
        next(new errorHandler(error.message, 500));
    }
});

// Handle the Twitter OAuth callback


