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
        required: true,
        trim: true,
      },
      videoUrl: {
        type: String,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },

  // assignments: [
  //   {
  //     QuestionAnswers: [
  //       {
  //         question: {
  //           type: String,
  //           required: true,
  //         },

  //         options: [
  //           {
  //             option: {
  //               type: String,
  //               required: true,
  //             },
  //           },
  //         ],
  //         answer: {
  //           type: String,
  //           required: true,
  //         },
  //       },
  //     ],
     
  //   },
  // ],
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
