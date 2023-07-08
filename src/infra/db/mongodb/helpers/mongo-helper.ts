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
      MongoHelper.client = null
      return false
    }
  }

  static async disconnect (): Promise<void> {
    await MongoHelper.client.disconnect()
    MongoHelper.client = null
  }

  static async getModel (name: string, schema?: mongoose.Schema): Promise<mongoose.Model<any>> {
    return MongoHelper.client.connection.model(name, schema)
  }

  static map (collection: any): any {
    if (collection.length) {
      return collection.map((c: any) => MongoHelper.map(c))
    }
    const { _id, ...collectionWithoutId } = collection
    return Object.assign({}, collectionWithoutId, { id: _id })
  }
}
