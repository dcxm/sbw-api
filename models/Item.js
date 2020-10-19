const {Schema, model} = require('mongoose')

const Types = Schema.Types

const itemSchema = Schema({
    title: {
        type: Types.String,
        required: true
    },
    summary: {
        type: Types.String
    },
    completed: {
        type: Types.Boolean,
        default: false
    },
    content: {
        type: Types.String
    },
    collections: [{
        type: Types.ObjectId,
        ref: 'Collection'
    }],
    tags: [{
        type: Types.ObjectId,
        ref: 'Tag'
    }],
    users: [{
        type: Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true })

module.exports = model('Item', itemSchema)