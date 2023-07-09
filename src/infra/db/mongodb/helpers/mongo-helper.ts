/* eslint-disable @typescript-eslint/no-extraneous-class */
import * as mongoose from 'mongoose'

export class MongoHelper {
  static client = null as typeof mongoose
  static async connect (uri: string): Promise<void> {
    MongoHelper.client = await mongoose.connect(uri)
  }

  static isConnected (): boolean {
    if (MongoHelper.client.connection.readyState === 1) {
      return true
    } else {
      return false
    }
  }

  static async disconnect (): Promise<void> {
    await MongoHelper.client.disconnect()
  }

  static async getModel (name: string, schema: mongoose.Schema): Promise<mongoose.Model<any>> {
    if (!MongoHelper.isConnected()) {
      await MongoHelper.connect(process.env.MONGO_URL)
    }
    return MongoHelper.client.connection.model(name, schema)
  }

  static map<Model = any> (collection: any): Model {
    if (collection.length) {
      return collection.map((document: Model) => MongoHelper.map(document))
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _id, __v, ...collectionWithoutId } = collection
    return Object.assign({}, collectionWithoutId, { id: String(_id) })
  }
}
