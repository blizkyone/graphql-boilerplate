const Query = {
   users: async (parent, args, { db }, info) => {
      if (!args.query) {
         return db.Users.find({})
      }
      return db.Users.find({ name: { $regex: `${args.query}` } })
   },
}

export default Query
