//Creating token and storing it in a cookie
const nodemailer = require('nodemailer');

const sendToken=(user,statusCode,res)=>{
    const token =user.getJWTToken();
    //options for cookie
    const options={
        expires:new Date(
            Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000
        ),
        httpOnly:true,
    };
    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        user:{
            name:user.name,
            email:user.email,
            role:user.role,
            avatar:user.avatar,
            phone: user.phone,
        },
        token,
    });
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'ottvjti@gmail.com',
            pass: 'crlp daxf thbm bhpy',
        },
    });
    try{
        let mailOptions = {
            from: 'ottvjti@gmail.com',
            to: user.email,
            subject: `OTP for VJTI Moocs Registration`,
            text: `Your OTP for registration is ${user.otp}`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }catch(err){
        console.log(err);
    }
        
};
module.exports=sendToken;