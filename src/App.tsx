import React from 'react'
import logo from './logo.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import UserAccountPage from './pages/users/UserAccountPage'
import Header from './navigation/Header'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<UserAccountPage />} />
      </Routes>
    </>
  )
}

export default App
