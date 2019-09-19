const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

module.exports = new Schema({
    created_at: {
        type: Date,
        required: true,
    },
    valid_from: {
        type: Date,
        required: true,
    },
    valid_until: {
        type: Date,
        required: true,
    },
    token: {
        type: String,
        required: false,
    },
    used_at: {
        type: Date,
        required: false
    },
    canceled: {
        type: Date,
        required: false,
    },
    status: {
        type: String,
        enum: ['waiting', 'visited', 'expired', 'cancelled'],
        default: 'waiting',
        required: true
    },
    alias_guest: {
        type: String,
        required: true,
    },
    email_guest: {
        type: String,
        required: true,
        lowercase: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    deployment: { 
        type: ObjectId, 
        ref: 'Deployment',
        required: true
    },

    user: { type: ObjectId, ref: 'User' }
})