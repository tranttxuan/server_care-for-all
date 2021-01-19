const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WebReviewSchema = new Schema({
        sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        review: String,
        rate: { type: Number, min: 0, max: 5, default:0 },

}, {
        timestamps: true
});

const WebReview = mongoose.model('WebReview', WebReviewSchema);

module.exports = WebReview;
