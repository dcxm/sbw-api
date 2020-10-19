const {Schema, model} = require('mongoose')

const Types = Schema.Types

const tagSchema = Schema({
    name: {
        type: Types.String,
        required: true
    },
    items: [{
        type: Types.ObjectId,
        ref: 'Item'
    }],
    collections: [{
        type: Types.ObjectId,
        ref: 'Collection'
    }],
    users: [{
        type: Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true })

module.exports = model('Tag', tagSchema)