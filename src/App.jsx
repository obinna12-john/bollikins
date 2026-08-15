import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { CartProvider } from './context/CartContext'
import Rooms from './pages/Rooms'
import CashGifts from './pages/CashGifts'
import GiftItems from './pages/GiftItems'
import TreatCorner from './pages/TreatCorner'

import Home from './pages/Home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'

import './App.css'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/cash-gifts" element={<CashGifts />}/>
          <Route path="/treat-corner" element={<TreatCorner />}/>
          <Route path="/cash-gifts" element={<CashGifts />}/>
          <Route path="/gift-items" element={<GiftItems />}/>
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App