const mongoose = require('mongoose');
const NewsSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,

    },
    image: {
        type: String,
        required: true,
    }
    
});

const News = mongoose.model('News', NewsSchema);

module.exports = News;