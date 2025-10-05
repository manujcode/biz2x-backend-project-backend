require("dotenv").config()
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const server = express();
const cors = require("cors");


const morgan = require("morgan");
const {createWriteStream} = require("fs");
const { join } = require("path");

const logFile = join(__dirname, "blogchefNew.log"); 
  // create the log file in the current project directory

server.use(cors({ exposedHeaders: ["X-Total-Count"] }));
// const createProduct= require('./models/Product.js')
const productRouter = require("./routes/Products.js");
const categoryRouter = require("./routes/Category.js");
const brandsRouter = require("./routes/Brand.js");
const userRouter = require("./routes/User.js");
const authRouter = require("./routes/Auth.js");
const cartRouter = require("./routes/Cart.js");
const orderRouter = require("./routes/Order.js");
const { User } = require("./model/User.js");
   
const crypto = require("crypto");
const JwtStrategy = require("passport-jwt").Strategy;
const { isAuth, sanitizeUser, cookieExtractor } = require("./service/comman.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { Order } = require("./model/Orders.js");
const path = require("path");

// const token = jwt.sign({ foo: "bar" }, SECRET_KEY);
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.SECRET_KEY;
 
           
const stripe = require("stripe")(process.env.STRIPE_SECRETE);


// server.post("/create-payment-intent", async (req, res) => {
//   // const {totalAmount} = req.body
//   // Create a PaymentIntent with the order amount and currency
//   const paymentIntent = await stripe.paymentIntents.create({

//     amount: 112,
//     currency: "inr",
//     description: 'Software development services',
    
//     automatic_payment_methods: {
//       enabled: true, 
//     },
//   });
 

//   res.send({
//     clientSecret: paymentIntent.client_secret,
//   });
// });



// server.use(express.static( path.resolve(__dirname,"build")))

server.use(morgan(":method - :url - :date - :response-time ms"));  // morgan template
server.use(
  morgan(":method -:url - :date - :response-time ms", {
    stream: createWriteStream(logFile, { flags: "a" }),
  })
);
server.use(cookieParser())
morgan(':method :url :status :res[content-length] - :response-time ms')

server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate("session"));

passport.use(
  "local",
  new LocalStrategy({usernameField : 'email'},async function (email, password, done) {
    
    try {
      // const user = new User(req.body);
      const user = await User.findOne({ email: email });
      // console.log(user)
      if (!user) { 
        done(null, false, { message: "Invalid credentials" });
      }
      else
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "Invalid credentials" });
          }
          const token = jwt.sign(sanitizeUser(user), process.env.SECRET_KEY);

          done(null, {...sanitizeUser(user),token});
        }
      );
    } catch (error) {
      done(error);
    }
  })
);
passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findOne({_id:jwt_payload.id });
      if (user) {
        console.log("user",user)
        const token = jwt.sign(sanitizeUser(user), process.env.SECRET_KEY);

        return done(null, sanitizeUser(user),token);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (err) {
      return done(err, false);
    }
  })
);
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    console.log(user, "serializeUser");
    return cb(null, { id: user.id, role: user.role });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    console.log(user, "de--serializeUser");
    return cb(null, user);
  });
}); 

server.use("/webhook",express.raw({type:"*/*"}))
server.use(express.json());

 server.post("/create-payment-intent", async (req, res) => {
  try {
    const { totalAmount,customerAddress ,orderId} = req.body;
    // Create a PaymentIntent with customer name, address, amount, and currency
    const paymentIntent = await stripe.paymentIntents.create({
      description: 'Software development services',
  shipping: {
    name: customerAddress.name,
    address: {
      line1: customerAddress.street,
      postal_code: customerAddress.pinCode,
      city: customerAddress.city,
      state: customerAddress.state,
      country: 'US',
    },
    
  },
  amount: totalAmount*100,
  currency: 'inr',
  metadata: {
    orderId,
  },
  payment_method_types: ['card'],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) { 
    console.error("Error creating payment intent:", error);
    res.status(500).send({ error: "An error occurred while creating payment intent." });
  }
});
//webhook              "whsec_6cadf1fa8f0400fcd3891864afab6220a8b22d1ebd687acb43151dd0083e7ceb"
const endpointSecret = "process.env.ENDPOINT_SECRETE";



server.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;
 
    try {
     
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;

        const order = await Order.findById(
          paymentIntentSucceeded.metadata.orderId
        );
        order.paymentStatus = 'received';
        await order.save();
 
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

server.use("/products", isAuth(), productRouter.router);
server.use("/categories", isAuth(), categoryRouter.router);
server.use("/brands", isAuth(), brandsRouter.router);
server.use("/users", isAuth(), userRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), orderRouter.router);
main().catch((error) => console.log(error));

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

// server.use('/products',productRouter.router)

// server.post('/product',createProduct)

server.listen(process.env.PORT, () => {
  console.log("server started");
});
