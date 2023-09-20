import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { userId } = req.query

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' })
  } 

  try {
    const { db } = await connectToDatabase()
    await db.collection('users').deleteOne({ _id: new ObjectId(userId) })

    return res.status(200).json({ message: 'User account deleted successfully. '})
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message })
  }
}