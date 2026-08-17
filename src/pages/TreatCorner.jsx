import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext'

function TreatCorner() {
  const { cart, addToCart } = useCart()

  const [selectedTreat, setSelectedTreat] = useState(null)

  const treats = [
    {
      id: 'treat-1',
      name: 'Small Chops',
      price: 5000,
      image: '/images/chops.jpg'
    },
    {
      id: 'treat-2',
      name: 'A platter of small chops',
      price: 12000,
      image: '/images/chop.jpg'
    },
    {
      id: 'treat-3',
      name: "6'1 Vanilla Birthday cake",
      price: 18000,
      image: '/images/cake.jpg'
    },
    {
      id: 'treat-4',
      name: "7'3 Vanilla cake",
      price: 55000,
      image: '/images/cakes.jpg'
    },
    {
      id: 'treat-5',
      name: "Banana bread",
      price: 2000,
      image: '/images/ban.jpg'
    },
    {
      id: 'treat-6',
      name: "5 inches Bento cake",
      price: 12000,
      image: '/images/bento.jpg'
    },
    {
      id: 'treat-7',
      name: "6'1 Red velvet cake",
      price: 23000,
      image: '/images/red.jpg'
    },
    {
      id: 'treat-8',
      name: "2-tier novelty cake",
      price: 120000,
      image: '/images/treat.jpg'
    },
    {
      id: 'treat-9',
      name: "Bento cake",
      price: 12000,
      image: '/images/bentos.jpg'
    },
    {
      id: 'treat-10',
      name: "6'1 Vanilla cake",
      price: 18000,
      image: '/images/vanil.jpg'
    },
    {
      id: 'treat-11',
      name: "Foil cake",
      price: 3500,
      image: '/images/foil.jpg'
    },
    {
      id: 'treat-12',
      name: "Cake Slices",
      price: 1500,
      image: '/images/slice.jpg'
    },
    {
      id: 'treat-13',
      name: "Small chops plate",
      price: 3000,
      image: '/images/plate.jpg'
    },
    {
      id: 'treat-14',
      name: "Picnic treat",
      price: 33000,
      image: '/images/picnic.jpg'
    },
  ]

  const itemCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const handleAddToCart = (treat) => {
    addToCart({
      ...treat,
      quantity: 1
    })

    alert(`${treat.name} added to cart!`)
  }

  return (
    <div>

      {/* NAVIGATION */}

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
    <Link to="/contact">Contact</Link>
    <Link to="/my-orders">My Orders</Link>
  </div>

  {/* CART */}
  <Link to="/cart" className="cart-button">
    Cart ({cart.length})
  </Link>

</nav>

      <section className="products">

        <div className="section-heading">

          <p>TREAT CORNER</p>

          <h1>
            Sweet & Savoury Treats
          </h1>

          <p>
            Choose delicious treats to make your gift
            even more special.
          </p>

        </div>

        <div className="product-grid">

          {treats.map((treat) => (

            <div
              className="product-card"
              key={treat.id}
            >

              <div className="product-image">
                <img src={treat.image} alt={treat.name}/>
              </div>


              <div className="product-info">

                <h3>
                  {treat.name}
                </h3>

                <p className="product-price">
                  ₦{treat.price.toLocaleString()}
                </p>


                <div className="product-buttons">

                  {/* <button
                    type="button"
                    className="view-details-button"
                    onClick={() =>
                      setSelectedTreat(treat)
                    }
                  >
                    View Details
                  </button> */}

                  <button
                    type="button"
                    onClick={() =>
                      handleAddToCart(treat)
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


      {selectedTreat && (

        <div className="product-modal">

          <div className="product-modal-content">

            <button
              type="button"
              className="close-button"
              onClick={() =>
                setSelectedTreat(null)
              }
            >
              ×
            </button>

            <div className="product-modal-image">
              {selectedTreat.name}
            </div>

            <h2>
              {selectedTreat.name}
            </h2>

            <p>
              {selectedTreat.description}
            </p>

            <p className="product-price">
              ₦{selectedTreat.price.toLocaleString()}
            </p>


            <button
              type="button"
              onClick={() => {
                handleAddToCart(selectedTreat)
                setSelectedTreat(null)
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

export default TreatCorner