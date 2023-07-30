import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

const Nav = () => {
  return (
    <nav> 
          <Link className='logoTitle' to="/">BeNika</Link>   
          <Link to="/dresses">Dresses</Link>
          <Link to="/profile">Profile</Link> 
          <Link to="/startorder">Start Order</Link>   
    </nav>
  )
}

export default Nav
