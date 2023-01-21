import type { Coordinates } from "../types";
import BaseModel from "./BaseModel";

export default class CoordinatesModel extends BaseModel {
  static getCollectionName(): string {
    return "Coordinates";
  }

  static async saveAll(coordinates: Coordinates) {
    console.log(coordinates);
    const collection = await this.init();
    await collection.insertOne(coordinates);
  }
}