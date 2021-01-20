const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
        receiver: { type: Schema.Types.ObjectId, ref: 'User' },
        sender: { type: Schema.Types.ObjectId, ref: 'User'},
        messagesBox: [{
                message:String,
                author:String
        }],
        announcement: { type: Schema.Types.ObjectId, ref: 'Announcement'}

}, {
        timestamps: true
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;