const typeDefs =`


  type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

type User {
  id: ID!
  username: String!
  email: String!
  savedBooks: [Book]
  bookCount: Int
}

type Auth {
  token: ID!
  user: User
}

type Query {
  me: User
}

input BookInput {
  bookId: ID!
  authors: [String]
  description: String
  title: String
  image: String
  link: String
}

input UserInput {
  username: String!
  email: String!
  password: String!
}

type Mutation {
  addUser(input: UserInput!): Auth
  login(email: String!, password: String!): Auth
  saveBook(input: BookInput!): User
  removeBook(bookId: ID!): User
}

  `;

export default typeDefs;