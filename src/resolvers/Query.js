import auth from '../utils/auth.js'

const Query = {
   users: async (parent, args, { db }, info) => {
      if (!args.query) {
         return db.Users.find({})
      }
      return db.Users.find({ name: { $regex: `${args.query}` } })
   },
   getMyProfile: async (parent, args, { db, req }, info) => {
      const userId = auth(req, true)
      const user = await db.Users.findById(userId)
      return user
   },
}

export default Query
