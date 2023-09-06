import { connectToDatabase, registerUser } from "@/utils/mongodb";
import bcrypt from 'bcrypt'

export default async function handler(req, res) {
  console.log('Reached handler function!')
  try {
    if (req.method !== 'POST') {
      return res.status(405).end()
    }

    const { username, password, email } = req.body

    // Connect to database
    const { db } = await connectToDatabase()

    // Check if the username already exists
    const existingUser = await db.collection('users').findOne({ username })

    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Register new user
    const newUser = await registerUser(db, username, hashedPassword, email)
    console.log('New user: ', newUser)
    
    if (newUser !== undefined && newUser._id !== undefined) {
      return res.status(201).json({ message: 'User successfully registered' })
    } else {
      return res.status(500).json({ message: 'Failed to register user' })
    }
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ message: 'Server errror' })
  }
}