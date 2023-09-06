import { useState } from "react";
import { useRouter } from "next/router";

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
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username'>Username</label>
          <input
            type='text'
            id='username'
            value={ username }
            onChange={ (event) => setUsername(event.target.value) }
          />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            value={ password }
            onChange={ (event) => setPassword(event.target.value) }
          />
        </div>
        <div>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            value={ email }
            onChange={ (event) => setEmail(event.target.value) }
          />
        </div>
        <button type='submit'>Register Test</button>
      </form>
    </div>
  )
}