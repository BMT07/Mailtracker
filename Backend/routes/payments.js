const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const bodyParser = require('body-parser');
const User = require('../models/Users');
const isAuth = require('../middlewares/isAuth')
const axios = require('axios');

router.get('/stripe', isAuth, async (req, res) => {
  
  let user = await User.findOne({ googleID: req.user.email });

  console.log(user)
  
  if (!user || !user.stripeId) {
    return res.status(400).json({ error: 'No stipe subscription found' });
  }

  let invoiceList

  try {
    // Retrieve all invoices for the given customer
    const invoices = await stripe.invoices.list({
      customer: user.stripeId,
      limit: 100, // Optionally set a limit on the number of invoices returned
    });

    if (invoices.data.length === 0) {
      invoiceList = []
    } else {
      // Map the invoice data to extract relevant information
      invoiceList = invoices.data.map(invoice => ({
        id: invoice.id,
        date: new Date(invoice.created * 1000).toLocaleDateString(),
        total: invoice.total / 100, // Convert from cents to dollars/euros
        status: invoice.status,
        invoiceUrl: invoice.hosted_invoice_url, // URL to view the invoice
      }));
    }

  } catch (error) {
    console.error('Error retrieving invoices:', error);
    res.status(500).json({ error: 'Failed to retrieve invoices' });
  }
  
  res.render('payment', {
        email: req.user.email,
        stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
        subscriptionType: user.subscriptionType,
        subscriptionEndDate: user.subscriptionEndDate,
        subscriptionId: user.subscriptionId,
        scheduledSubscriptionType: user.scheduledSubscriptionType,
        scheduledSubscriptionId: user.scheduledSubscriptionId,
        scheduledSubscriptionStartDate: user.scheduledSubscriptionStartDate,
        isSuspended: user.isSuspended,
        suspensionDate: user.suspensionDate,
        paymentUrl: user.paymentUrl,
        invoiceList: invoiceList
  })
});

router.get('/portal', async (req, res) => {
  const email = req.query.email;
  let user = await User.findOne({ googleID: email });
  const customer = await stripe.customers.retrieve(user.stripeId);
  const session = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: `http://${req.get('host')}/payments/stripe`, 
  });
  res.redirect(session.url)
});

router.get('/success', (req, res) => {
  res.render('success', {
    email: req.user.email
  })
});

router.get('/cancel', (req, res) => {
  res.render('cancel')
});

router.post('/cancel-active-subscription', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ googleID: email });

    if (!user || !user.subscriptionId) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    if (user && user.subscriptionEndDate && !user.scheduledSubscriptionStartDate) {
      return res.json({ message: 'Subscription already canceled' });
    }

    // If user has a scheduled subscription, call the other endpoint to cancel it
    if (user.scheduledSubscriptionId) {
      const cancelScheduledResponse = await axios.post(`http://${req.get('host')}/payments/cancel-scheduled-subscription`, { 
        email: email,
      });

      if (cancelScheduledResponse.status !== 200) {
        throw new Error('Failed to cancel scheduled subscription');
      }

      console.log('Scheduled subscription canceled');
    }

    // Proceed to cancel the active subscription
    let canceledSubscription = await stripe.subscriptions.update(user.subscriptionId, {
      cancel_at_period_end: true,
    });

    user.subscriptionEndDate = new Date(canceledSubscription.current_period_end * 1000);

    user.updatedAt = new Date();
    await user.save();

    res.json({ message: 'Subscription canceled successfully' });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/cancel-scheduled-subscription', async (req, res) => {

  const { email } = req.body;

  try {
    const user = await User.findOne({ googleID: email });

    if (!user || !user.scheduledSubscriptionId) {
      return res.status(400).json({ error: 'No scheduled subscription found' });
    }

    await stripe.subscriptionSchedules.cancel(user.scheduledSubscriptionId);
    user.scheduledSubscriptionId = null;
    user.scheduledSubscriptionStartDate = null;
    user.scheduledSubscriptionType = 'none';

    await stripe.subscriptions.update(user.subscriptionId, {
      cancel_at_period_end: false
    });

    user.subscriptionEndDate = null;

    user.updatedAt = new Date();
    await user.save();

  } catch (error) {
    console.error('Error canceling scheduled subscription:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  res.json( { message: 'Cancel Scheduled subscription'} )
})

