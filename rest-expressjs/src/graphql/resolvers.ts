import { Memo } from "../db/mongoose.controller.js";
import validator from "validator";
import type { AuthRequest } from "../utils/types.js";

export const resolvers = {
  getHelloWorld: () => {
    return {
      text: "Hello, world!",
      altText: "Hello from GraphQL!",
    };
  },
  getMemos: async (_: any, req: AuthRequest) => {
    if (!req.userId) {
      throw new Error(
        (req.errorMessage || "Unauthorized") + ": " + (req.errorStatus || 403)
      );
    }
    return await Memo.find();
  },
  addMemo: async (
    { input }: { input: InstanceType<typeof Memo> },
    req: AuthRequest
  ) => {
    if (!req.userId) {
      throw new Error(
        (req.errorMessage || "Unauthorized") + ": " + (req.errorStatus || 403)
      );
    }
    // "Validation" :D
    const errors = [];

    if (!validator.isLength(input.title, { min: 5 })) {
      errors.push("Title must be at least 5 characters long");
    }

    if (validator.equals(input.title, "error")) {
      errors.push("Title cannot be the word 'error'");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    const newMemo = new Memo(input);
    return await newMemo.save();
  },
  deleteMemo: async ({ id }: { id: string }, req: AuthRequest) => {
    if (!req.userId) {
      throw new Error(
        (req.errorMessage || "Unauthorized") + ": " + (req.errorStatus || 403)
      );
    }
    const deletedMemo = await Memo.findByIdAndDelete(id);
    return deletedMemo;
  },
};
