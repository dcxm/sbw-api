const {Schema, model, mongoose} = require('mongoose')
require('mongoose-type-email')

const Types = Schema.Types

const userSchema = Schema({
    password: {
        type: String,
        min: 6,
        required: true
    },
    email: {
        type: Types.Email,
        unique: true,
        required: true
    },
    items: [{
        type: Types.ObjectId,
        ref: 'Item'
    }],
    collections: [{
        type: Types.ObjectId,
        ref: 'Collection'
    }]
}, { timestamps: true })

module.exports = model('User', userSchema)

