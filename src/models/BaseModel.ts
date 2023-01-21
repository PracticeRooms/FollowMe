import MongoClient from "../mongo/init";

const { DB_NAME } = process.env;

export default class BaseModel {
  static async init() {
    // Use connect method to connect to the server
    await MongoClient.connect();
    console.log('Connected successfully to server');

    const db = MongoClient.db(DB_NAME);
    const collection = db.collection(this.getCollectionName());

    return collection;
  }

  static getCollectionName(): string {
    throw new Error("This method has not been implemented");
  }
}