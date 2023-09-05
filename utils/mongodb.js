import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI)

export async function connectToDatabase() {
  try {
    await client.connect()
    console.log('Connected to MongoDB.')

    const admin = client.db('admin').admin()
    const result = await admin.ping()
    if (result.ok) {
      console.log('Ping successful, database is up!')
    } else {
      console.log('Ping failed.')
    }

    const db = client.db('kelvinDB')
    return { db, client }
  } catch (error) {
    console.error('failed to connect to mongodb.', error)
  }
}