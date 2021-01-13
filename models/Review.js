const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
      sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      review: String,
      rate: { type: Number, min: 0, max: 5 },
}, {
      timestamps: true
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;