router.post('/reactivate-subscription', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ googleID: email });

    if (!user || !user.subscriptionId) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    if (user && !user.subscriptionEndDate) {
      return res.json({ message: 'Subscription already active' });
    }

    await stripe.subscriptions.update(user.subscriptionId, {
      cancel_at_period_end: false
    });

    user.subscriptionEndDate = null;

    user.updatedAt = new Date();
    await user.save();

    res.json({ message: 'Reactivated subscription successfully' });
  } catch (error) {
    console.error('Error removing subscription cancellation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/update-subscription', async (req, res) => {
  const { email, subscriptionType } = req.body;

  const newPriceId = getPriceId(subscriptionType);

  try {
    const user = await User.findOne({ googleID: email });

    if (!user || !user.subscriptionId) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    if (user && subscriptionType == user.subscriptionType) {
      return res.status(200).json({ message: 'Subscription already active' });
    }

    if (user && subscriptionType == user.scheduledSubscriptionType) {
      return res.status(200).json({ message: 'Subscription already planned' });
    }

    // Retrieve the existing subscription
    const currentSubscription = await stripe.subscriptions.retrieve(user.subscriptionId);
    const currentPeriodEnd = currentSubscription.current_period_end;

    // Cancel the current subscription at the end of the billing period
    await stripe.subscriptions.update(user.subscriptionId, {
      cancel_at_period_end: true,
    });

    // Create a new subscription schedule
    const subscriptionSchedule = await stripe.subscriptionSchedules.create({
      customer: user.stripeId,
      start_date: currentPeriodEnd,
      end_behavior: 'release',
      phases: [{
        items: [{
          price: newPriceId,
        }],
      }],
    });

    // Determine the new subscription type based on the new price ID
    const newSubscriptionType = getSubscriptionType(newPriceId);

    // Update the user's subscription details in the database
    user.scheduledSubscriptionId = subscriptionSchedule.id;
    user.scheduledSubscriptionType = newSubscriptionType;
    user.subscriptionEndDate = new Date(currentPeriodEnd * 1000)
    user.scheduledSubscriptionStartDate = new Date(currentPeriodEnd * 1000)
    user.updatedAt = new Date();
    await user.save();

    res.json({ message: 'Subscription scheduled successfully', subscriptionSchedule });
  } catch (error) {
    console.error('Error scheduling subscription:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/get-subscription-status', async (req, res) => {
  const { email } = req.query;
  console.log(`Received request to get subscription status for email: ${email}`);

  try {
    const user = await User.findOne({ googleID: email });
    console.log(`User found: ${JSON.stringify(user)}`);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let subscriptionType = 'none';
    let subscriptionEndDate = user.subscriptionEndDate;
    if (user.subscriptionId) {
      subscriptionType = user.subscriptionType;
    }

    res.status(200).json({ subscriptionType, subscriptionEndDate });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({ error: 'Error getting subscription status' });
  }
});

router.post('/create-checkout-session', async (req, res) => {
  const { email, subscriptionType } = req.body;

  console.log(`Received request to create checkout session for email: ${email} and subscription type: ${subscriptionType}`);

  try {
    // Rechercher l'utilisateur dans la base de données locale
    let user = await User.findOne({ googleID: email });

    let customerId;

    // Vérifier si l'utilisateur existe et a un ID client Stripe
    if (user && user.stripeId) {
      console.log(`User found in database with Stripe customer ID: ${user.stripeId}`);

      // Vérifier si l'ID client Stripe est valide
      try {
        const customer = await stripe.customers.retrieve(user.stripeId);
        if (customer && !customer.deleted) {
          customerId = user.stripeId;
          console.log(`Valid Stripe customer ID: ${customerId}`);
        } else {
          console.log('Invalid or deleted Stripe customer ID');
          throw new Error('Invalid customer ID');
        }
      } catch (err) {
        console.error('Invalid Stripe customer ID:', err.message);
      }
    }

    // Si l'ID client n'est pas valide ou n'existe pas, créer un nouveau client Stripe
    if (!customerId) {
      console.log('Creating new Stripe customer');
      const customer = await stripe.customers.create({
        email: email,
      });
      customerId = customer.id;
      console.log(`New Stripe customer created with ID: ${customerId}`);

      // Mettre à jour l'utilisateur avec le nouvel ID client Stripe
      if (user) {
        user.stripeId = customerId;
        user.updatedAt = new Date();
        await user.save();
        console.log('User updated with new Stripe customer ID');
      }
    }

    const priceId = getPriceId(subscriptionType);
    console.log(`Using price ID: ${priceId} for subscription type: ${subscriptionType}`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      metadata: { subscriptionType },
      success_url: `http://${req.get('host')}/payments/success?session_id={CHECKOUT_SESSION_ID}&subscriptionType=${subscriptionType}`,
      cancel_url: `http://${req.get('host')}/payments/cancel`,
    });

    console.log('Checkout session created successfully:', session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/next-invoice-details', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ googleID: email });

    if (!user || !user.subscriptionId) {
      return res.status(200).json({ nextInvoiceDate: null, nextInvoiceAmount: null });
    }

    let nextInvoiceDate = null;
    let nextInvoiceAmount = null;

    try {
      // Try retrieving the upcoming invoice as a regular subscription
      const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
        customer: user.stripeId,
        subscription: user.subscriptionId,
      });

      if (upcomingInvoice) {
        nextInvoiceDate = new Date(upcomingInvoice.next_payment_attempt * 1000).toLocaleDateString();
        nextInvoiceAmount = upcomingInvoice.total / 100; // Stripe amounts are in cents
      }
    } catch (error) {
      // If the error is due to no upcoming invoice, check for schedule
      if (error.code === 'invoice_upcoming_none' || error.code === 'resource_missing') {
        try {
          const schedules = await stripe.subscriptionSchedules.list({
            customer: user.stripeId,
          });

          // Find a schedule that is not started
          const notStartedSchedule = schedules.data.find(schedule => schedule.status === 'not_started');

          if (notStartedSchedule) {
            const nextPhase = notStartedSchedule.phases.find(phase => phase.start_date > Math.floor(Date.now() / 1000));
            if (nextPhase) {
              nextInvoiceDate = new Date(nextPhase.start_date * 1000).toLocaleDateString();

              // Retrieve prices for each item in the next phase
              const pricePromises = nextPhase.items.map(async item => {
                const price = await stripe.prices.retrieve(item.price);
                return (price.unit_amount * item.quantity);
              });

              const priceAmounts = await Promise.all(pricePromises);
              nextInvoiceAmount = priceAmounts.reduce((total, amount) => total + amount, 0) / 100; // Convert from cents to dollars/euros
            }
          }
        } catch (scheduleError) {
          console.error('Error retrieving subscription schedule:', scheduleError);
        }
      } else {
        console.error('Error retrieving upcoming invoice:', error);
      }
    }

    //console.log("nextInvoiceDate :"+nextInvoiceDate);
    //console.log("nextInvoiceAmount : "+nextInvoiceAmount);

    res.status(200).json({
      nextInvoiceDate,
      nextInvoiceAmount,
    });
  } catch (error) {
    console.error('Error retrieving next invoice details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/pay-invoice', async (req, res) => {

  const { email } = req.body;
  
  try {

    const user = await User.findOne({ googleID: email });

    if (user.suspensionDate) {

      const invoices = await stripe.invoices.list({
        subscription: user.subscriptionId,
        limit: 1, // Get the most recent invoice
      });
  
      if (invoices.data.length === 0) {
        return res.status(404).json({ error: 'No invoices found for this subscription.' });
      }
  
      const latestInvoice = invoices.data[0]; // Retrieve the first (and latest) invoice
      console.log("Invoice: ", latestInvoice)

      const retryInvoice = await stripe.invoices.pay(latestInvoice.id);
      return res.json({ message: 'Invoice paid' });
    } else {
      return res.json({ message: 'No invoice to pay' });
    }

  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

router.post('/mock-failed-payment', async (req, res) => {

  const { email } = req.body;
  
  try {

    const user = await User.findOne({ googleID: email });

    if (user.subscriptionId) {
      const invoices = await stripe.invoices.list({
        subscription: user.subscriptionId,
        limit: 1, // Get the most recent invoice
      });
  
      if (invoices.data.length === 0) {
        return res.status(404).json({ error: 'No invoices found for this subscription.' });
      }
  
      const latestInvoice = invoices.data[0]; // Retrieve the first (and latest) invoice
  
      // Call the function that handles failed payments, passing the latest invoice
      await handleInvoicePaymentFailed(latestInvoice);

      res.json({ message: 'Mock failed payment handled successfully.' });
    } else {
      return res.json({ message: 'User not found' });
    }

  } catch (error) {
    console.error('Error retrieving invoice or handling failed payment:', error);
    res.status(500).json({ error: 'Failed to retrieve invoice or process payment failure.' });
  }
})

router.post('/mock-success-payment', async (req, res) => {

  const { email } = req.body;
  
  try {

    const user = await User.findOne({ googleID: email });

    if (user.subscriptionId) {
      const invoices = await stripe.invoices.list({
        subscription: user.subscriptionId,
        limit: 1, // Get the most recent invoice
      });
  
      if (invoices.data.length === 0) {
        return res.status(404).json({ error: 'No invoices found for this subscription.' });
      }
  
      const latestInvoice = invoices.data[0]; // Retrieve the first (and latest) invoice
  
      // Call the function that handles failed payments, passing the latest invoice
      await handleInvoicePaymentSucceeded(latestInvoice);

      res.json({ message: 'Mock success payment handled successfully.' });
    } else {
      return res.json({ message: 'User not found' });
    }

  } catch (error) {
    console.error('Error retrieving invoice or handling failed payment:', error);
    res.status(500).json({ error: 'Failed to retrieve invoice or process payment failure.' });
  }
})

router.post('/event_payment', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const event = req.body;
  console.log(`Received event type: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'subscription_schedule.updated':
        await handleSubscriptionScheduleUpdated(event.data.object);
        break;
      case 'invoice.payment_failed' :
        await handleInvoicePaymentFailed(event.data.object);
        break;
  
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

async function handleCheckoutSessionCompleted(session) {
  console.log('Handling checkout.session.completed event');
  const subscriptionType = session.metadata.subscriptionType;

  try {
    const user = await User.findOne({ googleID: session.customer_email });
    if (user) {
      user.stripeId = session.customer;
      user.subscriptionId = session.subscription;
      user.subscriptionType = subscriptionType;
      user.updatedAt = new Date();
      await user.save();
    }
  } catch (error) {
    console.error('Error in handleCheckoutSessionCompleted:', error);
    throw error;
  }
}

async function handleSubscriptionCreated(subscription) {
  console.log('Handling subscription.created event');
  
  try {
    const user = await User.findOne({ stripeId: subscription.customer });
    if (user) {
      const subscriptionType = getSubscriptionType(subscription.items.data[0].price.id);
      
      // Update subscription details
      user.subscriptionId = subscription.id;
      user.subscriptionType = subscriptionType;
      user.plan = subscriptionType; // Keep plan in sync with subscription type
      
      // Clear scheduled subscription data since it's now active
      user.scheduledSubscriptionId = null;
      user.scheduledSubscriptionType = 'none';
      user.scheduledSubscriptionStartDate = null;
      
      // Handle subscription end date
      if (subscription.cancel_at_period_end) {
        user.subscriptionEndDate = new Date(subscription.current_period_end * 1000).toISOString();
      } else {
        user.subscriptionEndDate = null;
      }

      user.updatedAt = new Date();
      await user.save();
    }
  } catch (error) {
    console.error('Error in handleSubscriptionCreated:', error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription) {
  console.log('Handling subscription.updated event');
  
  try {
    const user = await User.findOne({ stripeId: subscription.customer });
    if (user) {
      const subscriptionType = getSubscriptionType(subscription.items.data[0].price.id);
      
      // Update basic subscription details
      user.subscriptionId = subscription.id;
      user.subscriptionType = subscriptionType;
      user.plan = subscriptionType;

      // Check for scheduled subscriptions
      const schedules = await stripe.subscriptionSchedules.list({
        customer: subscription.customer,
        scheduled: true,
      });

      if (subscription.cancel_at_period_end && schedules.data.length === 0) {
        user.subscriptionEndDate = new Date(subscription.current_period_end * 1000).toISOString();
      } else if (subscription.status === 'active') {
        user.subscriptionEndDate = null;
      }

      user.updatedAt = new Date();
      await user.save();
    }
  } catch (error) {
    console.error('Error in handleSubscriptionUpdated:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription) {
  console.log('Handling subscription.deleted event');
  
  try {
    const user = await User.findOne({ stripeId: subscription.customer });
    if (user) {
      // Check for both scheduled and active subscriptions
      const [schedules, activeSubscriptions] = await Promise.all([
        stripe.subscriptionSchedules.list({
          customer: subscription.customer,
          scheduled: true,
        }),
        stripe.subscriptions.list({
          customer: subscription.customer,
          status: 'active',
          limit: 1
        })
      ]);

      // Only reset to free if there are no scheduled OR active subscriptions
      if (schedules.data.length === 0 && activeSubscriptions.data.length === 0) {
        console.log('No active or scheduled subscriptions found, resetting to free');
        user.subscriptionId = null;
        user.subscriptionType = 'free';
        user.plan = 'free';
        user.subscriptionEndDate = null;
        user.scheduledSubscriptionId = null;
        user.scheduledSubscriptionType = 'none';
        user.scheduledSubscriptionStartDate = null;
      } else {
        console.log(
          `Subscription ${subscription.id} deleted, but user still has ` +
          `${activeSubscriptions.data.length} active and ${schedules.data.length} scheduled subscriptions`
        );
        
        // If there's an active subscription, make sure the user data reflects it
        if (activeSubscriptions.data.length > 0) {
          const activeSubscription = activeSubscriptions.data[0];
          user.subscriptionId = activeSubscription.id;
          user.subscriptionType = getSubscriptionType(activeSubscription.items.data[0].price.id);
          user.plan = user.subscriptionType;
          
          if (activeSubscription.cancel_at_period_end) {
            user.subscriptionEndDate = new Date(activeSubscription.current_period_end * 1000).toISOString();
          } else {
            user.subscriptionEndDate = null;
          }
        }
      }

      user.updatedAt = new Date();
      await user.save();
    }
  } catch (error) {
    console.error('Error in handleSubscriptionDeleted:', error);
    throw error;
  }
}

async function handleSubscriptionScheduleUpdated(schedule) {
  console.log('Handling subscription_schedule.updated event');
  
  try {
    const user = await User.findOne({ stripeId: schedule.customer });
    if (user) {
      if (schedule.status === 'active') {
        // Schedule is now active, clear scheduled subscription data
        user.scheduledSubscriptionId = null;
        user.scheduledSubscriptionType = 'none';
        user.scheduledSubscriptionStartDate = null;
      } else if (schedule.status === 'scheduled') {
        // Update scheduled subscription information
        user.scheduledSubscriptionId = schedule.id;
        user.scheduledSubscriptionType = getSubscriptionType(schedule.phases[0].items[0].price.id);
        user.scheduledSubscriptionStartDate = new Date(schedule.phases[0].start_date * 1000).toISOString();
      }

      user.updatedAt = new Date();
      await user.save();
    }
  } catch (error) {
    console.error('Error in handleSubscriptionScheduleUpdated:', error);
    throw error;
  }
}

// Fonction pour gérer l'échec de paiement de la facture
async function handleInvoicePaymentFailed(invoice) {
  
  const user = await User.findOne({ stripeId: invoice.customer });
  
  if (user) {

    console.log(`User ${user.googleID} has a failed payment.`);
  
    user.retryCount += 1
    
    if (!user.suspensionDate) {
      user.suspensionDate = new Date(Date.now() + process.env.GRACE_PERIOD * 24 * 60 * 60 * 1000)
      user.paymentUrl = invoice.hosted_invoice_url
    }

    if (user.retryCount == 3) {
      user.isSuspended = true;
      console.log(`User ${user.googleID} has been suspended due to failed payment.`);
    }

    user.updatedAt = new Date();
    await user.save();
  }
}

// Fonction pour gérer le succès de paiement de la facture
async function handleInvoicePaymentSucceeded(invoice) {
  
  const user = await User.findOne({ stripeId: invoice.customer });
  
  if (user) {
    user.isSuspended = false;
    user.suspensionDate = null;
    user.retryCount = 0
    user.paymentUrl = null;
    user.updatedAt = new Date();
    await user.save();
    console.log(`User ${user.googleID} has been unsuspended due to successful payment.`);
  }
}

function getPriceId(subscriptionType) {
  switch (subscriptionType) {
    case 'daily':
      return 'price_1QGThoJED4iZ9iLKgCYldw6j';
    case 'monthly':
      return 'price_1PhDErJED4iZ9iLKHl53nni7';
    case 'yearly':
      return 'price_1PhDodJED4iZ9iLKFrYfXbjX';
    default:
      throw new Error('Invalid subscription type');
  }
}

function getSubscriptionType(priceId) {
  switch (priceId) {
    case 'price_1QGThoJED4iZ9iLKgCYldw6j':
      return 'daily';
    case 'price_1PhDErJED4iZ9iLKHl53nni7':
      return 'monthly';
    case 'price_1PhDodJED4iZ9iLKFrYfXbjX':
      return 'yearly';
    default:
      return 'unknown';
  }
}

module.exports = router;
