const { Schema, model } = require('mongoose')

const Types = Schema.Types

const collectionSchema = Schema({
    title: {
        type: Types.String,
        required: true
    },
    description: {
        type: Types.String
    },
    items: [{
        type: Types.ObjectId,
        ref: 'Item'
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

module.exports = model('Collection', collectionSchema)