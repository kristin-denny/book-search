import { User } from '../models/index.js';
// import Book from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';

interface bookArgs {
    bookId: string;
}

interface LoginArgs {
    email: string;
    password: string;
}

interface AddUserArgs {
    input: {
        username: string;
        email: string;
        password: string;
        savedBooks: [];
    }
}

interface AddBookArgs {
    input: {
        bookId: string;
        title: string;
        authors: string[];
        description: string;
        image: string;
        link: string;
    }
}




const resolvers = {
    Query: {
        me: async (_parent: any, _args: any, context: any) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('Could not authenticate user.');
        },
    },
    Mutation: {
        addUser: async (_parent: any, { input }: AddUserArgs) => {

            try {
                const user = await User.create({ ...input });
                const token = signToken(user.username, user.email, user._id);
                return { token, user };
              } catch (err) {
                console.error(err);
                throw new Error('Failed to create user');
              }
        },
        login: async (_parent: any, { email, password }: LoginArgs) => {

            const user = await User.findOne({ email });


            if (!user) {
                throw new AuthenticationError('Could not authenticate user.');
            }


            const correctPw = await user.isCorrectPassword(password);


            if (!correctPw) {
                throw new AuthenticationError('Could not authenticate user.');
            }


            const token = signToken(user.username, user.email, user._id);



            return { token, user };
        },
        saveBook: async (_parent: any, { input }: AddBookArgs, context: any) => {
            if (context.user) {
                

                const user = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } },
                    { new: true, runValidators: true }
                  );
                  
                  
                return user;
  
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async (_parent: any, { bookId }: bookArgs, context: any) => {
            if (context.user) {
                const user = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );
                



                return user;
            }
            throw AuthenticationError;
        },
    }
};

export default resolvers;