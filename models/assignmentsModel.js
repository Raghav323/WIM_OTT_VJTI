
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({

assignments: [


    {
      QuestionAnswers: [
        {
          question: {
            type: String,
            required: true,
          },

          options: [
            {
              option: {
                type: String,
                required: true,
              },
            },
          ],
          answer: {
            type: String,
            required: true,
          },
        },
      ],
     
    },
  ],

  courseId: {
    type: Number,
    required: true,
  }

  
});

const Assignment = mongoose.model('Course', assignmentSchema);

module.exports = Assignment;