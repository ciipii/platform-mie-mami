import { Routes, Route } from 'react-router-dom'

// Import pages
import SinglePage from './pages/SinglePage'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductDetail from './pages/ProductDetail'
import Dashboard from './pages/Dashboard'
import Cart from './pages/Cart'
import Orders from './pages/Orders'

// Import components
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<SinglePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
