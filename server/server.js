import supabase from './supabase.js'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config({ path: './server/.env' })

const app = express()

app.use(cors())
app.use(express.json())

// ========================================
// BASIC SERVER CHECK
// ========================================

app.get('/', (req, res) => {
  res.json({
    message: 'Gifting Store server is running!'
  })
})

// ========================================
// VERIFY PAYSTACK PAYMENT
// ========================================

app.get('/api/verify-payment/:reference', async (req, res) => {
  const { reference } = req.params

  console.log('========================================')
  console.log('PAYMENT VERIFICATION STARTED')
  console.log('Reference:', reference)
  console.log('========================================')

  try {
    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.error('❌ PAYSTACK_SECRET_KEY is missing')

      return res.status(500).json({
        success: false,
        message: 'Paystack secret key is not configured'
      })
    }

    console.log('Checking transaction with Paystack...')

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

    console.log('Paystack response status:', response.status)
    console.log('Paystack response:', data)

    if (!response.ok) {
      console.error('❌ Paystack verification failed')

      return res.status(response.status).json({
        success: false,
        message: 'Unable to verify payment',
        error: data
      })
    }

    const transaction = data.data

    // Check payment status
    if (transaction.status !== 'success') {
      console.error(
        '❌ Payment was not successful:',
        transaction.status
      )

      return res.json({
        success: false,
        message: 'Payment was not successful',
        transaction
      })
    }

    // Check currency
    if (transaction.currency !== 'NGN') {
      console.error(
        '❌ Invalid currency:',
        transaction.currency
      )

      return res.json({
        success: false,
        message: 'Invalid payment currency'
      })
    }

    console.log('✅ PAYMENT VERIFIED SUCCESSFULLY')
    console.log('Reference:', transaction.reference)
    console.log('Amount:', transaction.amount / 100)
    console.log('Currency:', transaction.currency)
    console.log('Status:', transaction.status)

    return res.json({
      success: true,
      message: 'Payment verified successfully',
      transaction
    })

  } catch (error) {
    console.error('❌ VERIFICATION ERROR:')
    console.error(error)

    return res.status(500).json({
      success: false,
      message: 'Server error while verifying payment'
    })
  }
})

// ========================================
// SAVE ORDER
// ========================================

app.post('/api/orders', async (req, res) => {
  console.log('========================================')
  console.log('NEW ORDER REQUEST')
  console.log('========================================')

  const order = req.body

  console.log('Order received:')
  console.log(JSON.stringify(order, null, 2))

  try {
    // Validate order data
    if (!order.customer) {
      console.error('❌ Customer information missing')

      return res.status(400).json({
        success: false,
        message: 'Customer information is required'
      })
    }

    if (!order.products || !Array.isArray(order.products)) {
      console.error('❌ Products missing or invalid')

      return res.status(400).json({
        success: false,
        message: 'Order products are required'
      })
    }

    if (!order.paymentReference) {
      console.error('❌ Payment reference missing')

      return res.status(400).json({
        success: false,
        message: 'Payment reference is required'
      })
    }

    // ========================================
    // CHECK IF ORDER ALREADY EXISTS
    // ========================================

    console.log(
      'Checking for existing order:',
      order.paymentReference
    )

    const { data: existingOrder, error: existingOrderError } =
      await supabase
        .from('orders')
        .select('id')
        .eq('payment_reference', order.paymentReference)
        .maybeSingle()

    if (existingOrderError) {
      console.error(
        '❌ Error checking existing order:',
        existingOrderError
      )

      return res.status(500).json({
        success: false,
        message: 'Could not check existing order'
      })
    }

    if (existingOrder) {
      console.log(
        '⚠️ Order already exists:',
        existingOrder.id
      )

      return res.json({
        success: true,
        message: 'Order already exists',
        order: existingOrder
      })
    }

    // ========================================
    // SAVE MAIN ORDER
    // ========================================

    console.log('Saving order to Supabase...')

    const { data: savedOrder, error: orderError } =
      await supabase
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
      console.error('❌ ORDER SAVE ERROR:')
      console.error(orderError)

      return res.status(500).json({
        success: false,
        message: 'Failed to save order',
        error: orderError.message
      })
    }

    console.log('✅ Main order saved!')
    console.log('Order ID:', savedOrder.id)

    // ========================================
    // SAVE ORDER ITEMS
    // ========================================

    const orderItems = order.products.map((item) => ({
      order_id: savedOrder.id,
      product_id: String(item.id),
      product_name: item.name,
      quantity: item.quantity,
      price: item.price
    }))

    console.log('Saving order items:')
    console.log(JSON.stringify(orderItems, null, 2))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('❌ ORDER ITEMS SAVE ERROR:')
      console.error(itemsError)

      return res.status(500).json({
        success: false,
        message:
          'Order was saved, but the products could not be saved',
        error: itemsError.message
      })
    }

    console.log('✅ Order items saved successfully!')
    console.log('========================================')
    console.log('🎉 COMPLETE ORDER SAVED')
    console.log('Order ID:', savedOrder.id)
    console.log(
      'Payment Reference:',
      savedOrder.payment_reference
    )
    console.log('========================================')

    return res.status(201).json({
      success: true,
      message: 'Order saved successfully',
      order: savedOrder
    })

  } catch (error) {
    console.error('❌ UNEXPECTED ORDER ERROR:')
    console.error(error)

    return res.status(500).json({
      success: false,
      message: 'Server error while saving order',
      error: error.message
    })
  }
})

// ========================================
// TRACK ORDER
// ========================================

app.get('/api/orders/track', async (req, res) => {
  const { reference, email } = req.query

  console.log('========================================')
  console.log('ORDER TRACKING REQUEST')
  console.log('Reference:', reference)
  console.log('Email:', email)
  console.log('========================================')

  if (!reference || !email) {
    return res.status(400).json({
      success: false,
      message: 'Order reference and email are required'
    })
  }

  try {
    const { data: order, error: orderError } =
      await supabase
        .from('orders')
        .select('*')
        .eq('payment_reference', reference)
        .eq('email', email)
        .single()

    if (orderError || !order) {
      console.error('❌ Order not found')

      return res.status(404).json({
        success: false,
        message:
          'Order not found. Check your reference and email.'
      })
    }

    console.log('✅ Order found:', order.id)

    const { data: items, error: itemsError } =
      await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id)

    if (itemsError) {
      console.error(
        '❌ Track order items error:',
        itemsError
      )

      return res.status(500).json({
        success: false,
        message: 'Unable to retrieve order items'
      })
    }

    console.log('✅ Order items retrieved')

    return res.json({
      success: true,
      order: {
        ...order,
        items: items || []
      }
    })

  } catch (error) {
    console.error('❌ TRACK ORDER ERROR:')
    console.error(error)

    return res.status(500).json({
      success: false,
      message: 'Server error while tracking order'
    })
  }
})

// ========================================
// SUPABASE CONNECTION CHECK
// ========================================

const PORT = process.env.PORT || 5000

const { error: supabaseError } = await supabase
  .from('orders')
  .select('id')
  .limit(1)

if (supabaseError) {
  console.error('❌ Supabase connection failed:')
  console.error(supabaseError)
} else {
  console.log('✅ Supabase connection successful!')
}

// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})