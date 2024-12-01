const express = require('express')
const router = express.Router()
const webpush = require('web-push');
const axios = require('axios');
 
const PushSubscription = require('../models/PushSubscriptions')
const User = require('../models/Users')

const isAuth = require('../middlewares/isAuth')

webpush.setVapidDetails(
    'mailto:your-email@example.com',
    process.env.PUBLIC_VAPID_KEY,
    process.env.PRIVATE_VAPID_KEY
);

router.get('/', isAuth, async (req, res) => {
    const result = await User.findOne({ googleID: req.user.email });
    res.render('index', {
        googleID: req.user.email,
        notification: result.notification
    })
})

router.post('/subscribe', isAuth, async (req, res) => {
    const { subscription } = req.body;
    console.log('Received subscription:', subscription);
    
    try {
      const newSubscription = new PushSubscription({ ...subscription, googleID: req.user.email });
      await newSubscription.save();
      console.log('New subscription saved.');
      res.status(201).json({});
    } catch (error) {
      if (error.code === 11000) {
        console.log('Subscription already exists. Updating...');
        await PushSubscription.findOneAndUpdate(
          { endpoint: subscription.endpoint },
          { keys: subscription.keys, googleID: req.user.email }
        );
        res.status(200).json({});
      } else {
        console.error('Error handling subscription:', error);
        res.status(500).json({ error: 'Error handling subscription' });
      }
    }
});

router.post('/unsubscribe', isAuth, async (req, res) => {
    const { endpoint } = req.body;
    console.log('Received unsubscribe request for endpoint:', endpoint);
    try {
      await PushSubscription.deleteOne({ endpoint });
      console.log('Subscription deleted.');
      res.status(200).json({ message: 'Subscription deleted.' });
    } catch (error) {
      console.error('Error deleting subscription:', error);
      res.status(500).json({ error: 'Error deleting subscription' });
    }
});

router.post('/send-notification', async (req, res) => {
    const { googleID, payload } = req.body;
    console.log('Received notification request for googleID:', googleID);
    console.log('Payload:', payload);
  
    const subscriptions = await PushSubscription.find({ googleID });

    if (subscriptions.length === 0) {
        return res.status(200).json({ message: 'No subscriptions found.' });
    }
  
    const notificationPromises = subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(subscription, JSON.stringify(payload));
      } catch (error) {
        if (error.statusCode === 410) {
          console.log('Subscription has expired or is no longer valid:', subscription.endpoint);
          await PushSubscription.deleteOne({ endpoint: subscription.endpoint });
          console.log('Expired subscription removed.');
        } else {
          console.error('Error sending notification:', error);
        }
      }
    });
  
    try {
      await Promise.all(notificationPromises);
      res.status(200).json({ message: 'Notifications sent' });
    } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).json({ error: 'Error sending notification' });
    }
});

router.post('/cleanup-subscriptions', async (req, res) => {
    console.log('Cleaning up subscriptions...');
    try {
        const subscriptions = await PushSubscription.find({});
        if (subscriptions.length === 0) {
            return res.status(200).json({ message: 'No subscriptions found to clean up.' });
        }

        const cleanupPromises = subscriptions.map(async (subscription) => {
            try {
                // Send a silent notification to check if the subscription is still valid
                await webpush.sendNotification(subscription, JSON.stringify({ silent: true }));
            } catch (error) {
                if (error.statusCode === 410) {
                    console.log('Subscription has expired or is no longer valid:', subscription.endpoint);
                    await PushSubscription.deleteOne({ endpoint: subscription.endpoint });
                    console.log('Expired subscription removed.');
                } else {
                    console.error('Error verifying subscription:', error);
                    // Optionally, you can set a response status code here to indicate an error during processing
                    res.status(error.statusCode || 500).json({ error: 'Error during cleanup' });
                }
            }
        });

        await Promise.all(cleanupPromises);

        res.status(200).json({ message: 'Cleanup completed' });
    } catch (error) {
        console.error('Error during cleanup:', error);
        res.status(500).json({ error: 'Error during cleanup' });
    }
});

router.post('/update-user-notification', async (req, res) => {

    try {
        const { notification } = req.body;

        // Check if notification is a boolean
        if (typeof notification !== 'boolean') {
            return res.status(400).json({ error: 'Notification must be a boolean' });
        }

        if (!req.user) {
            return res.status(404).json({ error: 'User not found or cannot be updated' });
        }

        // Using findOneAndUpdate with upsert option
        const user = await User.findOneAndUpdate(
            { googleID: req.user.email },
            { 
                notification: notification,
                updatedAt: new Date()
            },
            { upsert: false } // upsert: create new if not found, new: return updated document
        );

        // Checking if the result is null or undefined, which indicates an error
        if (user) {
            res.status(200).json({ message: 'User notification updated successfully'})
        } else {
            return res.status(404).json({ error: 'User not found or cannot be updated' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
})

async function listGmailLabels(userEmail, accessToken) {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${userEmail}/labels`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        return response.data.labels;
    } catch (error) {
        console.error('Error listing labels:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function createGmailLabel(userEmail, accessToken, labelName) {
    const labels = await listGmailLabels(userEmail, accessToken)
    console.log("Labels: ", labels)

    const labelExists = labels.some(label => label.name.toLowerCase() === labelName.toLowerCase());

    if (labelExists) {
        console.log(`Label "${labelName}" already exists.`);
        return { exists: true, message: 'Label already exists', labelName };
    }
    
    const url = `https://gmail.googleapis.com/gmail/v1/users/${userEmail}/labels`;
    
    const labelData = {
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show',
        name: labelName
    };

    try {
        const response = await axios.post(url, labelData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Label created:', response.data);
        return { exists: false, data: response.data };
    } catch (error) {
        console.error('Error creating label:', error.response ? error.response.data : error.message);
        throw error;
    }
}

router.get('/create-label', isAuth, async (req, res) => {
    
    let user = await User.findOne({ googleID: req.user.email });

    if (user) {
        const labelName = "✔️"

        try {
            const result = await createGmailLabel(user.googleID, user.accessToken, labelName);
            if (result.exists) {
                res.status(409).json({ message: 'Label already exists', labelName: result.labelName });
            } else {
                res.status(201).json({ message: 'Label created successfully', label: result.data });
            }
        } catch (error) {  
            if (error.message && error.message.includes('401')) {
                res.status(401).json({ message: 'Unauthorized', error: error.message });
            } else {
                res.status(500).json({ message: 'Failed to create label', error: error.message });
            }
            // 401 access token not valid
            // 409 label name already exists
        }
    } else {
        res.sendStatus(404).json( {error: "User not found"} )
    }
});




// Exports 
module.exports = router 