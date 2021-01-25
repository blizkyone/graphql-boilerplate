import jwt from 'jsonwebtoken'

const auth = (req, requireAuth = true) => {
   const header = req.request.headers.authorization

   if (header) {
      const token = header.replace('Bearer ', '')
      // const token = header.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      return decoded._id
   }

   if (requireAuth) throw new Error('Authentication required')

   return null
}

export default auth

// import passport from 'passport'
// import FacebookStrategy from 'passport-facebook'

// const facebookOptions = {
//    clientID: process.env['FACEBOOK_CLIENT_ID'],
//    clientSecret: process.env['FACEBOOK_CLIENT_SECRET'],
//    callbackURL: '/return',
// }

// const facebookCallback = (accessToken, refreshToken, profile, cb) => {
//    console.log(`Access Token: ${accessToken}`)
//    console.log(`Refresh Token: ${refreshToken}`)
//    return cb(null, profile)
// }

// passport.use(new FacebookStrategy(facebookOptions, facebookCallback))

// export default passport
