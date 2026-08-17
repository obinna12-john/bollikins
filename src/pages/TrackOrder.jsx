import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import supabase from '../supabaseClient'

function TrackOrder() {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [searchParams] = useSearchParams()

  const [reference, setReference] = useState(
    searchParams.get('reference') || ''
  )

  const [email, setEmail] = useState(
    searchParams.get('email') || ''
  )

  // Get the numerical progress position
  const getStatusStep = (status) => {
    switch (status) {
      case 'new':
        return 1
      case 'preparing':
        return 2
      case 'ready':
        return 3
      case 'delivered':
        return 4
      default:
        return 1
    }
  }

  // Listen for live changes to this order
  useEffect(() => {
    if (!order?.id) return

    const channel = supabase
      .channel(`order-${order.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${order.id}`
        },
        (payload) => {
          console.log('Order status updated:', payload.new)

          setOrder((currentOrder) => ({
            ...currentOrder,
            ...payload.new
          }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [order?.id])

  const handleTrackOrder = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const response = await fetch(
        `https://bollikins-api.onrender.com/api/orders/track?reference=${encodeURIComponent(
          reference
        )}&email=${encodeURIComponent(email)}`
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(
          data.message || 'Order could not be found.'
        )
        return
      }

      setOrder(data.order)

    } catch (error) {
      console.error('Track order error:', error)

      setError(
        'Unable to track your order right now. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const currentStep = order
    ? getStatusStep(order.status)
    : 1

  return (
    <div className="track-order-page">

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
        </div>

      </nav>


      <section className="track-order-section">

        <div className="section-heading">

          <p>ORDER TRACKING</p>

          <h2>
            Track Your Order
          </h2>

          <span>
            Enter your order reference and email to see
            your order status.
          </span>

        </div>


        <div className="track-order-container">

          <form
            className="track-order-form"
            onSubmit={handleTrackOrder}
          >

            <div className="form-group">

              <label>
                Order Reference
              </label>

              <input
                type="text"
                value={reference}
                onChange={(e) =>
                  setReference(e.target.value)
                }
                placeholder="Enter your order reference"
                required
              />

            </div>


            <div className="form-group">

              <label>
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter the email used for your order"
                required
              />

            </div>


            {error && (
              <p className="track-order-error">
                {error}
              </p>
            )}


            <button
              type="submit"
              className="checkout-button"
              disabled={loading}
            >
              {loading
                ? 'Finding Order...'
                : 'Track Order'}
            </button>

          </form>


          {order && (

            <div className="tracked-order">

              <div className="tracked-order-header">

                <div>

                  <p>ORDER</p>

                  <h3>
                    {order.payment_reference}
                  </h3>

                </div>

                <span
                  className={`status-badge status-${order.status}`}
                >
                  {order.status
                    .charAt(0)
                    .toUpperCase() +
                    order.status.slice(1)}
                </span>

              </div>


              {/* ORDER PROGRESS */}

              <div className="order-progress">

                {/* Progress line */}

                <div className="progress-line">

                  <div
                    className="progress-line-filled"
                    style={{
                      width: `${((currentStep - 1) / 3) * 100}%`
                    }}
                  />

                </div>


                {/* STEP 1 */}

                <div
                  className={`progress-step ${
                    currentStep >= 1
                      ? 'active'
                      : ''
                  }`}
                >

                  <span>1</span>

                  <p>
                    Order Received
                  </p>

                </div>


                {/* STEP 2 */}

                <div
                  className={`progress-step ${
                    currentStep >= 2
                      ? 'active'
                      : ''
                  }`}
                >

                  <span>2</span>

                  <p>
                    Preparing
                  </p>

                </div>


                {/* STEP 3 */}

                <div
                  className={`progress-step ${
                    currentStep >= 3
                      ? 'active'
                      : ''
                  }`}
                >

                  <span>3</span>

                  <p>
                    Ready
                  </p>

                </div>


                {/* STEP 4 */}

                <div
                  className={`progress-step ${
                    currentStep >= 4
                      ? 'active'
                      : ''
                  }`}
                >

                  <span>4</span>

                  <p>
                    Delivered
                  </p>

                </div>

              </div>


              {/* ORDER DETAILS */}

              <div className="tracked-order-details">

                <h4>
                  Order Details
                </h4>

                {order.items.map((item) => (

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


                <div className="tracked-order-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    ₦{Number(
                      order.total
                    ).toLocaleString()}
                  </strong>

                </div>

              </div>


              {/* DELIVERY INFORMATION */}

              <div className="tracked-delivery">

                <h4>
                  Delivery Information
                </h4>

                <p>
                  <strong>
                    Delivery Date:
                  </strong>{' '}
                  {order.delivery_date}
                </p>

                <p>
                  <strong>
                    Address:
                  </strong>{' '}
                  {order.address}
                </p>

              </div>

            </div>

          )}

        </div>

      </section>

    </div>
  )
}

export default TrackOrder