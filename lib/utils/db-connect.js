import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
let connection;

if (!global._mongooseConnection) {
  connection = mongoose.connect(uri);
  global._mongooseConnection = connection;
} else {
  connection = global._mongooseConnection;
}

export default connection;
