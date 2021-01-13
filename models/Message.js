const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
        receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        message: String,
        announcement: { type: Schema.Types.ObjectId, ref: 'Announcement', required: true }

}, {
        timestamps: true
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;