const errorHandler = require('../utils/errorHandler');
const catchAsyncErrors=require('../middleware/catchAsyncErrors');
const Twitter=require('../models/twitterModel');
const sendToken=require('../utils/jwttoken');
const sendEmail=require('../utils/sendEmail');
const crypto=require("crypto");

const axios = require('axios'); // Import Axios or your preferred HTTP request library

// const Twitter = require('../models/Twitter'); // Import your Twitter model here



exports.registerTwitterAccount = catchAsyncErrors(async (req, res, next) => {
  const { user_id, username } = req.body;

  // Validate that required fields are provided in the request body
  if (!user_id && !username) {
    return res.status(400).json({ error: 'Please provide user_id and username' });
  }

  // Define the API URL and optional query parameters based on username or user_id
  const apiUrl = 'https://twitter154.p.rapidapi.com/user/details';
  const queryParams = {};

  if (username) {
    queryParams.username = username;
  } else if (user_id) {
    queryParams.user_id = user_id;
  }

  try {
    // Define the headers for the API request
    const headers = {
      'X-RapidAPI-Key': '54cedd491emsh1ee8355d39c4aa1p11f4afjsnf6f9a22e1219',
      'X-RapidAPI-Host':  'twitter154.p.rapidapi.com',
    };

    // Make an HTTP GET request to the external API with headers and optional query parameters
    const apiResponse = await axios.get(apiUrl, { headers, params: queryParams });
    // console.log(apiResponse.data);
    // Extract the required data from the API response
    const {
      creation_date,
      user_id,
      username,
      name,
      follower_count,
      following_count,
      favourites_count,
      is_private,
      is_verified,
      is_blue_verified,
      location,
      profile_pic_url,
      profile_banner_url,
      description,
      external_url,
      number_of_tweets,
      bot,
      timestamp,
      has_nft_avatar,
      category,
      default_profile,
      default_profile_image,
      listed_count,
    } = apiResponse.data;

    // Check if the Twitter account already exists in the database based on username or user_id
    const existingAccount = await Twitter.findOne({ $or: [{ username }, { user_id }] });

    if (existingAccount) {
      return res.status(409).json({ error: 'Twitter account already exists' });
    }

    // Create a new Twitter account with the combined data
    const newTwitterAccount = new Twitter({
      creation_date,
      user_id,
      username,
      name,
      follower_count,
      following_count,
      favourites_count,
      is_private,
      is_verified,
      is_blue_verified,
      location,
      profile_pic_url,
      profile_banner_url,
      description,
      external_url,
      number_of_tweets,
      bot,
      timestamp,
      has_nft_avatar,
      category,
      default_profile,
      default_profile_image,
      listed_count,
    });

    // Save the new Twitter account to the database
    await newTwitterAccount.save();

    // Respond with a success message
    return res.status(201).json({ message: 'Twitter account registered successfully' });
  } catch (error) {
    console.error(error); // Log any errors for debugging purposes
    return res.status(500).json({ error: 'Registration failed' });
  }
});
