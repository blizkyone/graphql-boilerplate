import { GraphQLServer, PubSub } from 'graphql-yoga'
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import os from 'os'
// import Subscription from './resolvers/Subscriptions.js'
import db from './db/db.js'
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

server.express.use(cors())
server.express.use(express.json())

const customRoutes = express.Router()
customRoutes.get('/api', (req, res) => res.send({ key: 'Hello' }))
server.express.use(customRoutes)

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

await server.start(options, ({ port }) =>
   console.log(`The server is live in port ${port}`)
)
