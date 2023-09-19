import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const { userId } = req.query

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' })
  }

  try {
    const { db } = await connectToDatabase()
    
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })

    if (!user || !user.settings) {
      return res.status(404).json({ message: 'Settings not found.' })
    }

    return res.status(200).json(user.settings)
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message })
  }
}