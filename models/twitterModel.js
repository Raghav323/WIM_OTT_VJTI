const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
  tweet_id: {
    type: String,
    required: [true, "Please Enter Tweet ID"],
  },
  creation_date: {
    type: Date,
  },
  media_url: {
    type: String,
  },
  video_url: {
    type: String,
  },
  text: {
    type: String,
    required: [true, "Please Enter Tweet Text"],
  },
  language: {
    type: String,
    required: [true, "Please Enter Tweet Language"],
  },
  favorite_count: {
    type: Number,
  },
  retweet_count: {
    type: Number,
  },
  reply_count: {
    type: Number,
  },
  quote_count: {
    type: Number,
  },
  retweet: {
    type: Boolean,
  },
  views: {
    type: Number,
  },
  timestamp: {
    type: Number,
  },
  video_view_count: {
    type: String,
  },
  in_reply_to_status_id: {
    type: String,
  },
  quoted_status_id: {
    type: String,
  },
  retweet_tweet_id: {
    type: String,
  },
  conversation_id: {
    type: String,
    required: [true, "Please Enter Conversation ID"],
  },
  retweet_status: {
    type: String,
  },
  bookmark_count: {
    type: Number,
  },
  source: {
    type: String,
  },
  user: {
    type: String,
  },
  Replies: {
    type: String,
  },
});

const twitterSchema = new mongoose.Schema({
  creation_date: {
    type: Date,
  },
  user_id: {
    type: String,
  },
  username: {
    type: String,
    required: [true, "Please Enter Your UserName"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  name: {
    type: String,
  },
  follower_count: {
    type: Number,
  },
  following_count: {
    type: Number,
  },
  favourites_count: {
    type: Number,
  },
  is_private: {
    type: Boolean,
  },
  is_verified: {
    type: Boolean,
  },
  is_blue_verified: {
    type: Boolean,
  },
  location: {
    type: String,
  },
  profile_pic_url: {
    type: String,
  },
  profile_banner_url: {
    type: String,
  },
  description: {
    type: String,
  },
  external_url: {
    type: String,
  },
  number_of_tweets: {
    type: Number,
  },
  bot: {
    type: Boolean,
  },
  timestamp: {
    type: Number,
  },
  has_nft_avatar: {
    type: Boolean,
  },
  category: {
    name:{
      type: String,
    },
    id:{
      type:Number
    }
    
  },
  default_profile: {
    type: Boolean,
  },
  default_profile_image: {
    type: Boolean,
  },
  listed_count: {
    type: Number,
  },
  tweets: [tweetSchema],
});

module.exports = mongoose.model("Twitter", twitterSchema);
