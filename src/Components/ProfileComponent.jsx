import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function ProfileComponent(props) {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/orders/byBuyerEmail/${props.profile.email}`)
        setOrders(response.data)
        
      } catch (error) {
        console.log('Error fetching orders:', error)
      }
    }

    fetchOrders()
  }, [props.profile.email])

  return (
    <div className='UserProfile'>
      <div>
        <h2>Your Orders:</h2>
        <div>
          {orders.map((order, index) => (
            <div key={order._id}>
              {index+1}. Status: {order.status}
              <div>Dress: {order.dress}</div>
              <div>Color: {order.color}</div>
              <div>Size: {order.size}</div>
              {order.customSize[0] && (
            <div>
              <p>Custom Size:</p>
              <ul>
                {Object.entries(order.customSize[0]).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value}cm
                  </li>
                ))}
              </ul>
            </div>
          )}
              Description: {order.description}

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}