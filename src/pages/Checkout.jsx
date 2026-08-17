import { Link } from 'react-router-dom'
import { useState } from 'react'
import Paystack from '@paystack/inline-js'
import { useCart } from '../context/CartContext'

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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle payment
  const handlePayment = () => {
    if (cart.length === 0) {
      alert('Your cart is empty.')
      return
    }

    paystack.newTransaction({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,

      email: formData.email,

      // Paystack expects the amount in kobo
      amount: Math.round(cartTotal * 100),

      currency: 'NGN',

      onSuccess: async (transaction) => {
        console.log('Paystack transaction:', transaction)

        try {
          // Verify payment on the backend
          const verifyResponse = await fetch(
            `https://bollikins-api.onrender.com/api/verify-payment/${transaction.reference}`
          )

          if (!verifyResponse.ok) {
            throw new Error('Payment verification request failed.')
          }

          const verifyData = await verifyResponse.json()

          console.log('Verification response:', verifyData)

          if (!verifyData.success) {
            alert(
              'We could not verify your payment. Please contact us before trying again.'
            )
            return
          }

          // Create the order after successful verification
          const order = {
            customer: formData,
            products: cart,
            total: cartTotal,
            paymentReference: transaction.reference
          }

          console.log('Verified order:', order)

          // Save order to backend
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

          if (!orderResponse.ok) {
            throw new Error('Failed to save order.')
          }

          const orderData = await orderResponse.json()

          console.log('Saved order:', orderData)

          if (!orderData.success) {
            alert(
              'Payment was successful, but we could not save your order. Please contact us with your payment reference.'
            )
            return
          }

          // Save reference locally for the customer's order history
          const existingOrders = JSON.parse(
            localStorage.getItem('bollikins_orders') || '[]'
          )

          existingOrders.push({
            reference: transaction.reference,
            email: formData.email
          })

          localStorage.setItem(
            'bollikins_orders',
            JSON.stringify(existingOrders)
          )

          // Tell customer payment was successful
          alert(
            `Payment successful!\n\nYour order reference is:\n${transaction.reference}\n\nKeep this reference to track your order.`
          )

          // Send customer to order tracking page
          window.location.href =
            `/track-order?reference=${encodeURIComponent(
              transaction.reference
            )}&email=${encodeURIComponent(formData.email)}`
        } catch (error) {
          console.error('Payment processing error:', error)

          alert(
            'Your payment may have been successful, but we encountered a problem processing your order. Please contact us with your payment reference.'
          )
        }
      },

      onCancel: () => {
        console.log('Payment cancelled')
        alert('Payment cancelled.')
      },

      onError: (error) => {
        console.error('Paystack error:', error)
        alert('There was a problem starting the payment. Please try again.')
      }
    })
  }

  return (
    <div>
      {/* Navigation */}
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
          <Link to="/my-orders">My Orders</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <Link to="/cart" className="cart-button">
          Cart (
          {cart.reduce(
            (total, item) => total + item.quantity,
            0
          )}
          )
        </Link>
      </nav>

      {/* Checkout Section */}
      <section className="checkout-section">

        <div className="section-heading">
          <p>ALMOST THERE</p>

          <h2>
            Complete Your Order
          </h2>
        </div>

        <div className="checkout-container">

          {/* Checkout Form */}
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

              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="fullName">
                  Full Name
                </label>

                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Phone */}
              <div className="form-group">
                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="080XXXXXXXX"
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Address */}
              <div className="form-group">
                <label htmlFor="address">
                  Delivery Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your full delivery address"
                  rows="4"
                  required
                />
              </div>

              {/* Delivery Date */}
              <div className="form-group">
                <label htmlFor="deliveryDate">
                  Delivery Date
                </label>

                <input
                  id="deliveryDate"
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Gift Message */}
              <div className="form-group">
                <label htmlFor="giftMessage">
                  Gift Message
                </label>

                <textarea
                  id="giftMessage"
                  name="giftMessage"
                  value={formData.giftMessage}
                  onChange={handleChange}
                  placeholder="Write a message to include with the gift (optional)"
                  rows="4"
                />
              </div>

              {/* Payment Button */}
              <button
                type="submit"
                className="checkout-button"
              >
                Continue to Payment
              </button>

            </form>
          </div>

          {/* Order Summary */}
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
                  ₦
                  {(
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