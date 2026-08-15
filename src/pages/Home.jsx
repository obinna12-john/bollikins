import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
function Home() {
const { cart } = useCart()
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
      <section className="hero">

  <div className="hero-content">

    <p className="hero-small-text">
      MAKE EVERY MOMENT SPECIAL
    </p>

    <h1>
      Your moment,
      <br />
      Our Priority
    </h1>

    <p className="hero-description">
      Discover beautiful gifts made to make someone's
      special moment even more memorable
    </p>

    <Link to="/shop" className="shop-button">
      Shop Now
    </Link>

  </div>


  <div className="hero-logo">
    <img
      src="/images/logo.png"
      alt="Boxed by Bollikins"
    />
  </div>

</section>

      <section className="categories">
        <div className="section-heading">
          <p>WHAT WE OFFER</p>
          <h2>Find the Perfect Gift</h2>
        </div>

        <div className="category-grid">
          <div className="category-card">
            <div className="category-image">
                 <img src="/images/delulu.jpg" alt="Boxed by Bollikins"/>
            </div>
            <h3>Gift Boxes</h3>
            <p>
              Beautifully curated gifts for every occasion
            </p>
          </div>

          <div className="category-card">
            <div className="category-image">
              <img src="/images/bouquet4.jpg" alt="Boxed by Bollikins"/>
            </div>
            <h3>Money Bouquets</h3>
            <p>
              A creative way to make your gift extra special.
            </p>
          </div>

          <div className="category-card">
            <div className="category-image">
              <img src="/images/decorated3.jpg" alt="Boxed by Bollikins"/>
            </div>
            <h3>Luxury Room</h3>
            <p>
              Transform a space into a memorable surprise.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home