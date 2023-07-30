import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ManageDressesPage from './ManageDressesPage'

export default function AdminPanel(props) {
    const [orders, setOrders] = useState([])
  const [showCompletedOrders, setShowCompletedOrders] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/orders`)
      setOrders(response.data)
    } catch (error) {
      console.log('Error fetching orders:', error)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/orders/${orderId}`, {
        status: newStatus,
      })
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
      setOrders(updatedOrders)
    } catch (error) {
      console.log('Error updating order status:', error)
    }
  }

  const handleToggleOrders = () => {
    setShowCompletedOrders((prev) => !prev)
  }

  const filteredOrders = showCompletedOrders
    ? orders.filter((order) => order.status === 'completed')
    : orders.filter((order) => order.status !== 'completed')

  return (
    <div className='adminPanel'>
      <h2 className='adminPanelTitle' >Admin Panel</h2>
      <ManageDressesPage />
        <button className='toggleCompletedBtn' onClick={handleToggleOrders}>
          Show {showCompletedOrders ? 'Incomplete' : 'Completed'} Orders
        </button>
      {filteredOrders.map((order) => (
        <div className='orderData' key={order._id}>
            <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)}>
            <option value="pending">Pending</option>
            <option value="in queue">In Queue</option>
            <option value="in progress">In Progress</option>
            <option value="awaiting buyer contact">Awaiting Buyer Contact</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
          </select>
          <p>Buyer Email: {order.buyer}</p>
          <p>Dress: {order.dress}</p>
          <p>Size: {order.size}</p>
          {order.customSize[0] && (
            <div>
              <p>Custom Size:</p>
              <ul>
                {Object.entries(order.customSize[0]).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p>Color: {order.color}</p>
          <p>Description: {order.description}</p>
        </div>
      ))}
    </div>
  )
}