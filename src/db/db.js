import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

mongoose.connect(process.env.MONGODB_URL, {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true,
   useFindAndModify: false,
})

const userSchema = mongoose.Schema({
   uid: {
      type: String,
      required: true,
   },
   username: {
      type: String,
      required: true,
   },
   name: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
   },
   password: String,
   birthDate: Date,
   gender: String,
   tokens: [
      {
         token: {
            type: String,
            required: true,
         },
      },
   ],
})

userSchema.pre('save', async function (next) {
   let user = this

   if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 10)
   }

   next()
})

const Users = mongoose.model('User', userSchema)

const db = {
   Users,
}

export default db
