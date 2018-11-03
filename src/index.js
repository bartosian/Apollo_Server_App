import 'dotenv/config';

import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const app = express();

const schema = gql`
    type Query {
        me: User
    }
    
    type User {
        username: String!
    }
`;
const resolvers = '';

const server = new ApolloServer({
   typeDefs: schema,
   resolvers
});

server.applyMiddleware({
    app,
    path: '/graphql'
});