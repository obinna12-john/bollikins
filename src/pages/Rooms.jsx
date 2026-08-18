import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Rooms() {
  const { cart, addToCart } = useCart()

  const [activeTab, setActiveTab] = useState('packages')
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedTheme, setSelectedTheme] = useState('')

  const packages = [
    {
      id: 'room-package-1',
      name: 'Birthday Set Up',
      price: 38500,
      description:
        '30 balloons, 1 foil balloon, foil drapes, rose petals, birthday sash and foil number balloons.',
      image: '/images/decorated2.jpg'
    },
    {
      id: 'room-package-2',
      name: 'Proposal Set Up',
      price: 56500,
      description:
        'An elegant room decoration designed to create a memorable surprise.',
      image: '/images/decorated3.jpg'
    }
  ]

  const customRoom = {
    id: 'room-custom',
    name: 'Custom Room Setup',
    price: 43500
  }

  const colourThemes = [
    'Pink & White',
    'Blue & White',
    'Red & Black',
    'Purple & White',
    'Gold & White'
  ]

  const itemCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  // ADD PACKAGE TO CART

  const handlePackageAddToCart = (roomPackage) => {
    addToCart({
      ...roomPackage,
      quantity: 1
    })

    alert(`${roomPackage.name} added to cart!`)
  }

  // ADD CUSTOM ROOM TO CART

  const handleCustomAddToCart = () => {
    if (!selectedTheme) {
      alert('Please select a colour theme first.')
      return
    }

    addToCart({
      ...customRoom,
      quantity: 1,
      colourTheme: selectedTheme
    })

    alert('Custom room decoration added to cart!')
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
    <Link to="/contact">Contact</Link>
    <Link to="/my-orders">My Orders</Link>
  </div>

  {/* CART */}
  <Link to="/cart" className="cart-button">
    Cart ({cart.length})
  </Link>

</nav>

      <section className="rooms-section">

        <div className="section-heading">

          <p>DECORATED ROOMS</p>

          <h1>
            Create the Perfect Surprise
          </h1>

        </div>

        <div className="room-tabs">

          <button
            className={
              activeTab === 'packages'
                ? 'room-tab active'
                : 'room-tab'
            }
            onClick={() => setActiveTab('packages')}
          >
            Room Packages
          </button>

          <button
            className={
              activeTab === 'custom'
                ? 'room-tab active'
                : 'room-tab'
            }
            onClick={() => setActiveTab('custom')}
          >
            Customised
          </button>

        </div>

        <div className="room-slider">

          <div
            className={
              activeTab === 'custom'
                ? 'room-slides show-custom'
                : 'room-slides'
            }
          >

            <div className="room-slide">

              <div className="section-heading">

                <p>OUR PACKAGES</p>

                <h2>
                  Choose a Room Setup
                </h2>

                <p>
                  Select from our beautifully designed
                  room decoration packages.
                </p>

              </div>


              <div className="product-grid">

                {packages.map((roomPackage) => (

                  <div
                    className="product-card"
                    key={roomPackage.id}
                  >

                    {/* IMAGE */}

                    <div className="product-image">

                      <img
                        src={roomPackage.image}
                        alt={roomPackage.name}
                      />

                    </div>


                    {/* PRODUCT INFO */}

                    <div className="product-info">

                      <h3>
                        {roomPackage.name}
                      </h3>

                      <p>
                        {roomPackage.description}
                      </p>

                      <p className="product-price">
                        ₦{roomPackage.price.toLocaleString()}
                      </p>


                      <div className="product-buttons">

                        <button
                          type="button"
                          className="details-button"
                          onClick={() =>
                            setSelectedRoom(roomPackage)
                          }
                        >
                          View Details
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handlePackageAddToCart(roomPackage)
                          }
                        >
                          Add to Cart
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

            <div className="room-slide">

              <div className="section-heading">

                <p>CUSTOM ROOM</p>

                <h2>
                  Design Your Room
                </h2>

                <p>
                  Choose a colour theme for your
                  customised room decoration.
                </p>

              </div>


              <div className="custom-product-container">

                <div className="custom-product-image">

                  <img src="/images/decorated.jpg" alt="Custom Room Decoration"/>
                </div>

                <div className="custom-product-details">

                  <h2>
                    Custom Room Setup
                  </h2>

                  <p className="product-price">
                    ₦{customRoom.price.toLocaleString()}
                  </p>

                  <div className="custom-option">

                    <h3>
                      Choose a Colour Theme
                    </h3>

                    <div className="option-list">

                      {colourThemes.map((theme) => (

                        <button
                          type="button"
                          key={theme}
                          className={
                            selectedTheme === theme
                              ? 'option selected'
                              : 'option'
                          }
                          onClick={() =>
                            setSelectedTheme(theme)
                          }
                        >
                          {theme}
                        </button>

                      ))}

                    </div>

                  </div>

                  {selectedTheme && (

                    <p className="selected-option">
                      Selected: {selectedTheme}
                    </p>

                  )}


                  <button
                    type="button"
                    className="checkout-button"
                    onClick={handleCustomAddToCart}
                  >
                    Add to Cart
                  </button>

                </div>

              </div>

            </div>

          </div>

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

      {selectedRoom && (

        <div
          className="product-modal-overlay"
          onClick={() => setSelectedRoom(null)}
        >

          <div
            className="product-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              type="button"
              className="modal-close"
              onClick={() => setSelectedRoom(null)}
            >
              ×
            </button>

            <div className="product-modal-image">

              <img
                src={selectedRoom.image}
                alt={selectedRoom.name}
              />

            </div>

            <div className="product-modal-content">

              <p className="modal-label">
                DECORATED ROOMS
              </p>

              <h2>
                {selectedRoom.name}
              </h2>

              <p className="modal-description">
                {selectedRoom.description}
              </p>

              <p className="product-price">
                ₦{selectedRoom.price.toLocaleString()}
              </p>


              <button
                type="button"
                className="checkout-button"
                onClick={() => {
                  handlePackageAddToCart(selectedRoom)
                  setSelectedRoom(null)
                }}
              >
                Add to Cart
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default Rooms