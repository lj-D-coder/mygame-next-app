import mongoose from 'mongoose';

const connection = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }

  const uri = process.env.MONGODB_URI;

  if (!global._mongooseConnection) {
    const connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    global._mongooseConnection = connection;
  }

  return global._mongooseConnection;
};

export default connection;
