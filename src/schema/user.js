import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  type User {
    id: ID!
    username: String! @constraint(pattern: "^[0-9a-zA-Z]*$", maxLength: 255)
    messages: [Message!]
  }
`;