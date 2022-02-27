const mongoose = require('mongoose')

const Schema = mongoose.Schema

const commentSchema = new Schema({
    username: { type: String, required: true },
    comment: { type: String, require: true },
    senderid: { type: Number, require: true },
    file_name:{ type: String, },
    recievid: { type: Number}
}, { timestamps: true })

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment