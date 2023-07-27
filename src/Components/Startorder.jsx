import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Startorder(){
    const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [fabric, setFabric] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if the user is logged in (e.g., by checking a token in local storage)
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    setIsLoggedIn(!!isLoggedIn)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Get the buyer email from local storage
      const buyerEmail = localStorage.getItem('userEmail')

      // Make an API call to create the order
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/orders/create`, {
        buyerEmail,
        size,
        color,
        fabric,
        description,
      })

      setMessage('Order created successfully.')
      // Optionally, you can reset the form fields after a successful order creation.
      setSize('')
      setColor('')
      setFabric('')
      setDescription('')
    } catch (error) {
      setMessage('Failed to create the order.')
    }
  }

  return (
    <div>
      <h2>Start Order Form</h2>
      {message && <p>{message}</p>}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Size:</label>
            <input type="text" value={size} onChange={(e) => setSize(e.target.value)} required />
          </div>
          <div>
            <label>Color:</label>
            <input type="text" value={color} onChange={(e) => setColor(e.target.value)} required />
          </div>
          <div>
            <label>Fabric:</label>
            <input type="text" value={fabric} onChange={(e) => setFabric(e.target.value)} required />
          </div>
          <div>
            <label>Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <button type="submit">Submit Order</button>
        </form>
      ) : (
        <p>Please log in to start an order.</p>
      )}
    </div>
  )
}