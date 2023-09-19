import { connectToDatabase } from "../../utils/mongodb";
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  const { userId, ...settings } = req.body

  if (!userId) {
    return res.status(400).json({ success: false, message: 'User not logged in.' })
  }

  const { db } = await connectToDatabase()

  try {
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { settings: settings } }
    )

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating settings.' })
    console.error('Error updating settings:', err)
  }
  

  
}