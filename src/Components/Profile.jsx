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
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    setIsLoggedIn(!!isLoggedIn)

    if (isLoggedIn) {
      fetchProfileData()
    }
  }, [isLoggedIn])

  const fetchProfileData = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail')

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
    localStorage.removeItem('isLoggedIn')
    localStorage.setItem('userEmail',)
  }

  return (
    <>
      <h1 className='loginTitle'>{isLoggedIn ? '' : isSignUp ? 'Sign Up' : 'Login'}</h1>
      {message && <p>{message}</p>}
      {isLoggedIn ? (
        <>
          {profileData ? (
            profileData.isAdmin ? (
              <AdminPanel profile={profileData} />
            ) : (
              <ProfileComponent profile={profileData} />
            )
          ) : (
            <p>Loading profile data...</p>
          )}
          <button className="logoutBtn" onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <form className='loginForm'>
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
          <button className="loginBtn" onClick={isSignUp ? handleSignUp : handleLogin}>
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
      )}
      {!isLoggedIn && (
        <div className='issignupmsg'>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button className="signUpBtn" onClick={() => setIsSignUp((prev) => !prev)}>
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </div>
      )}
    </>
  )
}
