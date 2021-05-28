const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/PostManage');
require('@tensorflow/tfjs-node');
require("@tensorflow/tfjs");
require("dotenv").config();

// Connecting to Database
const dbUrl = process.env.DB_URL || "";
const dbName = process.env.DB_NAME || "";
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((error) => console.log("MongoDB Error:\n", error));
mongoose.set("useCreateIndex", true);

app.use(morgan('dev')); // Morgan to log requests on server console
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// CORS
app.use(cors()); // Enable All CORS Requests

const server = http.createServer(app);

app.use('/whoami', (req, res) => {
  res.send('Hello there! This is Any-Confess server!');
});

app.use('/post',postRoutes);

// If request is able pass till here, route was not found. => Send 404 error
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Handle all the previous errors (including 404 and others)
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error : {
      message: error.message
    }
  });
})

const port = process.env.PORT || 4848;

server.listen(port, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${port}...`
  );
});