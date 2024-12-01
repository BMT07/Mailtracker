var express = require('express')
var router = express.Router()
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const axios = require('axios');
const User = require('../models/Users')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const checkUserExists = async (googleId) => {
    return await User.findOne({ googleID: googleId });
};

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_AUTH_CALLBACK,
  passReqToCallback: true,
  accessType: 'offline',  // Request offline access to get a refresh token
  prompt: 'consent',
},
async function(request, accessToken, refreshToken, profile, done) {
    console.log("Refresh Token: ", refreshToken)
    console.log("Access Token: ", accessToken)
    let user = await checkUserExists(profile.email);

    if (!user) {

        const stripeCustomer = await stripe.customers.create({
            email: profile.email,
        });

        user = new User({
            googleID: profile.email,
            googleName: profile.displayName,
            googleConsent: true,
            accessToken: accessToken,
            refreshToken: refreshToken,
            stripeId: stripeCustomer.id
        });
        await user.save();
    } else {
        user.accessToken = accessToken
        user.refreshToken = refreshToken
        user.updatedAt = new Date();
        await user.save();
    }

    createLabel(user.googleID)

    return done(null, profile);
}));

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

    const labelExists = labels.some(label => label.name.toLowerCase() === labelName.toLowerCase());

    if (labelExists) {
        // console.log(`Label "${labelName}" already exists.`);
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

        return { exists: false, data: response.data };
    } catch (error) {
        console.error('Error creating label:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function createLabel(googleID) {
    let user = await User.findOne({ googleID: googleID });

    if (user) {
        const labelName = "✔️"

        try {
            const result = await createGmailLabel(user.googleID, user.accessToken, labelName);
            
            if (result.exists) {
                console.log('Label already exists:', result.labelName)
            } else {
                console.log('Label created successfully:', result.data);
            }
        } catch (error) {
            if (error.message && error.message.includes('401')) {
                console.error('Unauthorized:', error.message);
            } else {
                console.error('Failed to create label:', error.message);
            }
        }
    } else {
        console.error('User not found');
    }
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

router.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});

router.get('/google',
    passport.authenticate('google', {
        scope: [
            'email',
            'profile',
            'https://www.googleapis.com/auth/gmail.modify'
         ],
        accessType: 'offline',
        prompt: 'consent'
    }
))

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/google/failure' }),
    async (req, res) => {
        try {
            // Get the user from the database
            const user = await User.findOne({ googleID: req.user.email });

            if (user) {
                // Check if the forceConsent flag was set in the cookie
                if (req.cookies.forceConsent === 'true') {
                    // Set googleConsent to true
                    user.googleConsent = true;
                    user.updatedAt = new Date();
                    await user.save();

                    // Clear the forceConsent cookie
                    res.clearCookie('forceConsent');
                }
            }

            // Redirect the user to the return URL or a default page
            const returnTo = req.cookies.returnTo || '/protected'; // Use the stored URL or a default URL
            res.clearCookie('returnTo'); // Clear the returnTo cookie
            res.redirect(returnTo); // Redirect to the stored URL
        } catch (error) {
            console.error('Error in Google callback:', error);
            return res.status(500).send('Internal Server Error');
        }
    }
);

router.get('/google/failure', (req, res) => {
    res.send('Failed to authenticate..')
})

// Exports
module.exports = router