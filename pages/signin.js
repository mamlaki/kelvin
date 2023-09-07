import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'

export default function SignIn() {
  const router = useRouter()
  const { data: session } = useSession()

  const [userIdentifier, setUserIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState(null)

  if (session) {
    router.push('/')
  }

  const handleCredentialsSignIn = async (event) => {
    event.preventDefault()

    const result = await signIn('credentials', {
      userIdentifier,
      password,
      redirect: false
    })

    if (!result.ok) {
      setErrorMsg('Failed to log in. User does not exist or the password is incorrect.')
    }
  }

  return (
    <Container>
      <Typography
        variant='h4'
        style={{ marginBottom: '2rem' }}
      >
        Sign In
      </Typography>
      { errorMsg && <Alert severity='error'>{ errorMsg }</Alert> }
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <form onSubmit={ handleCredentialsSignIn }>
            <TextField 
              fullWidth
              label='Username or Email'
              variant='outlined'
              value={ userIdentifier }
              onChange={ (event) => setUserIdentifier(event.target.value) }
            />
            <TextField 
              fullWidth
              label='Password'
              variant='outlined'
              type='password'
              value={ password }
              onChange={ (event) => setPassword(event.target.value) }
              style={{ marginTop: '1rem' }}
            />
            <Button
              fullWidth
              variant='outlined'
              type='submit'
              color='primary'
              style={{ marginTop: '1rem' }}
            >
              Sign in with Username or Email
            </Button>
          </form>
        </Grid>
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
      </Grid>
    </Container>
  )
}