import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import Profile from './Profile'
import Dresses from './Dresses'
import Startorder from './Startorder'

export default function Main() {
  return (
    <div className="routes-container">
      <Routes>
      
      
        <Route exact path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dresses" element={<Dresses />} />
        <Route path="/startorder" element={<Startorder />} />
      
      
      </Routes>
    </div>
  )
}
