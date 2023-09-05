import NextAuth from 'next-auth'
import { connectToDatabase } from '@/utils/mongodb'
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
                username: { label: 'Username', type: 'text', placeholder: 'Melek...' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                const { db } = await connectToDatabase()

                const user = await db.collection('users').findOne({ username: credentials.username })

                console.log('fetched user: ', user)

                if (user) {
                    const isValid = await bcrypt.compare(credentials.password, user.password)

                    console.log('Is password valid: ', isValid)

                    if (isValid) {
                        return { id: user._id, name: user.username, email: user.email }
                    } else {
                        return null
                    }
                } else {
                    console.log('error in autehntication')
                    return null
                }
            }
        })
    ],
    session: {
        jwt: true
    },
    callbacks: {
        async jwt({token, user}) {
            return  {...token, ...user }
        },
        async session({session, token, user}) {
            session.user = token
            return session
        }
    }
})