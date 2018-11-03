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

let messages = {
    1: {
        id: '1',
        text: 'Hello World',
    },
    2: {
        id: '2',
        text: 'By World',
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
        user: User!
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
        },
        messages: () => {
            return Object.values(messages);
        },
        message(root, {id}) {
            return messages[id];
        }
    },
    User: {
        username: (root) => {
            return root.username;
        }
    },
    Message: {
        user: (root, args, {me}) => {
           return me;
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