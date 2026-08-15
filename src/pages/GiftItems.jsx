import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext'

function GiftItems() {
  const { cart, addToCart } = useCart()

  const [selectedProduct, setSelectedProduct] = useState(null)

  const products = [
    {
      id: 'gift-1',
      name: 'Hot air balloon treat box',
      price: 36500,
      image: '/images/gift.jpg'
    },
    {
      id: 'gift-2',
      name: 'Mr. Austins box',
      price: 65000,
      image: '/images/austin.jpg'
    },
    {
      id: 'gift-3',
      name: 'His essential box',
      price: 55000,
      image: '/images/essential.jpg'
    },
    // {
    //   id: 'gift-4',
    //   name: ' Lady Luxe',
    //   price: 45000,
    //   description:
    //     'A coach bag, box of chocalate, jewellery set, mini journal, perfume and perfume oil, lip gloss, skincare essential(masks).'
    // },
    {
      id: 'gift-5',
      name: 'Mini Care box',
      price: 36500,
      image: '/images/mini.jpg'
    },
    {
      id: 'gift-6',
      name: 'Wellness box',
      price: 50000,
      image: '/images/wellness.jpg'
    },
    {
      id: 'gift-7',
      name: 'Comfort box',
      price: 76500,
      image: '/images/comfort.jpg'
    },
    {
      id: 'gift-8',
      name: 'Gents care box',
      price: 77500,
      image: '/images/box.jpg'
    },
    {
      id: 'gift-9',
      name: 'Bossman box',
      price: 85000,
      image: '/images/boss.jpg'
    },
    {
      id: 'gift-10',
      name: 'Talking stage treat',
      price: 18000,
      image: '/images/talk.jpg'
    },
    {
      id: 'gift-11',
      name: 'Delulu starter pack',
      price: 63000,
            description:
      '10 inches teddy bear, A botle of wine, A box of jewellery, A box of chocolate, Perfume and Body mist and a gift card.',
      image: '/images/delulu.jpg'
    },
  ]

  const itemCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      quantity: 1
    })

    alert(`${product.name} added to cart!`)
  }

  return (
    <div>

      <nav>

  {/* LEFT SIDE */}
  <div className="nav-brand">

    <img
      src="/images/logo.png"
      alt="Boxed by Bollikins"
      className="nav-logo-image"
    />

    <div className="logo">
      BOXED BY BOLLIKINS
    </div>

  </div>

  {/* NAVIGATION */}
  <div className="nav-links">
    <Link to="/">Home</Link>
    <Link to="/shop">Shop</Link>
  </div>

  {/* CART */}
  <Link to="/cart" className="cart-button">
    Cart ({cart.length})
  </Link>

</nav>

      <section className="products">

        <div className="section-heading">

          <p>GIFT BOX ITEMS</p>

          <h1>
            Choose Your Gifts
          </h1>

          <p>
            Select the items you'd like to include
            in your gift box.
          </p>

        </div>

        <div className="product-grid">

          {products.map((product) => (

            <div
              className="product-card"
              key={product.id}
            >

            <div className="product-image">
              <img src={product.image} alt={product.name}/>
            </div>


              <div className="product-info">

                <h3>
                  {product.name}
                </h3>

                <p>
                  {product.description}
                </p>

                <p className="product-price">
                  ₦{product.price.toLocaleString()}
                </p>


                <div className="product-buttons">

{/* <button
  type="button"
  onClick={() => {
    console.log('View Details clicked:', product)
    setSelectedProduct(product)
  }}
>
  View Details
</button> */}

                  <button
                    onClick={() =>
                      handleAddToCart(product)
                    }
                  >
                    Add to Cart
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        {cart.length > 0 && (

          <div className="shop-checkout">

            <p>
              {itemCount} item(s) in your cart
            </p>

            <Link to="/cart">
              View Cart & Checkout
            </Link>

          </div>

        )}

      </section>


      {selectedProduct && (

        <div className="product-modal">

          <div className="product-modal-content">

            <button
              className="close-button"
              onClick={() =>
                setSelectedProduct(null)
              }
            >
              ×
            </button>


            <div className="product-modal-image">
              {selectedProduct.name}
            </div>


            <h2>
              {selectedProduct.name}
            </h2>


            <p>
              {selectedProduct.description}
            </p>


            <p className="product-price">
              ₦{selectedProduct.price.toLocaleString()}
            </p>


            <button
              onClick={() => {
                handleAddToCart(selectedProduct)
                setSelectedProduct(null)
              }}
            >
              Add to Cart
            </button>

          </div>

        </div>

      )}

    </div>
  )
}

export default GiftItems