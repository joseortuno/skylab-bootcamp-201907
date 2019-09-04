const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

module.exports = new Schema ({
    logo: {
        type: String,
        required: false
    },
    alias: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
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