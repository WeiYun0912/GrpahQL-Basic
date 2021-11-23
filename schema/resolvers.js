const resolvers = {
  Query: {
    books: (parent, args, context) => {
      return context.Books;
    },
  },
};

module.exports = resolvers;
