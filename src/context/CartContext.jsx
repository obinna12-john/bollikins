import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {

  const [cart, setCart] = useState([])


  const addToCart = (product) => {

    setCart((currentCart) => {

      const existingItem = currentCart.find(
        (item) => item.id === product.id
      )

      if (existingItem) {

        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1
              }
            : item
        )

      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: product.quantity || 1
        }
      ]

    })

  }


  const removeFromCart = (id) => {

    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== id
      )
    )

  }


  const updateQuantity = (id, quantity) => {

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity
            }
          : item
      )
    )

  }


  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  )


  return (

    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal
      }}
    >

      {children}

    </CartContext.Provider>

  )

}


export function useCart() {

  return useContext(CartContext)

}