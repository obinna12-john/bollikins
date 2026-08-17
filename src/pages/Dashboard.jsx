import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../supabaseClient'

function Dashboard() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadOrders = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {
        navigate('/login')
        return
      }

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (ordersError) {
        console.error('Error loading orders:', ordersError)
        setError('Unable to load orders.')
        setLoading(false)
        return
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')

      if (itemsError) {
        console.error('Error loading order items:', itemsError)
        setError('Unable to load order items.')
        setLoading(false)
        return
      }

      const ordersWithItems = ordersData.map((order) => ({
        ...order,
        items: itemsData.filter(
          (item) => item.order_id === order.id
        )
      }))

      setOrders(ordersWithItems)
      setLoading(false)
    }

    loadOrders()
  }, [navigate])

  const updateOrderStatus = async (orderId, newStatus) => {
  const { data, error } = await supabase
    .from('orders')
    .update({
      status: newStatus
    })
    .eq('id', orderId)
    .select()

  console.log('STATUS UPDATE RESULT:', {
    data,
    error
  })

  if (error) {
    console.error('Status update error:', error)

    alert(
      `Could not update status: ${error.message}`
    )

    return
  }

  if (!data || data.length === 0) {
    alert(
      'The update did not change anything. Check your Supabase RLS policies.'
    )

    return
  }

  setOrders((currentOrders) =>
    currentOrders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            status: newStatus
          }
        : order
    )
  )

  alert(
    `Order status changed to ${newStatus}.`
  )
}
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="dashboard">

      <header className="dashboard-header">

        <div>
            <img
      src="/images/logo.png"
      alt="Boxed by Bollikins"
      className="nav-logo-image"
    />
          <p>BOXED BY BOLLIKINS</p>
          <h1>Orders Dashboard</h1>
        </div>

        <button onClick={handleLogout}>
          Logout
        </button>

      </header>

      <main className="dashboard-content">

        <div className="dashboard-summary">

          <div className="dashboard-card">
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>

          <div className="dashboard-card">
            <span>Successful Payments</span>
            <strong>
              {
                orders.filter(
                  (order) => order.payment_status === 'success'
                ).length
              }
            </strong>
          </div>

        </div>

        <section className="orders-section">

          <h2>Recent Orders</h2>

          {loading && (
            <p>Loading orders...</p>
          )}

          {error && (
            <p>{error}</p>
          )}

          {!loading && !error && orders.length === 0 && (
            <p>No orders yet.</p>
          )}

          {!loading && !error && orders.length > 0 && (

            <div className="orders-list">

              {orders.map((order) => (

                <div
                  className="order-card"
                  key={order.id}
                >

                  <div className="order-header">

                    <div>
                      <h3>
                        Order #{order.id}
                      </h3>

                      <p>
                        {new Date(
                          order.created_at
                        ).toLocaleString()}
                      </p>
                    </div>

                    <strong>
                      ₦{Number(
                        order.total
                      ).toLocaleString()}
                    </strong>

                  </div>


                  {/* ORDER STATUS */}

                  <div className="order-status">

                    <div>
                      <h4>Order Status</h4>

                      <span
                        className={`status-badge status-${order.status || 'new'}`}
                      >
                        {(order.status || 'new')
                          .charAt(0)
                          .toUpperCase() +
                          (order.status || 'new').slice(1)}
                      </span>
                    </div>

                    <select
                      value={order.status || 'new'}
                      onChange={(e) =>
                        updateOrderStatus(
                          order.id,
                          e.target.value
                        )
                      }
                    >
                      <option value="new">
                        New
                      </option>

                      <option value="preparing">
                        Preparing
                      </option>

                      <option value="ready">
                        Ready
                      </option>

                      <option value="delivered">
                        Delivered
                      </option>
                    </select>

                  </div>


                  <div className="order-customer">

                    <h4>Customer</h4>

                    <p>
                      <strong>Name:</strong>{' '}
                      {order.full_name}
                    </p>

                    <p>
                      <strong>Phone:</strong>{' '}
                      {order.phone}
                    </p>

                    <p>
                      <strong>Email:</strong>{' '}
                      {order.email}
                    </p>

                  </div>


                  <div className="order-delivery">

                    <h4>Delivery</h4>

                    <p>
                      <strong>Address:</strong>{' '}
                      {order.address}
                    </p>

                    <p>
                      <strong>Date:</strong>{' '}
                      {order.delivery_date}
                    </p>

                  </div>


                  <div className="order-products">

                    <h4>Products</h4>

                    {order.items.length === 0 ? (

                      <p>No products recorded.</p>

                    ) : (

                      order.items.map((item) => (

                        <div
                          className="order-product"
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

                      ))

                    )}

                  </div>


                  {order.gift_message && (

                    <div className="order-message">

                      <h4>Gift Message</h4>

                      <p>
                        {order.gift_message}
                      </p>

                    </div>

                  )}


                  <div className="order-payment">

                    <p>
                      <strong>Payment:</strong>{' '}
                      {order.payment_status}
                    </p>

                    <p>
                      <strong>Reference:</strong>{' '}
                      {order.payment_reference}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  )
}

export default Dashboard