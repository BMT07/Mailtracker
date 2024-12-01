const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');

const APIKeySchema = new mongoose.Schema({

    owner: {
        type: String,
        required: true
    },

    key: {
        type: String,
        unique: true,
        default: () => uuidv4().replace(/-/g, '')
    },

    createdAt: {
        type: Date,  
        default: Date.now
    }

})

const APIKey = mongoose.model('APIKey', APIKeySchema)

APIKey.createIndexes(); 

module.exports = APIKey 