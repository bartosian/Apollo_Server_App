import 'dotenv/config';
import cors from 'cors';

import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const app = express();
app.use(cors());

let users = {
    1: {
        id: '1',
        username: 'Robin Wieruch',
    },
    2: {
        id: '2',
        username: 'Dave Davids',
    },
};

const schema = gql`
    type Query {
        me: User
        user(id: ID!): User
        users: [User!]
        messages: [Message!]!
        message(id: ID!): Message!
    }
    
    type User {
        id: ID!
        username: String!
    }
    
    type Message {
        id: ID!
        text: String!
    }
`;
const resolvers = {
    Query: {
        me: (parent, args, { me }) => {
            return me;
        },
        user: (root, {id}) => {
            return users[id]
        },
        users: () => {
            return Object.values(users);
        }
    },
    User: {
        username: (root) => {
            return root.username;
        }
    }
};

const server = new ApolloServer({
   typeDefs: schema,
   resolvers,
   context: {
       me: users[1]
   }
});

server.applyMiddleware({
    app,
    path: '/graphql'
});

app.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
});