const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

module.exports = new Schema ({
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
        required: true,
    },
    used_at: {
        type: Date,
        required: true
    },
    canceled: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true
    },
    depolyment: [
        { type: ObjectId, ref: 'Deployment' }
    ],
    user: [
        { type: ObjectId, ref: 'User' }
    ],
    invitation: [
        { type: ObjectId, ref: 'Invitation' }
    ]
})