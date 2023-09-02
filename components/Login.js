import { useSession, signIn } from 'next-auth/react'
import { red } from '@mui/material/colors'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'


export default function Login() {
    const { data: session } = useSession()
    const color = red[500]

    return (
        <>
            {!session ? (
                <Grid container spacing={3}>
                    <Grid item>
                        <Button
                        variant='contained'
                        color='primary'
                        onClick={() => signIn('google')}
                        >
                            Sign In with Google
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                        variant='contained'
                        color='secondary'
                        onClick={() => signIn('github')}
                        >
                            Sign In with GitHub
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                        variant='contained'
                        color='error'
                        onClick={() => signIn('discord')}
                        >
                            Sign In with Discord
                        </Button>
                    </Grid>
                </Grid>
            ) : (
                <h1>Welcome, {session.user.name}!</h1>
            )}
        </>
    )
}