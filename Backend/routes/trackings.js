var express = require('express')
var router = express.Router()
const axios = require('axios')

const { v4: uuidv4 } = require('uuid');

const User = require('../models/Users') 
const Tracker = require('../models/Trackers')
const Read = require('../models/Reads')

const validateApiKey = require('../middlewares/validateApiKey')

const checkUserExists = async (googleID) => {
    return await User.findOne({ googleID: googleID });
};

async function getAccessToken(googleID, refreshToken) {
    try {
        // Retrieve user from the database
        const user = await User.findOne({ googleID });

        if (!user) {
            throw new Error('User not found');
        }

        // Check if the current access token is valid
        const accessToken = user.accessToken;
        const isValid = await checkTokenValidity(accessToken);

        if (isValid) {
            // Token is valid, return it
            return accessToken;
        } else {
            // Token is invalid, generate a new one using the refresh token
            const newAccessToken = await generateNewAccessToken(refreshToken);

            // Update the user's access token in the database
            user.accessToken = newAccessToken;
            user.updatedAt = new Date();
            await user.save();

            return newAccessToken;
        }
    } catch (error) {
        console.error('Error in getAccessToken:', error.message);
        throw error;
    }
}

// Function to check if the current access token is valid
async function checkTokenValidity(accessToken) {
    const url = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + accessToken;

    try {
        const response = await axios.get(url);
        // If the response is successful, the token is valid
        return response.status === 200;
    } catch (error) {
        // If an error occurs, the token is likely invalid
        return false;
    }
}

// Function to generate a new access token using the refresh token
async function generateNewAccessToken(refreshToken) {
    const url = 'https://oauth2.googleapis.com/token';

    const params = {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
    };

    try {
        const response = await axios.post(url, null, { params });
        return response.data.access_token;
    } catch (error) {
        console.error('Error generating new access token:', error.response ? error.response.data : error.message);
        
        // Find the user by the refresh token
        const user = await User.findOne({ refreshToken });
        if (user) {
            // Update googleConsent to false
            user.googleConsent = false;
            user.updatedAt = new Date();
            await user.save();
        }

        throw new Error('Failed to generate new access token');

    }
}

router.post('/create-tracker', validateApiKey, async (req, res) => {

    try {
        var { googleID, trackingType, notification, lang } = req.body;
        
        var trackingID = uuidv4().replace(/-/g, '');

        // Check if the user exists
        let user = await checkUserExists(googleID);

        // key = new APIKey({
        //     owner: 'test'
        // });
        // await key.save();

        if (!user) {
            user = new User({
                googleID: googleID,
                lang: lang
            });
            user.updatedAt = new Date();
            await user.save();
        }

        // Check user's plan if trackingType is 'invisible'
        if (trackingType === 'invisible' && user.plan === 'free') {
            return res.status(403).json({ error: 'Users with a free plan cannot create invisible trackers.' });
        }

        const newTracker = new Tracker({
            trackingID: trackingID,
            trackingType: trackingType,
            googleID: googleID,
            notification: notification
        });

        await newTracker.save();
        res.status(200).json({ trackingID: trackingID });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while creating the tracker.' });
    }
});

router.post('/delete-tracker', validateApiKey, async (req, res) => {

    try {
        const { trackingID } = req.body;

        // Attempt to delete the tracker by its trackingID
        const result = await Tracker.deleteOne({ trackingID: trackingID });

        // Check if a tracker was deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Tracker not found' });
        }

        res.status(200).json({ message: 'Tracker deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while deleting the tracker' });
    }
});

