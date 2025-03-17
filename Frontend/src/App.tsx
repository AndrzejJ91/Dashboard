

import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard'
import LogIn from './pages/LogIn'

function App() {
 

  return (
   
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
 
  )
}

export default App
