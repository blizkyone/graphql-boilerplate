import { GraphQLServer, PubSub } from 'graphql-yoga'
// import Subscription from './resolvers/Subscriptions.js'
import db from './db.js'
import Query from './resolvers/Query.js'
import Mutation from './resolvers/Mutation.js'
import User from './resolvers/User.js'

const pubsub = new PubSub()
const server = new GraphQLServer({
   typeDefs: './src/schema.graphql',
   resolvers: {
      Query,
      Mutation,
      User,
   },
   context: (req) => ({
      db,
      pubsub,
      req,
   }),
})
server.start(() => console.log('The server is live'))
