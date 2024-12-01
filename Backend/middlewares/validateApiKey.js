const APIKey = require('../models/APIKeys')

const validateApiKey = async (req, res, next) => {
    const apiKey = req.header('x-api-key');
    
    if (!apiKey) {
        return res.status(401).json({ error: 'API key is required' });
    }

    const key = await APIKey.findOne({ key: apiKey });
    
    if (!key) {
        return res.status(403).json({ error: 'Invalid API key' });
    }

    next();
};

module.exports = validateApiKey;