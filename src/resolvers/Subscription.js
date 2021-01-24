const Subscription = {
   comment: {
      subscribe: async (parent, args, { pubsub, db }, info) => {
         const { postId } = args
         const post = await db.Posts.findById(postId)
         if (!post) throw new Error('Post not found')

         return pubsub.asyncIterator(`comment ${postId}`)
      },
   },
   post: {
      subscribe(parent, args, { pubsub }, info) {
         return pubsub.asyncIterator('post')
      },
   },
}

export default Subscription

// pubsub.publish(`comment ${comment.post}`, {
//     comment: {
//        mutation: 'UPDATED',
//        data: comment,
//     },
//  })

// enum MutationType {
//     CREATED
//     UPDATED
//     DELETED
//  }

//  type CommentSubscriptionPayload {
//     mutation: MutationType!
//     data: Comment!
//  }
