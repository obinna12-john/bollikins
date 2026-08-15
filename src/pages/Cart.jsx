import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal
  } = useCart()

  const itemCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  return (
    <div>

      <nav>

        <div className="nav-brand">

    <img
      src="/images/logo.png"
      alt="Boxed by Bollikins"
      className="nav-logo-image"
    />
    </div>
        <div className="logo">
          BOXED BY BOLLIKINS
        </div>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/contact">Contact</Link>
          {/* <a href="#">About</a>
          <a href="#">Contact</a> */}
        </div>

        <Link
          to="/cart"
          className="cart-button"
        >
          Cart ({itemCount})
        </Link>

      </nav>


      <section className="cart-section">

        <div className="section-heading">
          <p>YOUR SELECTION</p>
          <h1>Your Cart</h1>
        </div>


        {cart.length === 0 ? (

          <div className="empty-cart">

            <p>
              Your cart is empty.
            </p>

            <Link
              to="/shop"
              className="shop-button"
            >
              Continue Shopping
            </Link>

          </div>

        ) : (

          <div className="cart-container">

            <div className="cart-items">

              {cart.map((item, index) => (

                <div
                  className="cart-item"
                  key={item.id || index}
                >

                  <div className="cart-item-info">

                    <h3>
                      {item.name}
                    </h3>


                    {/* ROOM CUSTOMIZATION */}

                    {item.colourTheme && (

                      <p>
                        Colour Theme:{' '}
                        {item.colourTheme}
                      </p>

                    )}


                    {/* CASH GIFT DETAILS */}

                    {item.denomination && (

                      <>
                        <p>
                          Denomination: ₦
                          {item.denomination.toLocaleString()}
                        </p>

                        <p>
                          Number of Notes:{' '}
                          {item.cashQuantity}
                        </p>

                        <p>
                          Cash Value: ₦
                          {item.cashValue.toLocaleString()}
                        </p>
                      </>

                    )}


                    <p className="cart-item-price">
                      ₦{item.price.toLocaleString()}
                    </p>

                  </div>


                  {/* QUANTITY */}

                  <div className="quantity-control">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          Math.max(
                            1,
                            item.quantity - 1
                          )
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>

                  </div>


                  {/* REMOVE */}

                  <button
                    className="remove-button"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    Remove
                  </button>

                </div>

              ))}

            </div>


            {/* CART SUMMARY */}

            <div className="cart-summary">

              <h2>
                Order Summary
              </h2>

              <div className="summary-row">

                <span>
                  Items
                </span>

                <span>
                  {itemCount}
                </span>

              </div>


              <div className="summary-row total">

                <span>
                  Total
                </span>

                <strong>
                  ₦{cartTotal.toLocaleString()}
                </strong>

              </div>


              <Link
                to="/checkout"
                className="checkout-button"
              >
                Proceed to Checkout
              </Link>

            </div>

          </div>

        )}

      </section>

    </div>
  )
}

export default Cart