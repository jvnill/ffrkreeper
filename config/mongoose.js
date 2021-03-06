try {
  require('dotenv').config()
} catch(e) {
  // ignore it
}

function setup(mongoose) {
  mongoose.Promise = require('bluebird');

  const gracefulExit = function() {
    mongoose.connection.close(() => {
      console.log(`Mongoose connection ` +
        `has disconnected through app termination`);

      process.exit(0);
    });
  };

  mongoose.connection.on("connected", (ref) => {
    console.log(`Successfully connected to ${process.env.NODE_ENV}` +
      ` database on startup `);
  });

  // If the connection throws an error
  mongoose.connection.on("error", (err) => {
    console.error(`Failed to connect to ${process.env.NODE_ENV} ` +
      ` database on startup `, err);
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', () => {
    console.log(`Mongoose default connection to ${process.env.NODE_ENV}` +
      ` database disconnected`);
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

  // Connect to our MongoDB database using the MongoDB
  // connection URI from our predefined environment variable
  console.log(process.env.MONGO_URI);
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ffrkrepper', (error) => {
    if(error) {
			console.log('Error in mongoose', error)
			throw error;
    }
  });
};

module.exports = {
  setup: setup
};