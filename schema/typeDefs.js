const { gql } = require("apollo-server");

const typeDefs = gql`
  type Book {
    id: ID!
    name: String!
    author: Author!
    publish: String!
  }

  type Author {
    id: ID!
    name: String
  }

  type Query {
    books: [Book!]
    book(id: ID): Book
  }
`;

module.exports = typeDefs;
