import { ObjectId } from "mongodb";

import { mongodb } from "../../utilities/database.js";

const User = class User {
  constructor(name, email, username, password, id) {
    this.name = name;
    this.email = email;
    this.username = username;
    this.password = password; // Will be hashed in save() method
    this.id = id ? new ObjectId(id) : null;
  }

  async save() {
    try {
      const users = mongodb.collection("users");
      const user = await users.insertOne(this);
      this.id = user.insertedId;
      return this;
    } catch (e) {
      console.error("Error creating MongoDB user:", e);
      return null;
    }
  }

  static async findByUsername(username) {
    try {
      const users = mongodb.collection("users");
      const userData = await users.findOne({ username });
      return userData
        ? new User(
            userData.name,
            userData.email,
            userData.username,
            userData.password,
            userData._id
          )
        : null;
    } catch (e) {
      console.error("Error finding MongoDB user by username:", e);
      return null;
    }
  }

  static async findById(id) {
    try {
      const users = mongodb.collection("users");
      const userData = await users.findOne({ _id: new ObjectId(id) });
      return userData
        ? new User(
            userData.name,
            userData.email,
            userData.username,
            userData.password,
            userData._id
          )
        : null;
    } catch (e) {
      console.error("Error finding MongoDB user by id:", e);
      return null;
    }
  }
};

export default User;
