const createToken = async (user) => {

};


export default {
    Query: {
        users: async (parent, args, { models }) => {
            return await models.User.findAll();
        },
        user: async (parent, { id }, { models }) => {
            return await models.User.findById(id);
        },
        me: async (parent, args, { models, me }) => {
            if(!me) return null;
            return await models.User.findById(me.id);
        }
    },
    Mutation: {
        signUp: async (
            parent,
            { username, email, password },
            { models },
        ) => {
            const user = await models.User.create({
                username,
                email,
                password,
            });

            return { token: createToken(user) };
        },
    },

    User: {
        messages: async (user, args, { models }) => {
            return await models.Message.findAll({
                where: {
                    userId: user.id
                }
            })
        },
    }
};