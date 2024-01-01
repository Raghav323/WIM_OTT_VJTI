const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // Duration in minutes, for example
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  level: {
    type: String, // Beginner, Intermediate, Advanced, etc.
    required: true,
  },
  category: {
    type: String, // Programming, Design, Business, etc.
    required: true,
  },
  studentsEnrolled: {
    type: Number,
    default: 0,
  },
  videos: [
    {
      title: {
        type: String,
        trim: true,
      },
      videoUrl: {
        type: String,
      },
      duration: {
        type: Number,
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  }

 
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
