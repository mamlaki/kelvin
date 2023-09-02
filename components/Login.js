import { signIn, useSession } from 'next-auth/react'

export default function Login() {
    const { data: session } = useSession()

    return (
        <div>
            <h1>Welcome { session ? session.user.name : '' }</h1>
            {!session ? (
                <button onClick={() => signIn('google')}>Sign in with Google</button>
            ) : (
                <p>You are logged in!</p>
            )}
        </div>
    )
}