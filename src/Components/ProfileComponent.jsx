import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function ProfileComponent(props) {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    // Fetch orders by the logged-in user's email
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/orders/byBuyerEmail/${props.profile.email}`)
        setOrders(response.data)
        
      } catch (error) {
        console.log('Error fetching orders:', error)
      }
    }

    fetchOrders()
  }, [props.profile.email]) // Fetch orders whenever the profile email changes

  return (
    <>
      <div>YOUR EMAIL: {props.profile.email}</div>
      <div>
        <h2>Your Orders:</h2>
        <div>
          {orders.map((order, index) => (
            <div key={order._id}>
              {index+1}. Status: {order.status}, Description: {order.description}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}