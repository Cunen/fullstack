import { Memo } from "../db/mongoose.controller.js";

export const resolvers = {
  getHelloWorld: () => {
    return {
      text: "Hello, world!",
      altText: "Hello from GraphQL!",
    };
  },
  getMemos: async () => {
    return await Memo.find();
  },
  addMemo: async ({ input }: { input: InstanceType<typeof Memo> }) => {
    // "Validation" :D
    if (input.title === "error") {
      throw new Error("Title cannot be 'error'");
    }

    const newMemo = new Memo(input);
    return await newMemo.save();
  },
  deleteMemo: async ({ id }: { id: string }) => {
    const deletedMemo = await Memo.findByIdAndDelete(id);
    return deletedMemo;
  },
};
