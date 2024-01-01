const express= require('express');
const app=express();
const errorMiddleware=require('./middleware/error');
const cookieParser=require('cookie-parser');
const cors = require('cors');
app.use(cors());
app.use(express.json())
app.use(cookieParser());
const user=require('./routes/userRoute');
app.use("/api/v1",user);
const twitter=require('./routes/twitterRoute');
app.use("/api/v1",twitter);
app.use(errorMiddleware);
const course=require('./routes/courseRoute');
app.use("/api/v1/courses",course);
const news = require('./routes/newsRoute');
app.use("/api/v1",news);
//Middleware for error
module.exports=app
