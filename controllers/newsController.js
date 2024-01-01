const errorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const News = require('../models/newsModel');


exports.getAllNews = catchAsyncErrors(async (req, res, next) => {
    try {
        const news = await News.find();
        res.status(200).json({
            success: true,
            message: `All News retrieved successfully`,
            data: news
        })
    } catch (error) {
        console.error('Error Retrieving News: ', error);
        // Handle errors and redirect to an error page or send an error response
        next(new errorHandler(error.message, 500));
    }

});

exports.getSingleNews = catchAsyncErrors(async (req, res, next) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return next(new errorHandler('News not found', 404));
        }
        res.status(200).json({
            success: true,
            message: `News retrieved successfully`,
            data: news
        })
    } catch (error) {
        console.error('Error Retrieving News: ', error);
        next(new errorHandler(error.message, 500));
    }
});


exports.newNews = catchAsyncErrors(async (req, res, next) => {
    try {

        const news = await News.create(req.body);
        res.status(201).json({
            success: true,
            message: `News created successfully`,
            data: news
        })

    } catch (error) {
        console.log(req.body);

        console.error('Error Creating News: ', error);
        // Handle errors and redirect to an error page or send an error response
        next(new errorHandler(error.message, 500));
    }
});


exports.deleteNews = catchAsyncErrors(async (req, res, next) => {
    const news = await News.findById(req.params.id)

    if (!news) {
        return next(new errorHandler(`News does not exist with id :${req.params.id}`, 400));
    }

    await news.deleteOne();

    res.status(200).json({
        success: true,
        news
    })


    // sendToken(user, 200, res);
});


exports.updateNews = catchAsyncErrors(async (req, res, next) => {
    try {
        const newsId  = req.body.newsId;

        // Check if the news with the given ID exists
        const news = await News.findById(newsId);

        if (!news) {
            return next(new errorHandler(`News with ID ${newsId} not found`, 404));
        }

        // Update news details
        news.title = req.body.title || news.title;
        news.description = req.body.description || news.description;
        news.image = req.body.image || news.image;

        const updatedNews = await news.save();

        res.status(200).json({
            success: true,
            message: `News with ID ${newsId} updated successfully`,
            data: updatedNews
        });

    } catch (error) {
        console.error('Error Updating News: ', error);
        // Handle errors and redirect to an error page or send an error response
        next(new errorHandler(error.message, 500));
    }
});