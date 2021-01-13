const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
        service:{
                childCare:Boolean,
                seniorCare:Boolean,
                petCare:Boolean
        },
        additionalServices: {
                houseKeeping: Boolean,
                shoppingAndErrands: Boolean,
                specialNeedsCare: Boolean
        },
        description: String,
        formattedAddress: String,
        location: {
          type: {type: String, enum: ["Point"],},
          coordinates: {type: [Number]},
        },
        time:String,
        applicants: [{type: Schema.Types.ObjectId, ref:'User'}],
        author:{type: Schema.Types.ObjectId, ref:'User', required:true}
}, {
        timestamps: true
});

const Announcement = mongoose.model('Announcement', AnnouncementSchema);

module.exports = Announcement;