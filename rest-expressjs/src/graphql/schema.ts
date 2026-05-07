import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type Message {
    text: String!
    altText: String!
  }

  type Memo {
    _id: ID!
    title: String!
    content: String!
    createdAt: String!
    updatedAt: String!
  }

  input MemoInput {
    title: String!
    content: String!
  }

  type Mutation {
    addMemo(input: MemoInput!): Memo
    deleteMemo(id: String!): Memo
  }

  type Query {
    getHelloWorld: Message
    getMemos: [Memo!]!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`);
