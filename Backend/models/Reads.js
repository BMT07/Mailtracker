const mongoose = require('mongoose')

const ReadSchema = new mongoose.Schema({

    trackingID: {
        type: String,
        required: true
    },

    timestamp: {
        type: Date,  
        default: Date.now
    },

    confirmed: {
        type: Boolean,  
        default: false
    }

})

const Read = mongoose.model('Read', ReadSchema)

Read.createIndexes(); 

module.exports = Read 