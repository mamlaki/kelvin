import { useState } from "react";
import { useRouter } from "next/router";

import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleSubmit = async(event) => {
    event.preventDefault()

    const response = await fetch('api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password,
        email
      })
    })

    const data = await response.json()
    console.log('Response Data:', data)
    console.log('Status Code:', response.status)

    if (response.ok) {
      router.push('/')
    } else {
      console.error('Failed to register user')
    }
  }

  return (
    <Container component='main' maxWidth='xs'>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <TextField 
          fullWidth
          margin='normal'
          required
          label='Username'
          value={ username }
          onChange={ (event) => setUsername(event.target.value) }
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <IconButton>
                  <AccountCircle />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField 
          fullWidth
          margin='normal'
          required
          label='Email'
          type='email'
          value={ email }
          onChange={ (event) => setEmail(event.target.value) }
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <IconButton>
                  <EmailIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField 
          fullWidth
          margin='normal'
          required
          label='Password'
          type='password'
          value={ password }
          onChange={ (event) => setPassword(event.target.value) }
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <IconButton>
                  <VpnKeyIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button
          type='submit'
          fullWidth
          variant='contained'
          color='primary'
        >
          Register
        </Button>
      </form>
    </Container>
  )
}