const User = require('../models/Users');

// const isAuth = async (req, res, next) => {
//     if (req.user) {
//         next();
//     } else {
//         res.cookie('returnTo', req.originalUrl, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
//         res.redirect('/auth/google');
//     }
// };

// const isAuth = async (req, res, next) => {
//     if (req.user) {
//         try {
//             // Find the user in the database
//             const user = await User.findOne({ googleID: req.user.email });

//             if (user) {
//                 // Check if googleConsent is false
//                 if (user.googleConsent === false) {
//                     // If googleConsent is false, force re-authentication
//                     res.cookie('returnTo', req.originalUrl, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
//                     return res.redirect('/auth/google');
//                 }
//                 // If googleConsent is true, proceed to the next middleware
//                 return next();
//             } else {
//                 // If user is not found in the database, redirect to authentication
//                 res.cookie('returnTo', req.originalUrl, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
//                 return res.redirect('/auth/google');
//             }
//         } catch (error) {
//             console.error('Error fetching user:', error);
//             // Handle errors (e.g., database issues)
//             res.status(500).send('Internal Server Error');
//         }
//     } else {
//         // If user is not authenticated, redirect to Google auth
//         res.cookie('returnTo', req.originalUrl, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
//         res.redirect('/auth/google');
//     }
// };

const isAuth = async (req, res, next) => {
    if (req.user) {
        try {
            // Find the user in the database
            const user = await User.findOne({ googleID: req.user.email });

            if (user) {
                // Check if googleConsent is false
                if (user.googleConsent === false) {
                    // Set the forceConsent flag in a cookie
                    res.cookie('forceConsent', 'true', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

                    // Store the return URL in a cookie
                    res.cookie('returnTo', req.originalUrl, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

                    // Redirect to Google auth
                    return res.redirect('/auth/google');
                }
                // If googleConsent is true, proceed to the next middleware
                return next();
            } else {
                // If user is not found in the database, redirect to authentication
                res.cookie('returnTo', req.originalUrl, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                return res.redirect('/auth/google');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            // Handle errors (e.g., database issues)
            return res.status(500).send('Internal Server Error');
        }
    } else {
        // If user is not authenticated, redirect to Google auth
        res.cookie('returnTo', req.originalUrl, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        return res.redirect('/auth/google');
    }
};

module.exports = isAuth;