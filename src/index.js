
import cors from 'cors';
import jwt from 'jsonwebtoken';

import express from 'express';
import {
    ApolloServer,
    AuthenticationError
} from 'apollo-server-express';
const ConstraintDirective = require('graphql-constraint-directive')

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

const getMe = async req => {
    const token = req.headers['x-token'];

    if (token) {
        try {
            return await jwt.verify(token, process.env.SECRET);
        } catch (e) {
            throw new AuthenticationError(
                'Your session expired. Sign in again.',
            );
        }
    }
};

const app = express();
app.use(cors());


const server = new ApolloServer({
   typeDefs: schema,
   resolvers,
    schemaDirectives: { constraint: ConstraintDirective },
    context: async ({ req }) => {
        const me = await getMe(req);

        return {
            models,
            me,
            secret: process.env.SECRET,
        };
    },
});

server.applyMiddleware({
    app,
    path: '/graphql'
});

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
    if (eraseDatabaseOnSync) {
        createUsersWithMessages();
    }

    app.listen({ port: 8000 }, () => {
        console.log('Apollo Server on http://localhost:8000/graphql');
    });
});

const createUsersWithMessages = async () => {
    await models.User.create(
        {
            username: 'rwieruch',
            email: 'hello@robin.com',
            password: 'rwieruch',
            role: 'ADMIN',
            messages: [
                {
                    text: 'Published the Road to learn React',
                },
            ],
        },
        {
            include: [models.Message],
        },
    );

    await models.User.create(
        {
            username: 'ddavids',
            email: 'hello@david.com',
            password: 'ddavids',
            messages: [
                {
                    text: 'Happy to release ...',
                },
                {
                    text: 'Published a complete ...',
                },
            ],
        },
        {
            include: [models.Message],
        },
    );
};