import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Contact() {
  const { cart } = useCart()

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

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
          <Link to="/contact">Contact</Link>
        </div>

        <Link
          to="/cart"
          className="cart-button"
        >
          Cart ({cartCount})
        </Link>
      </nav>

      {/* Contact Section */}
      <section className="contact-section">

        <div className="section-heading">
          <p>GET IN TOUCH</p>

          <h2>We'd Love to Hear From You</h2>
        </div>

        <div className="contact-container">

          <div className="contact-info">

            <h3>Let's Talk</h3>

            <p>
              Have a question, special request, or need help
              choosing the perfect gift? We're here to help.
            </p>

            <div className="contact-details">

              <div className="contact-detail">
                <span>Phone</span>
                <p>08133775032</p>
              </div>

              <div className="contact-detail">
                <span>Email</span>
                <p>mobolajiodeyemi19@gmail.com</p>
              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  )
}

export default Contact