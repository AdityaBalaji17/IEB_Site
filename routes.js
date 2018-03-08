
var HomeController = require('./controllers/HomeController');
var AuthController = require('./controllers/AuthController');
var SiteController = require('./controllers/SiteController'); 
var braintree=require("braintree"); 
// Routes
module.exports = function(app){
     
    // Main Routes
     
    app.get('/', HomeController.Index);
    app.get('/other', HomeController.Other);
    app.post('/signup', AuthController.Signup);
    app.post('/login', AuthController.Login); 
    app.get('/logout', AuthController.Logout); 
    app.post('/checkcode', AuthController.Checkcode);
    app.post('/buy',SiteController.Buy);
    app.get("/remove/:id",SiteController.RemoveFromCart);
    app.get('/mycart',SiteController.ViewCart);
    app.get('/cart/:id',SiteController.AddToCart);
    app.get('/success', SiteController.StoreTransaction);
    app.get('/profile',SiteController.ShowProfile);
    app.post('/saveRatings',SiteController.SaveRatings);
// Page will display when you canceled the transaction 
app.get('/cancel', function(req, res) {
  res.send("Payment canceled successfully.");
});

    app.post('/checkout', function(req, res, next) {

  var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    // Use your own credentials from the sandbox Control Panel here
    merchantId: 'zvc3f5nbrhpdsybp',
    publicKey: '6zhjzn675fj57f28',
    privateKey: '2c2fb4482ae0939ce5b81d26e55eee2a'
  });
  
  // Use the payment method nonce here
  var nonceFromTheClient = req.body.paymentMethodNonce;
  // Create a new transaction for $10
  var newTransaction = gateway.transaction.sale({
    amount: req.session.totalAmt,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      submitForSettlement: true
    }
  }, function(error, result) {
      if (result) {

        res.send(result);

      } else {
        res.status(500).send(error);
      }
  });
});

app.get('/:id', SiteController.Finduser);  
};
