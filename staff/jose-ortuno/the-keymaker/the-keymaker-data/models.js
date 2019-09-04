const mongoose = require('mongoose')
const { user, key, deployment, invitation } = require('./schemas')

module.exports = {
    User: mongoose.model('User', user),
    Key: mongoose.model('Key', key),
    Deployment: mongoose.model('Deployment', deployment),
    Invitation: mongoose.model('Invitation', invitation)
}