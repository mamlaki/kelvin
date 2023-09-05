import { connectToDatabase } from '@/utils/mongodb'

export default async function handler(req, res) {
  try {
    await connectToDatabase()
    res.status(200).send("DB connection looks good!")
  } catch (err) {
    console.error("DB connection failed: ", err)
    res.status(500).send("DB connection failed")
  }
}