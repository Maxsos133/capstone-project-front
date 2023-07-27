import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ProfileComponent from './ProfileComponent'
import AdminPanel from './AdminPanel'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [profileData, setProfileData] = useState(null)

  useEffect(() => {
    // Check if the user is logged in (e.g., by checking a token in local storage)
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    setIsLoggedIn(!!isLoggedIn)

    // Fetch user profile data if logged in
    if (isLoggedIn) {
      fetchProfileData()
    }
  }, [isLoggedIn]) // Add isLoggedIn to the dependency array

  const fetchProfileData = async () => {
    try {
      // Get the email from local storage
      const userEmail = localStorage.getItem('userEmail')

      // Make an API request to fetch the user's profile data
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/${userEmail}`)
      setProfileData(response.data)
    } catch (error) {
      console.log('Error fetching profile data:', error)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, { email, password })
      setMessage(`Logged in successfully as ${response.data.email}`)
      setIsLoggedIn(true)
      // Store login state and user email in local storage
      localStorage.setItem('isLoggedIn', true)
      localStorage.setItem('userEmail', response.data.email)
    } catch (error) {
      setMessage('Login failed. Invalid credentials.')
    }
  }
  
  const handleSignUp = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/signup`, {
        email: email,
        name: nickname,
        password: password,
      })
      setMessage(`Sign up successful for ${response.data.email}`)
      setIsLoggedIn(true)
      // Store login state and user email in local storage
      localStorage.setItem('isLoggedIn', true)
      localStorage.setItem('userEmail', response.data.email)
    } catch (error) {
      setMessage('Sign up failed. User already exists or something went wrong.')
    }
  }
  const handleLogout = () => {
    setIsLoggedIn(false)
    // Remove login state from local storage or handle logout using your authentication method
    localStorage.removeItem('isLoggedIn')
    localStorage.setItem('userEmail',)
  }

  return (
    <>
      <h1>{isLoggedIn ? 'Logged In' : isSignUp ? 'Sign Up' : 'Login'}</h1>
      {message && <p>{message}</p>}
      {isLoggedIn ? (
        <>
          {profileData ? (
            // Check if the user is an admin and render AdminPanel accordingly
            profileData.isAdmin ? (
              <AdminPanel profile={profileData} />
            ) : (
              <ProfileComponent profile={profileData} />
            )
          ) : (
            <p>Loading profile data...</p>
          )}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <form>
          {isSignUp && (
            <div>
              <label>Nickname:</label>
              <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
            </div>
          )}
          <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {isSignUp && (
            <div>
              <label>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}
          <button onClick={isSignUp ? handleSignUp : handleLogin}>
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
      )}
      {!isLoggedIn && (
        <p>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => setIsSignUp((prev) => !prev)}>
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </p>
      )}
    </>
  )
}