async function searchSentEmailByTrackingID(googleID, refreshToken, trackingID) {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${googleID}/messages`;

    try {
        // Search for emails in the sent folder with the specified tracking ID
        let accessToken = await getAccessToken(googleID, refreshToken)

        console.log(`in:sent tracker_id${trackingID}`)

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            params: {
                q: `in:sent tracker_id${trackingID}`
            }
        });

        const messages = response.data.messages;
        console.log(messages)

        if (messages && messages.length > 0) {
            const emailId = messages[0].id;

            // Get the full message details to extract the subject
            const messageDetailsUrl = `${url}/${emailId}`;
            
            const detailsResponse = await axios.get(messageDetailsUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const headers = detailsResponse.data.payload.headers;
            const subjectHeader = headers.find(header => header.name === 'Subject');
            const subject = subjectHeader ? subjectHeader.value : '(No Subject)';
            
            return {
                id: emailId,
                subject: subject
            };
        } else {
            // No email found with the specified tracking ID
            return null;
        }
    } catch (error) {
        console.error('Error searching for sent email by tracking ID:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function addLabelToEmail(googleID, refreshToken, mailID) {
    const labelsUrl = `https://gmail.googleapis.com/gmail/v1/users/${googleID}/labels`;
    const modifyUrl = `https://gmail.googleapis.com/gmail/v1/users/${googleID}/messages/${mailID}/modify`;

    let labelName = "✔️"

    try {
        let accessToken = await getAccessToken(googleID, refreshToken)
        // Step 1: Get all labels to find the label ID by labelName
        const labelsResponse = await axios.get(labelsUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const labels = labelsResponse.data.labels;
        const label = labels.find(l => l.name === labelName);

        let labelID;

        // Step 2: If the label does not exist, create it
        if (!label) {
            const createLabelResponse = await axios.post(labelsUrl, {
                name: labelName
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            labelID = createLabelResponse.data.id;
        } else {
            labelID = label.id;
        }

        // Step 3: Add the label to the specified email
        const modifyResponse = await axios.post(modifyUrl, {
            addLabelIds: [labelID]
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return modifyResponse.status === 200;
    } catch (error) {
        console.error('Error adding label to email:', error.response ? error.response.data : error.message);
        throw error;
    }
}

router.get('/read-tracker', async (req, res) => {
    try { 
        const trackingID = req.query.trackingID;

        // Retrieve the tracker without updating it yet
        const tracker = await Tracker.findOne({ trackingID: trackingID });

        if (!tracker) {
            return res.status(404).json({ error: 'Tracker not found' });
        }

        // Retrieve the last read entry for this trackingID
        const lastRead = await Read.findOne({ trackingID: trackingID }).sort({ timestamp: -1 });

        // If a last read exists, check the time difference
        let shouldCreateReadAndSendNotification = true;
        if (lastRead) {
            const now = new Date();
            const lastReadTime = new Date(lastRead.timestamp);
            const timeDiff = (now - lastReadTime) / 1000; // Time difference in seconds
            // console.log('timeDiff: ', timeDiff)

            if (timeDiff < 30) {
                shouldCreateReadAndSendNotification = false;
            }
        }

        if (shouldCreateReadAndSendNotification) {
            // Proceed with updating the tracker and creating a new read
            await Tracker.findOneAndUpdate(
                { trackingID: trackingID },
                { 
                    $inc: { counter: 1 }, // Increment counter by 1
                    updatedAt: new Date() 
                }, 
                { upsert: false } // upsert: create new if not found, new: return updated document
            );

            const newRead = new Read({ trackingID: trackingID });
            await newRead.save();

            if (tracker.notification) {
                try { 
                    let user = await User.findOne({ googleID: tracker.googleID });

                    let { id: mailID, subject: mailSubject } = await searchSentEmailByTrackingID(user.googleID, user.refreshToken, trackingID);

                    // Now you can use mailID and mailSubject as needed
                    console.log('Mail ID:', mailID);
                    console.log('Mail Subject:', mailSubject);

                    try {
                        const success = await addLabelToEmail(user.googleID, user.refreshToken, mailID);
                        if (success) {
                            console.log(`Label "${labelName}" added to email with ID: ${mailID}`);
                        } else {
                            console.log('Failed to add label to email.');
                        }
                    } catch (error) {
                        console.error('Failed to add label to email:', error.message);
                    }

                    let url = `http://${req.get('host')}/notifications/send-notification`;

                    const notificationData = {
                        googleID: tracker.googleID,
                        payload: {
                            title: "New read",
                            body: `Subject: ${mailSubject}`
                        }
                    };

                    await axios.post(url, notificationData);
                    console.log('Notification sent successfully');
                } catch (notificationError) {
                    console.error('Error sending notification:', notificationError);
                }
            }
        }

        // Build the image path based on the tracking type
        let trackingType = tracker.trackingType;
        let imagePath = '';

        if (trackingType === 'visible') {
            imagePath = 'images/visible_tracker.jpeg'; // Example path to visible image
        } else if (trackingType === 'invisible') {
            imagePath = 'images/invisible_tracker.png'; // Example path to invisible image
        } else {
            return res.status(400).json({ error: 'Invalid trackingType' });
        }

        // Build the full URL for the image
        const imageUrl = `${req.protocol}://${req.get('host')}/${imagePath}`;

        // Redirect to the image URL
        return res.redirect(302, imageUrl);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});

router.post('/sender-read', validateApiKey, async (req, res) => {
    try {
        const { trackingID } = req.body;

        // First, find the tracker by trackingID to check the current counter value
        const tracker = await Tracker.findOne({ trackingID: trackingID });

        if (!tracker) {
            return res.status(404).json({ error: 'Tracker not found' });
        }

        // Check if the counter is already at 0
        if (tracker.counter > 0) {
            // If counter is greater than 0, decrement it and update the updatedAt field
            await Tracker.findOneAndUpdate(
                { trackingID: trackingID },
                { 
                    $inc: { counter: -1 }, // Decrement counter by 1
                    updatedAt: new Date()
                },
                { upsert: false } // Do not create a new tracker if not found
            );

            // Find and delete the most recent read entry for the given trackingID
            const lastRead = await Read.findOne({ trackingID: trackingID }).sort({ timestamp: -1 });

            if (lastRead) {
                await Read.deleteOne({ _id: lastRead._id });
                console.log('Last read entry deleted successfully');
            } else {
                console.log('No read entry found for the given trackingID');
            }

            return res.status(200).json({ message: 'Tracker sender read deleted successfully' });
        } else {
            // If the counter is already at 0, do not decrement
            console.log('Counter is already at 0, no action taken');
            return res.status(200).json({ message: 'Counter is already at 0, no action taken' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});

router.post('/is-open', validateApiKey, async (req, res) => {

    try {
        const { trackingIDs } = req.body;

        if (!Array.isArray(trackingIDs) || trackingIDs.length === 0) {
            return res.status(400).json({ error: 'trackingIDs must be a non-empty array' });
        }

        const results = await Promise.all(trackingIDs.map(async trackingID => {
            if (typeof trackingID !== 'string' || !trackingID.trim()) {
                return { trackingID: trackingID, error: 'Invalid trackingID' };
            }

            const tracker = await Tracker.findOne({ trackingID: trackingID });

            if (!tracker) {
                return { trackingID: trackingID, error: 'Tracker not found' };
            }

            return { trackingID: trackingID, counter: tracker.counter, notification: tracker.notification };
        }));

        res.status(200).json(results); 

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }

})

router.post('/user-plan', validateApiKey, async (req, res) => {

    try {
        const { googleID } = req.body;

        userExists = await checkUserExists(googleID)

        User.findOne({ googleID: googleID })
        .then(user => {
            if (user) {
                return res.status(200).json({ plan: user.plan })
            } else {
                return res.status(404).json({ error: 'User not found' });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while getting the user plan' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }

})

router.post('/user-consent', validateApiKey, async (req, res) => {

    try {
        const { googleID } = req.body;

        User.findOne({ googleID: googleID })
        .then(user => {
            if (user) {
                return res.status(200).json({ consent: user.googleConsent })
            } else {
                return res.status(404).json({ error: 'User not found' });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while getting the user consent' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }

})

router.post('/update-consent', validateApiKey, async (req, res) => {

    try {
        const { googleID, consent } = req.body;

        // Check if notification is a boolean
        if (typeof consent !== 'boolean') {
            return res.status(400).json({ error: 'Google consent must be a boolean' });
        }

        // Using findOneAndUpdate with upsert option
        const user = await User.findOneAndUpdate(
            { googleID: googleID },
            { 
                googleConsent: consent,
                updatedAt: new Date()
            },
            { upsert: false } // upsert: create new if not found, new: return updated document
        );

        // Checking if the result is null or undefined, which indicates an error
        if (user) {
            res.status(200).json({ message: 'User consent updated successfully'})
        } else {
            return res.status(404).json({ error: 'User not found or cannot be updated' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }

})

router.post('/history', validateApiKey, async (req, res) => {

    try {
        const { trackingID } = req.body;

        if (!trackingID) {
            return res.status(400).json({ error: 'trackingID is required' });
        }

        const tracker = await Tracker.findOne({ trackingID: trackingID });

        if (!tracker) {
            return { trackingID: trackingID, error: 'Tracker not found' };
        }

        // Find all reads with the given trackingID, ordered by timestamp
        const reads = await Read.find({ trackingID: trackingID }).sort({ timestamp: -1 }).select('timestamp -_id');

        // Extract the timestamps
        const timestamps = reads.map(read => read.timestamp);

        res.status(200).json({ 
            history: timestamps,
            notification: tracker.notification
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});

router.post('/update-plan', validateApiKey, async (req, res) => {

    try {
        const { googleID, plan } = req.body;

        // Check if plan is one of the allowed values
        const validPlans = ['free', 'monthly', 'yearly'];
        if (!validPlans.includes(plan)) {
            return res.status(400).json({ error: 'Plan must be either "free", "monthly", or "yearly"' });
        }

        const user = await User.findOneAndUpdate(
            { googleID: googleID },
            { 
                plan: plan, 
                updatedAt: new Date()
            },
            { upsert: false } // upsert: create new if not found, new: return updated document
        );

        if (user) {
            return res.status(200).json({ messages: 'User plan updated successfully' });
        } else {
            return res.status(404).json({ error: 'User not found or cannot be updated' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
})

router.post('/update-settings', validateApiKey, async (req, res) => {

    try {
        const { googleID, lang, timezone } = req.body;

        // Check if plan is one of the allowed values
        const validLangs = ['en', 'es', 'fr', 'it'];
        if (!validLangs.includes(lang)) {
            return res.status(400).json({ error: 'Plan must be either "en", "es", "fr" or "it"' });
        }

        // Using findOneAndUpdate with upsert option
        const user = await User.findOneAndUpdate(
            { googleID: googleID },
            { 
                $set: { lang: lang, timezone: timezone },
                updatedAt: new Date()
            },
            { upsert: false } // upsert: create new if not found, new: return updated document
        );

        // Checking if the result is null or undefined, which indicates an error
        if (user) {
            return res.status(200).json({ message: 'Settings updated succesfully' });
        } else {
            return res.status(404).json({ error: 'User not found or cannot be updated' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }

})

router.post('/update-notification', validateApiKey, async (req, res) => {

    try {
        const { trackingID, notification } = req.body;

        // Check if notification is a boolean
        if (typeof notification !== 'boolean') {
            return res.status(400).json({ error: 'Notification must be a boolean' });
        }

        // Using findOneAndUpdate with upsert option
        const tracker = await Tracker.findOneAndUpdate(
            { trackingID: trackingID },
            { 
                notification: notification,
                updatedAt: new Date()
            },
            { upsert: false } // upsert: create new if not found, new: return updated document
        );

        // Checking if the result is null or undefined, which indicates an error
        if (tracker) {
            return res.status(200).json({ message: 'Tracker notification updated successfully' });
        } else {
            return res.status(404).json({ error: 'Tracker not found or cannot be updated' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }

})

// Exports 
module.exports = router 