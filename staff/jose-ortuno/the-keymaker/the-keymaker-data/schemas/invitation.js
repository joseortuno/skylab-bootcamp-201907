const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

module.exports = new Schema ({
    alias: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    depolyment: [
        { type: ObjectId, ref: 'Deployment' }
    ],
    key: [
        { type: ObjectId, ref: 'Key' }
    ]
})