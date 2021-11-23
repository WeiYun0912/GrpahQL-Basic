const { ApolloServer } = require("apollo-server");
const resolvers = require("./schema/resolvers");
const typeDefs = require("./schema/typeDefs");
const { Books } = require("./tempData");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    Books,
  },
});

server.listen().then(({ url }) => {
  console.log(`Server Url : ${url}`);
});
