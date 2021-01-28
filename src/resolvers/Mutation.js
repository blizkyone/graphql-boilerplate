import asyncForEach from '../utils/asyncForEach.js'
import auth from '../utils/auth.js'
import jwt from 'jsonwebtoken'
// import bcrypt from 'bcryptjs'

const Mutation = {
   authenticateUser: async (parent, args, { db }, info) => {
      const user = await db.Users.findOne({ uid: args.uid })
      if (!user) return { message: 'Create new user' }

      const token = jwt.sign(
         { _id: user._id.toString() },
         process.env.JWT_SECRET
      )
      user.tokens = user.tokens.concat({ token })
      await user.save()

      return { token, user }
   },
   verifyUsername: async (parent, args, { db }, info) => {
      const usernameExists = await db.Users.exists({ username: args.username })
      return usernameExists
   },
   createUser: async (parent, args, { db }, info) => {
      if (args.data.password.length < 6)
         throw new Error('Password must be at least 6 characters long')
      const emailTaken = await db.Users.findOne({
         email: args.data.email,
      })
      if (emailTaken) throw new Error('Email taken')

      const user = new db.Users({
         ...args.data,
      })

      const token = jwt.sign(
         { _id: user._id.toString() },
         process.env.JWT_SECRET
      )
      user.tokens = user.tokens.concat({ token })

      await user.save()

      return { token, user }
   },
   deleteUser: async (parent, args, { db }, info) => {
      const userToDelete = await db.Users.findById(args.id)
      if (!userToDelete) throw new Error('No user found')

      // const postsToDelete = await db.Posts.find({ author: args.id }).lean()
      // if (postsToDelete) {
      //    await asyncForEach(postsToDelete, async (post) => {
      //       await db.Comments.deleteMany({ post: post._id })
      //    })
      //    await db.Posts.deleteMany({ author: args.id })
      // }

      // const comments = await db.Comments.deleteMany({ author: args.id })
      const user = await db.Users.findOneAndDelete(args.id)

      return user
   },
   updateUser: async (parent, args, { db, req }, info) => {
      const id = auth(req)
      const { data } = args
      const user = await db.Users.findById(id)
      if (!user) throw new Error('User not found')

      if (typeof data.email === 'string') {
         const emailTaken = await db.Users.findOne({ email: data.email })
         if (emailTaken) throw new Error('Email taken')
         user.email = data.email
      }

      if (typeof data.name === 'string') {
         user.name = data.name
      }

      if (typeof data.age !== 'undefined') {
         user.age = data.age
      }

      await user.save()

      return user
   },
}

export default Mutation
