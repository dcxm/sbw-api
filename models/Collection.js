const { Schema, model } = require('mongoose')

const Types = Schema.Types

const collectionSchema = Schema({
    title: {
        type: Types.String,
        required: true
    },
    description: {
        type: Types.String
    }
}, { timestamps: true })

module.exports = model('Collection', collectionSchema)