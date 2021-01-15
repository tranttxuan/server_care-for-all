const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
        service: {
                childCare: { type: Boolean, default: false },
                seniorCare: { type: Boolean, default: false },
                petCare: { type: Boolean, default: false },
        },
        additionalServices: {
                houseKeeping: { type: Boolean, default: false },
                shoppingAndErrands: { type: Boolean, default: false },
                specialNeedsCare: { type: Boolean, default: false },
                homeworkAssistance: { type: Boolean, default: false },
        },
        title: String,
        description: String,
        formattedAddress: String,
        location: {
                type: { type: String, enum: ["Point"], },
                coordinates: { type: [Number] },
        },
        time: String,
        applicants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
        timestamps: true
});

const Announcement = mongoose.model('Announcement', AnnouncementSchema);

module.exports = Announcement;