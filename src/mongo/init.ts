import { MongoClient } from "mongodb";

const { DB_STRING } = process.env;

if (!DB_STRING) {
  throw Error('Could not initialize the database as no database string was provided.');
}

// Create a new MongoClient
const client = new MongoClient(DB_STRING);

export default client;