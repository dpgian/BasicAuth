const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    regDate: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('User', UserSchema)