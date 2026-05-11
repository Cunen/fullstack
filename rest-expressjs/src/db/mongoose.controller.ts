import dotenv from "dotenv";
import process from "process";
import mongoose from "mongoose";

dotenv.config({ path: ".env" });

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const commentSchema = new Schema(
  {
    comment: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    memo: { type: Schema.Types.ObjectId, ref: "memo", required: true },
  },
  {
    timestamps: true,
  }
);

const memoSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "comment" }],
  },
  {
    timestamps: true,
  }
);

const Post = model("post", postSchema);
const User = model("user", userSchema);
const Comment = model("comment", commentSchema);
const Memo = model("memo", memoSchema);

/** MongoDB Connection
 * Database: node-learning
 * Username: MONGO_USERNAME from .env
 * Password: MONGO_PASSWORD from .env
 */
export const MONGODB_CONNECTION_STRING = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ac-aokgvtf-shard-00-00.dqcpedh.mongodb.net:27017,ac-aokgvtf-shard-00-01.dqcpedh.mongodb.net:27017,ac-aokgvtf-shard-00-02.dqcpedh.mongodb.net:27017/?ssl=true&replicaSet=atlas-5if7zx-shard-0&authSource=admin&appName=node-learning`;
// SRV connection string broken in NODE 24+?
// const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@node-learning.dqcpedh.mongodb.net/?appName=node-learning`;

const connectWithMongoose = async () => {
  try {
    return mongoose.connect(MONGODB_CONNECTION_STRING, {
      dbName: "ts-db",
    });
  } catch (error) {
    console.error("Error connecting to MongoDB with Mongoose:", error);
    throw error;
  }
};

export { connectWithMongoose };
export { Post, User, Memo, Comment };
