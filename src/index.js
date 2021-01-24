import { GraphQLServer, PubSub } from 'graphql-yoga'
import path from 'path'
import fs from 'fs'
import os from 'os'
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

let options = {
   port: 4000,
   endpoint: '/graphql',
}

if (server.express.get('env') === 'development') {
   const sslKeyPath = path.join(
      os.homedir(),
      'Desktop/Desarrollo/ssl/localhost.key'
   )
   const sslCertPath = path.join(
      os.homedir(),
      'Desktop/Desarrollo/ssl/localhost.cert'
   )

   const https = {
      key: fs.readFileSync(sslKeyPath),
      cert: fs.readFileSync(sslCertPath),
   }

   options = {
      ...options,
      port: 4001,
      https,
   }
}

server.start(options, ({ port }) =>
   console.log(`The server is live in port ${port}`)
)
