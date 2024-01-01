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
const Course = require('../models/coursesModel');

// get all courses   =>   /api/courses

exports.getAllCourses = catchAsyncErrors(async (req, res, next) => {
    try {
        const courses = await Course.find();
        res.status(200).json({
            success: true,
            message: `Courses retrieved successfully`,
            data: courses
        })
    } catch (error) {
        console.error('Error Retrieving Courses: ', error);
        // Handle errors and redirect to an error page or send an error response
        next(new errorHandler(error.message, 500));
    }
});

// get single course   =>   /api/courses/:id
exports.getSingleCourse = catchAsyncErrors(async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return next(new errorHandler('Course not found', 404));
        }
        res.status(200).json({
            success: true,
            message: `Course retrieved successfully`,
            data: course
        })
    } catch (error) {
        console.error('Error Retrieving Course: ', error);
        // Handle errors and redirect to an error page or send an error response
        next(new errorHandler(error.message, 500));
    }
});

// create new course   =>   /api/courses/new
exports.newCourse = catchAsyncErrors(async (req, res, next) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json({
            success: true,
            message: `Course created successfully`,
            data: course
        })
    } catch (error) {
        console.error('Error Creating Course: ', error);
        // Handle errors and redirect to an error page or send an error response
        next(new errorHandler(error.message, 500));
    }
});

// update course   =>   /api/courses/:id
exports.updateCourse = catchAsyncErrors(async (req, res, next) => {
    try {
        let course = await Course.findById(req.params.id);
        if (!course) {
            return next(new errorHandler('Course not found', 404));
        }
        course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });
        res.status(200).json({
            success: true,
            message: `Course updated successfully`,
            data: course
        })
    } catch (error) {
        console.error('Error Updating Course: ', error);
        // Handle errors and redirect to an error page or send an error response
        next(new errorHandler(error.message, 500));
    }
});

exports.buyCourse = catchAsyncErrors(async (req, res, next) => {
    try {
        const { courseId, userId, payment_id, order_id, signature } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            return next(new errorHandler('Course not found', 404));
        }
        if (course.studentsEnrolled === course.maxStudents) {
            return next(new errorHandler('Course is full', 404));
        }
        course.studentsEnrolled = course.studentsEnrolled + 1;
        await course.save();
        const user = await User.findById(userId);
        if (!user) {
            return next(new errorHandler('User not found', 404));
        }
        const courseDetail = {
            courseId: courseId,
            payment_id: payment_id,
            order_id: order_id,
            signature: signature,
            course: course,
            isCompleted: false,
        }
        user.coursesEnrolled.push(courseDetail);
        await user.save();

        res.status(200).json({
            success: true,
            message: `Course bought successfully`,
            data: user
        })
    } catch (error) {
        console.error('Error Buying Course: ', error);
        // Handle errors and redirect to an error page or send an error response
        next(new errorHandler(error.message, 500));
    }
});
