const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    googleID: {
        type: String,
        required: true,
        unique : true,
        index: true 
    },

    googleName: {
        type: String,
        required: true,
    },

    googleConsent: {
        type: Boolean,
        required: true,
        default: false
    },

    accessToken: {
        type: String,
        required: true,
    },

    refreshToken: {
        type: String,
        required: true,
    },

    stripeId: {
        type: String,
        required: true
    },

    subscriptionId: {
        type: String,
        default: null
    },

    scheduledSubscriptionId: {
        type: String,
        default: null
    },

    scheduledSubscriptionType: {
        type: String,
        enum: ['none', 'monthly', 'yearly'],
        default: 'none'
    },

    scheduledSubscriptionStartDate: {
        type: String,
        default: null
    },

    subscriptionType: {
        type: String, 
        enum: ['free', 'daily', 'monthly', 'yearly'],
        required: true,
        default: 'free'
    }, 

    subscriptionEndDate: {
        type : String,
        default: null
    },

    isSuspended: {
        type: Boolean,
        default: false
    },

    suspensionDate: {
        type: String,
        default: null
    },

    paymentUrl: {
        type: String,
        default: null
    },

    retryCount: {
        type: Number,
        default: 0
    },

    plan: {
        type: String, 
        enum: ['free', 'daily', 'monthly', 'yearly'],
        required: true,
        default: 'free'
    }, 

    endDate: {
        type: Date,  
        required: false
    },

    lang: {
        type: String, 
        enum: ['en', 'es', 'fr', 'it'],
        required: true,
        default: 'en'
    }, 

    notification: {
        type: Boolean,
        required: true,
        default: false
    },

    timezone: {
        type: String,
        required: false
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

const User = mongoose.model('User', UserSchema)

User.createIndexes(); 

module.exports = User 