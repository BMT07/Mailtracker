const mongoose = require('mongoose')

const PushSubscriptionSchema = new mongoose.Schema({

    endpoint: {
        type: String,  
        required: true,
        unique: true
    },

    keys: {
        p256dh: String,
        auth: String
    },

    googleID: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,  
        default: Date.now
    },

    updatedAt: {
        type: Date,  
        default: Date.now
    }

})

const PushSubscription = mongoose.model('PushSubscription', PushSubscriptionSchema)

PushSubscription.createIndexes(); 

module.exports = PushSubscription 