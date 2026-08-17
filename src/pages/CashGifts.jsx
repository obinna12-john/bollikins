import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function CashGifts() {
  const { cart, addToCart } = useCart()

  const [activeTab, setActiveTab] = useState('packages')
  const [denomination, setDenomination] = useState('')
  const [quantity, setQuantity] = useState(1)

  const denominations = [200, 500, 1000]

  const packages = [
    {
      id: 'cash-package-1',
      name: '50k Personalized Money Box',
      cashValue: 50000,
      price: 90500,
      image: '/images/bouquet2.jpg'
    },
    {
      id: 'cash-package-2',
      name: '50k I Love You Money Box',
      cashValue: 50000,
      price: 83500,
      image: '/images/bouquet3.jpg'
    },
    {
      id: 'cash-package-3',
      name: '100k Money Bouquet',
      cashValue: 100000,
      price: 188500,
      image: '/images/bouquet4.jpg'
    }
  ]

  // CART COUNT
  const itemCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  // CUSTOM CASH BOUQUET CALCULATION
  const cashValue = denomination
    ? Number(denomination) * quantity
    : 0

  const total = cashValue

  // ADD CUSTOM CASH GIFT TO CART
  const handleCustomAddToCart = () => {
    if (!denomination) {
      alert('Please select a cash denomination.')
      return
    }

    if (!quantity || quantity < 1) {
      alert('Please enter the number of notes.')
      return
    }

    addToCart({
      id: `cash-${Date.now()}`,
      name: 'Custom Cash Gift Bouquet',
      price: total,
      quantity: 1,
      denomination: Number(denomination),
      cashQuantity: quantity,
      cashValue: cashValue
    })

    alert('Custom cash gift added to cart!')
  }

  const handlePackageAddToCart = (giftPackage) => {
    addToCart({
      ...giftPackage,
      quantity: 1
    })

    alert(`${giftPackage.name} added to cart!`)
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

      <section className="cash-gifts-section">

        <div className="section-heading">

          <p>CASH GIFTS</p>

          <h1>
            Make Your Gift Extra Special
          </h1>

        </div>


        {/* TABS */}
        <div className="cash-tabs">

          <button
            className={
              activeTab === 'packages'
                ? 'cash-tab active'
                : 'cash-tab'
            }
            onClick={() => setActiveTab('packages')}
          >
            Cash Gift Packages
          </button>

          <button
            className={
              activeTab === 'custom'
                ? 'cash-tab active'
                : 'cash-tab'
            }
            onClick={() => setActiveTab('custom')}
          >
            Customised
          </button>

        </div>


        {/* SLIDER */}
        <div className="cash-slider">

          <div
            className={
              activeTab === 'custom'
                ? 'cash-slides show-custom'
                : 'cash-slides'
            }
          >


            {/* =========================
                PRE-DESIGNED PACKAGES
            ========================= */}

            <div className="cash-slide">

              <div className="section-heading">

                <p>OUR COLLECTION</p>

                <h2>
                  Cash Gift Packages
                </h2>

                <p>
                  Choose from our pre-designed cash gift packages.
                </p>

              </div>


              <div className="product-grid">

                {packages.map((giftPackage) => (

                  <div
                    className="product-card"
                    key={giftPackage.id}
                  >

                    {/* PACKAGE IMAGE */}
                    <div className="custom-product-image">

                      <img
                        src={giftPackage.image}
                        alt={giftPackage.name}
                      />

                    </div>


                    {/* PACKAGE DETAILS */}
                    <div className="product-info">

                      <h3>
                        {giftPackage.name}
                      </h3>


                      <p className="cash-value">
                        Cash Value:{' '}

                        <strong>
                          ₦{giftPackage.cashValue.toLocaleString()}
                        </strong>
                      </p>


                      <p className="product-price">
                        ₦{giftPackage.price.toLocaleString()}
                      </p>


                      <button
                        onClick={() =>
                          handlePackageAddToCart(giftPackage)
                        }
                      >
                        Add to Cart
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </div>


            {/* =========================
                CUSTOM CASH BOUQUET
            ========================= */}

            <div className="cash-slide">

              <div className="custom-product-container">


                {/* CUSTOM BOUQUET IMAGE */}
                <div className="custom-product-image">

                  <img
                    src="/images/bouquet3.jpg"
                    alt="Custom Cash Gift Bouquet"
                  />

                </div>


                {/* CUSTOM BOUQUET OPTIONS */}
                <div className="custom-product-details">

                  <h2>
                    Create Your Cash Bouquet
                  </h2>


                  {/* DENOMINATION */}
                  <div className="custom-option">

                    <h3>
                      Choose Denomination
                    </h3>

                    <div className="option-list">

                      {denominations.map((amount) => (

                        <button
                          key={amount}
                          className={
                            Number(denomination) === amount
                              ? 'option selected'
                              : 'option'
                          }
                          onClick={() =>
                            setDenomination(amount)
                          }
                        >
                          ₦{amount.toLocaleString()}
                        </button>

                      ))}

                    </div>

                  </div>


                  {/* NUMBER OF NOTES */}
                  <div className="custom-option">

                    <h3>
                      Number of Notes
                    </h3>

                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Number(e.target.value))
                      }
                      placeholder="Enter number of notes"
                    />

                  </div>


                  {/* PRICE BREAKDOWN */}
                  <div className="price-breakdown">

                    <p>
                      Cash Value

                      <strong>
                        ₦{cashValue.toLocaleString()}
                      </strong>
                    </p>

                    <hr />

                    <p>
                      Total

                      <strong>
                        ₦{total.toLocaleString()}
                      </strong>
                    </p>

                  </div>


                  {/* ADD TO CART */}
                  <button
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


        {/* CART MESSAGE */}
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

    </div>
  )
}

export default CashGifts