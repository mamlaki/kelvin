import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI)
let connected = false

export async function connectToDatabase() {
  try {
    if (!connected) {
      await client.connect()
      connected = true
    }
    
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

export async function registerUser(db, username, hashedPassword, email) {
  console.log('REACHED REGISTER USE FUNC')
  try {
    const collection = db.collection('users')
    const result = await collection.insertOne({ username, password: hashedPassword, email })
    console.log('InsertOne Result: ', result)
    console.log('Result.ops: ', result.ops)
    if (result.acknowledged) {
      return { _id: result.insertedId }
    } else {
      console.error('Error inserting user: Insert operation not acknowledged.')
      return null
    }
  } catch (error) {
    console.error('FULL Error inserting user: ', error)
    return null
  }
}