import supabase from './supabase.js'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config({ path: './server/.env' })

const app = express()


app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    message: 'Gifting Store server is running!'
  })
})

app.get('/api/verify-payment/:reference', async (req, res) => {
  const { reference } = req.params

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: 'Unable to verify payment',
        error: data
      })
    }

    const transaction = data.data

    if (transaction.status !== 'success') {
      return res.json({
        success: false,
        message: 'Payment was not successful',
        transaction
      })
    }

    if (transaction.currency !== 'NGN') {
      return res.json({
        success: false,
        message: 'Invalid payment currency'
      })
    }

    return res.json({
      success: true,
      message: 'Payment verified successfully',
      transaction
    })

  } catch (error) {
    console.error('Verification error:', error)

    res.status(500).json({
      success: false,
      message: 'Server error while verifying payment'
    })
  }
})

// SAVE ORDER

app.post('/api/orders', async (req, res) => {
  const order = req.body

  try {
    // Save the main order
    const { data: savedOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        full_name: order.customer.fullName,
        phone: order.customer.phone,
        email: order.customer.email,
        address: order.customer.address,
        delivery_date: order.customer.deliveryDate,
        gift_message: order.customer.giftMessage,
        total: order.total,
        payment_reference: order.paymentReference,
        payment_status: 'success'
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order save error:', orderError)

      return res.status(500).json({
        success: false,
        message: 'Failed to save order'
      })
    }

    // Save the individual products
    const orderItems = order.products.map((item) => ({
      order_id: savedOrder.id,
      product_id: String(item.id),
      product_name: item.name,
      quantity: item.quantity,
      price: item.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order items save error:', itemsError)

      return res.status(500).json({
        success: false,
        message: 'Order was saved, but the products could not be saved'
      })
    }

    console.log('New order saved to Supabase:')
    console.log(savedOrder)

    res.status(201).json({
      success: true,
      message: 'Order saved successfully',
      order: savedOrder
    })

  } catch (error) {
    console.error('Unexpected order error:', error)

    res.status(500).json({
      success: false,
      message: 'Server error while saving order'
    })
  }
})


// TRACK ORDER

app.get('/api/orders/track', async (req, res) => {

  const { reference, email } = req.query

  if (!reference || !email) {
    return res.status(400).json({
      success: false,
      message: 'Order reference and email are required'
    })
  }

  try {

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('payment_reference', reference)
      .eq('email', email)
      .single()

    if (orderError || !order) {

      return res.status(404).json({
        success: false,
        message: 'Order not found. Check your reference and email.'
      })

    }

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id)

    if (itemsError) {

      console.error(
        'Track order items error:',
        itemsError
      )

      return res.status(500).json({
        success: false,
        message: 'Unable to retrieve order items'
      })

    }

    res.json({
      success: true,
      order: {
        ...order,
        items: items || []
      }
    })

  } catch (error) {

    console.error(
      'Track order error:',
      error
    )

    res.status(500).json({
      success: false,
      message: 'Server error while tracking order'
    })
  }

})
// START SERVER

const PORT = process.env.PORT || 5000

const { error } = await supabase
  .from('orders')
  .select('id')
  .limit(1)

if (error) {
  console.error('Supabase connection failed:', error)
} else {
  console.log('Supabase connection successful!')
}
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})