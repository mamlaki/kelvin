import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

export default function SignIn() {
  const router = useRouter()
  const { data: session } = useSession()

  if (session) {
    router.push('/')
  }

  return (
    <Container>
      <Typography
        variant='h4'
        style={{ marginBottom: '2rem' }}
      >
        Sign In
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button
            variant='outlined'
            fullWidth
            color='primary'
            onClick={() => signIn('google')}
          >
            Sign in with Google
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant='outlined'
            fullWidth
            color='primary'
            onClick={() => signIn('github')}  
          >
            Sign in with Github
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant='outlined'
            fullWidth
            color='primary'
            onClick={() => signIn('discord')}
          >
            Sign in with Discord           
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant='outlined'
            fullWidth
            color='primary'
            onClick={() => signIn('credentials')}
          >
            Sign in with Username and Password
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}