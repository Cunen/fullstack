import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type Message {
    text: String!
    altText: String!
  }

  type User {
    _id: ID!
    email: String!
    username: String!
  }
  
  type Comment {
    _id: ID!
    comment: String!
    user: User!
  }

  type Memo {
    _id: ID!
    title: String!
    content: String!
    createdAt: String!
    updatedAt: String!
    comments: [Comment!]!
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
    getMemo(id: String!): Memo
  }

  schema {
    query: Query
    mutation: Mutation
  }
`);
