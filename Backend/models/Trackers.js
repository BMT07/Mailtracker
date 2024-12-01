const mongoose = require('mongoose')

const TrackerSchema = new mongoose.Schema({

    trackingID: {
        type: String,  
        required: true,
        unique: true
    },

    trackingType: {
        type: String,
        enum: ['visible', 'invisible'],
        required: true
    },

    googleID: {
        type: String,
        required: true
    },

    notification: {
        type: Boolean,
        default: false,
        required: true
    },

    counter: {
        type: Number,
        default: 0,
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

const Tracker = mongoose.model('Tracker', TrackerSchema)

Tracker.createIndexes(); 

module.exports = Tracker 