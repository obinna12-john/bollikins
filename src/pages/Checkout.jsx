import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useState } from 'react'
import Paystack from '@paystack/inline-js'

function Checkout() {
  const { cart, cartTotal } = useCart()

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    deliveryDate: '',
    giftMessage: ''
  })

  const paystack = new Paystack()

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handlePayment = () => {
    console.log('Customer details:', formData)

    paystack.newTransaction({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,

      email: formData.email,

      amount: cartTotal * 100,

      currency: 'NGN',

      onSuccess: async (transaction) => {
        console.log('Paystack transaction:', transaction)

        try {
          // Step 1: Ask our live backend to verify the payment
          const response = await fetch(
            `https://bollikins-api.onrender.com/api/verify-payment/${transaction.reference}`
          )

          const data = await response.json()

          console.log('Verification response:', data)

          if (data.success) {

            const order = {
              customer: formData,
              products: cart,
              total: cartTotal,
              paymentReference: transaction.reference
            }

            console.log('Verified order:', order)

            // Step 3: Send the verified order to our live backend
            const orderResponse = await fetch(
              'https://bollikins-api.onrender.com/api/orders',
              {
                method: 'POST',

                headers: {
                  'Content-Type': 'application/json'
                },

                body: JSON.stringify(order)
              }
            )

            const orderData = await orderResponse.json()

            console.log('Saved order:', orderData)

            if (orderData.success) {
              alert(
                'Payment successful! Your order has been confirmed.'
              )
            }

          } else {

            alert(
              'We could not verify your payment. Please contact us.'
            )

          }

        } catch (error) {

          console.error(
            'Payment verification failed:',
            error
          )

          alert(
            'There was a problem verifying your payment.'
          )
        }
      },

      onCancel: () => {
        console.log('Payment cancelled')

        alert('Payment cancelled')
      },

      onError: (error) => {
        console.error('Paystack error:', error)

        alert('There was a problem starting the payment.')
      }
    })
  }

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
          {/* <a href="#">About</a> */}
          <Link to="/contact">Contact</Link>
        </div>

        <Link
          to="/cart"
          className="cart-button"
        >
          Cart ({cart.reduce(
            (total, item) => total + item.quantity,
            0
          )})
        </Link>

      </nav>


      <section className="checkout-section">

        <div className="section-heading">

          <p>ALMOST THERE</p>

          <h2>
            Complete Your Order
          </h2>

        </div>


        <div className="checkout-container">


          <div className="checkout-form-container">

            <h3>
              Delivery Details
            </h3>


            <form
              onSubmit={(e) => {
                e.preventDefault()
                handlePayment()
              }}
            >

              <div className="form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="080XXXXXXXX"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Delivery Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your full delivery address"
                  rows="4"
                  required
                ></textarea>

              </div>


              <div className="form-group">

                <label>
                  Delivery Date
                </label>

                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Gift Message
                </label>

                <textarea
                  name="giftMessage"
                  value={formData.giftMessage}
                  onChange={handleChange}
                  placeholder="Write a message to include with the gift (optional)"
                  rows="4"
                ></textarea>

              </div>


              <button
                type="submit"
                className="checkout-button"
              >
                Continue to Payment
              </button>

            </form>

          </div>


          <div className="checkout-summary">

            <h3>
              Your Order
            </h3>


            {cart.map((item) => (

              <div
                className="summary-item"
                key={item.id}
              >

                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>
                  ₦{(
                    item.price * item.quantity
                  ).toLocaleString()}
                </span>

              </div>

            ))}


            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₦{cartTotal.toLocaleString()}
              </strong>

            </div>

          </div>

        </div>

      </section>

    </div>
  )
}

export default Checkout