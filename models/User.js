const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true},
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  birthday: String,
  phoneNumber: String,
  formattedAddress: String,
  location: {
    type: {type: String, enum: ["Point"],},
    coordinates: {type: [Number]},
  },
  image: {type: String, default: "https://cdn.pixabay.com/photo/2017/06/13/12/53/profile-2398782_1280.png"},
  description: String,
  experiences: String,
  availability: String,
  service: {
    childCare: Boolean,
    seniorCare: Boolean,
    petCare: Boolean
  },
  additionalServices: {
    houseKeeping: Boolean,
    shoppingAndErrands: Boolean,
    specialNeedsCare: Boolean,
    homeworkAssistance: Boolean
  },
  isProvider: { type: Boolean, default: false },
  favoriteUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  role: { type: String, enum: ["admin", "user"], default: 'user' },

}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
