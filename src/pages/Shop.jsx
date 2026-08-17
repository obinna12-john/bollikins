import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Shop() {
  const { cart } = useCart()

  const itemCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const categories = [
    {
      title: 'Gift Box Items',
      description:
        'Choose from our selection of thoughtful gifts to create something special.',
      link: '/gift-items',
      image: '/images/box.jpg'
    },
    {
      title: 'Cash Gifts',
      description:
        'Create a beautiful cash gift bouquet with your preferred denomination and amount.',
      link: '/cash-gifts',
      image: '/images/bouquets.jpg'
    },
    {
      title: 'Decorated Rooms',
      description:
        'Choose a room decoration package and personalise it with your preferred colour theme.',
      link: '/rooms',
      image: '/images/decorated.jpg'
    },
    {
    title: 'Treat Corner',
    description:
    'Choose delicious treats and snacks to make your gift extra special.',
    link: '/treat-corner',
    image: '/images/treat.jpg'
    }
  ]

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


      <section className="products">

        <div className="section-heading">

          <p>OUR SERVICES</p>

          <h1>
            Choose What You'd Like
          </h1>

        </div>


        <div className="category-grid">

          {categories.map((category) => (

            <div
              className="category-card"
              key={category.title}
            >

               <div className="category-image">

                <img
                  src={category.image}
                  alt={category.title}
                />

              </div>



              <h3>
                {category.title}
              </h3>


              <p>
                {category.description}
              </p>


              <Link
                to={category.link}
                className="shop-button"
              >
                View Options
              </Link>

            </div>

          ))}

        </div>

      </section>

    </div>
  )
}

export default Shop