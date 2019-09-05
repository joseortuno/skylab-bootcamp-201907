const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

module.exports = new Schema({
    logo: {
        type: String,
        required: false
    },
    alias: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: false
        },
        coordinates: {
            type: [Number],
            required: false
        }
    },
    img: [
        {
            type: String,
            required: true
        }
    ],
    status: {
        type: Boolean,
        required: true
    },
    user: [
        { type: ObjectId, ref: 'User' }
    ]
})