const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const stripe = require('stripe')('sk_test_51RAF0eRonbo1nkc2n4Huib5tfOk0HEgqLv9Pm3WNtRkLiKUw4kQGhWCr3yMGfUpn4WLDZ69q9vyMYihokB442Ug400aScOey9N'); // <-- your secret key here

const PORT =  8080;
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/payment-sheet', async (req, res) => {
    // Use an existing Customer ID if this is a returning customer.

    const amount = req.body.amount;
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2025-03-31.basil'}
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'cad',
      customer: customer.id,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: 'pk_test_51RAF0eRonbo1nkc2FTaTAT4olK4DSvhbGw32rNwhCNPAhGn99cADjJ8AJbcZBJzzTJ949HSoWXBTxFgupz7LuDUR00ql1dUDSM'
    });
  });


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);