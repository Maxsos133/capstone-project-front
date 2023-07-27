import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

const Nav = () => {
  return (
    <nav> 
          <Link to="/">Home</Link>   
          <Link to="/media">Media</Link>     
          <Link to="/startorder">Start Order</Link>   
          <Link to="/profile">Profile</Link>
    </nav>
  )
}

export default Nav
