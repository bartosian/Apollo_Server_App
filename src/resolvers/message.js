import { ForbiddenError } from 'apollo-server';

export default {
    Query: {
        messages: async (parent, args, { models }) => {
            return await models.Message.findAll();
        },
        message: async (parent, { id }, { models }) => {
            return await models.Message.findById(id);
        },
    },

    Mutation: {
        createMessage: async (parent, { text }, { me, models }) => {
            try {
                if (!me) {
                    throw new ForbiddenError('Not authenticated as user.');
                }

                return await models.Message.cretae({
                    text,
                    userId: me.id
                })
            } catch(err) {
                throw new Error(error);
            }

        },

        deleteMessage: async (parent, { id }, { models }) => {
            return await models.Message.destroy({
                where: {
                    id
                }
            });
        },
    },
    Message: {
        user: async (message, args, { models }) => {
            return await models.User.findById(message.userId);
        },
    },
};