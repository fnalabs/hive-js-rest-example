// imports
import CONSTANTS from '../../constants'

import { parse, Actor, Schema } from 'hive-io'

import PostSchema from '../../schemas/json/Post.json'

/*
 * class PutPostActor
 */
class PutPostActor extends Actor {
  constructor (postSchema, repository) {
    super(parse`/post/${'postId'}`, postSchema, repository)
  }

  async perform (model, data) {
    // validate
    await super.perform(model, data)

    // prepare upload params
    const conditions = { _id: data.meta.urlParams.postId }
    const update = { $set: { text: data.payload.text, edited: true } }

    // upload to mongo
    model =
      await this.repository.findOneAndUpdate(conditions, update, CONSTANTS.UPDATE_OPTIONS).exec()

    return { model }
  }
}

/*
 * Proxy<PutPostActor> for async initialization of the Schema w/ refs
 */
export default new Proxy(PutPostActor, {
  construct: async function (PutPostActor, argsList) {
    const repository = argsList[0]
    const postSchema = await new Schema(PostSchema)
    return new PutPostActor(postSchema, repository)
  }
})
