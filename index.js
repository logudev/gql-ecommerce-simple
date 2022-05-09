import { ApolloServer, gql } from "apollo-server";
import { readFile } from "fs/promises";
import { resolvers } from "./resolvers.js";

const typeDefs = await readFile("./schema.graphql", "utf8");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    sayHello: () => console.log("sayHello"),
  },
});

server
  .listen({ port: 2000 })
  .then(({ url }) => console.log(`Server running at ${url}`))
  .catch((err) => console.error(err));
