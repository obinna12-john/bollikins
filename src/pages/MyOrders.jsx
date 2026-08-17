import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import supabase from '../supabaseClient'

function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const savedReferences = JSON.parse(
      localStorage.getItem('bollikins_orders') || '[]'
    )

    if (savedReferences.length === 0) {
      setLoading(false)
      return
    }

    const loadOrders = async () => {
      try {
        const results = await Promise.all(
          savedReferences.map(async (reference) => {
            const response = await fetch(
  `https://bollikins-api.onrender.com/api/orders/track?reference=${encodeURIComponent(reference.reference)}&email=${encodeURIComponent(reference.email)}`
)

            const data = await response.json()

            if (data.success) {
              return data.order
            }

            return null
          })
        )

        setOrders(
          results.filter((order) => order !== null)
        )

      } catch (error) {
        console.error('Unable to load orders:', error)

        setError(
          'Unable to load your orders right now.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  useEffect(() => {
  if (orders.length === 0) return

  const channel = supabase
    .channel('my-orders-status')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders'
      },
      (payload) => {
        console.log('Order updated:', payload.new)

        setOrders((currentOrders) =>
          currentOrders.map((order) =>
            order.id === payload.new.id
              ? {
                  ...order,
                  ...payload.new
                }
              : order
          )
        )
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [orders.length])

  const getStatusLabel = (status) => {
    if (!status) return 'Order Received'

    return status.charAt(0).toUpperCase() +
      status.slice(1)
  }

  if (loading) {
    return (
      <div className="my-orders-page">
        <h2>Loading your orders...</h2>
      </div>
    )
  }

  return (
    <div className="my-orders-page">

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
          <Link to="/my-orders">My Orders</Link>
        </div>
      </nav>


      <section className="my-orders-section">

        <div className="section-heading">

          <p>YOUR ORDERS</p>

          <h2>
            My Orders
          </h2>

          <span>
            View your orders and track their progress.
          </span>

        </div>


        {error && (
          <p className="track-order-error">
            {error}
          </p>
        )}


        {orders.length === 0 && !error ? (

          <div className="no-orders">

            <h3>
              You don't have any orders yet.
            </h3>

            <p>
              Your orders will appear here after
              you complete a purchase.
            </p>

            <Link
              to="/shop"
              className="checkout-button"
            >
              Start Shopping
            </Link>

          </div>

        ) : (

          <div className="orders-list">

            {orders.map((order) => (

              <div
                className="order-card"
                key={order.id}
              >

                <div className="order-card-header">

                  <div>

                    <p>
                      ORDER REFERENCE
                    </p>

                    <h3>
                      {order.payment_reference}
                    </h3>

                  </div>


                  <span
                    className={`status-badge status-${order.status || 'new'}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>

                </div>


                <div className="order-card-info">

                  <div>
                    <span>Total</span>

                    <strong>
                      ₦{Number(
                        order.total
                      ).toLocaleString()}
                    </strong>
                  </div>


                  <div>
                    <span>Delivery Date</span>

                    <strong>
                      {order.delivery_date}
                    </strong>
                  </div>

                </div>


                <div className="order-progress">

                  <div
                    className={
                      !order.status ||
                      order.status === 'new' ||
                      order.status === 'preparing' ||
                      order.status === 'ready' ||
                      order.status === 'delivered'
                        ? 'progress-step active'
                        : 'progress-step'
                    }
                  >
                    <span>1</span>
                    <p>Received</p>
                  </div>


                  <div
                    className={
                      order.status === 'preparing' ||
                      order.status === 'ready' ||
                      order.status === 'delivered'
                        ? 'progress-step active'
                        : 'progress-step'
                    }
                  >
                    <span>2</span>
                    <p>Preparing</p>
                  </div>


                  <div
                    className={
                      order.status === 'ready' ||
                      order.status === 'delivered'
                        ? 'progress-step active'
                        : 'progress-step'
                    }
                  >
                    <span>3</span>
                    <p>Ready</p>
                  </div>


                  <div
                    className={
                      order.status === 'delivered'
                        ? 'progress-step active'
                        : 'progress-step'
                    }
                  >
                    <span>4</span>
                    <p>Delivered</p>
                  </div>

                </div>


                <div className="order-card-products">

                  <h4>
                    Items
                  </h4>

                  {order.items?.map((item) => (

                    <div
                      className="tracked-order-item"
                      key={item.id}
                    >

                      <span>
                        {item.product_name} × {item.quantity}
                      </span>

                      <span>
                        ₦{Number(
                          item.price * item.quantity
                        ).toLocaleString()}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  )
}

export default MyOrders