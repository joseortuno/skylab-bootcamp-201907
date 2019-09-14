const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

module.exports = new Schema({
    created_at: {
        type: Date,
        required: true,
    },
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
            default: 'Point'
        },
        coordinates: {
            type: [Number],
        }
    },
    status: {
        type: Boolean,
        required: true
    },
    user: { type: ObjectId, ref: 'User' }
})