const express= require('express');
const app=express();
const errorMiddleware=require('./middleware/error');
const cookieParser=require('cookie-parser');
app.use(express.json())
app.use(cookieParser());
const user=require('./routes/userRoute');
app.use("/api/v1",user);
const twitter=require('./routes/twitterRoute');
app.use("/api/v1",twitter);
app.use(errorMiddleware);

//Middleware for error
module.exports=app
