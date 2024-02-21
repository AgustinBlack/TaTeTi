import './App.css'
import NavBar from './components/NavBar/NavBar'
import TaTeTi from './components/TaTeTi/TaTeTi'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<NavBar/>} />
          <Route path='/TaTeTi' element={<TaTeTi/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
