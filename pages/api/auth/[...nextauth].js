import NextAuth from 'next-auth'
import { connectToDatabase, registerUser } from '@/utils/mongodb'
import bcrypt from 'bcrypt'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import DiscordProvider from 'next-auth/providers/discord'
import TwitterProvider from 'next-auth/providers/twitter'
import CredentialsProvider from 'next-auth/providers/credentials'
// import EmailProvider from 'next-auth/providers/email'

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET
        }),
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID,
            clientSecret: process.env.TWITTER_CLIENT_SECRET,
            version: '2.0'
        }),
        CredentialsProvider({
            id: 'credentials',
            name: 'credentials',
            credentials: {
                userIdentifier: { label: 'Username or Email', type: 'text', placeholder: 'Melek or melek@example.com' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                const { db } = await connectToDatabase()

                const existingUser = await db.collection('users').findOne({ 
                    $or: [
                        { username: credentials.userIdentifier },
                        { email: credentials.userIdentifier }
                    ]
                })

                console.log('fetched user: ', existingUser)

                if (existingUser) {
                    const isValid = await bcrypt.compare(credentials.password, existingUser.password)

                    console.log('Is password valid: ', isValid)

                    if (isValid) {
                        return { id: existingUser._id, name: existingUser.username, email: existingUser.email }
                    } else {
                        throw new Error('Invalid Password.')
                    }
                } else {
                    throw new Error('User does not exist.')
                }
            }
        })
    ],
    session: {
        jwt: true
    },
    callbacks: {
        async jwt({ token, user }) {
            return user ? { ...token, ...user } : token
        },
        async session({ session, token, user }) {
            session.user = token
            session.user.settings = token.settings
            return session
        }
    }
})