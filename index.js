const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config({
  path:process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
})
const allowedOrigins = [process.env.CLIENT_URL_1,process.env.CLIENT_URL_2]


const userRoutes = require('./routes/userRoutes')
const uploadRoutes = require('./routes/uploadroutes')
const paymentRoutes = require('./routes/paymentRoutes')
const cartRoutes = require('./routes/cartRoutes')
const productRoutes = require('./routes/productRoutes')
const paymentController = require('./controllers/paymentController')
const adminRoutes = require('./routes/adminRoutes')
const orderRoutes = require('./routes/orderRoutes')

app.use((req, res, next) => {
  console.log(` Incoming request: ${req.method} ${req.url}`);
  next();
});


app.post(
  '/payment/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.confirmPayment
)



app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: [allowedOrigins, 'http://localhost:5173'],
  credentials: true,
}))



app.use('/user', userRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/payment', paymentRoutes)
app.use('/cart', cartRoutes)
app.use('/products', productRoutes)
app.use('/order',orderRoutes)
app.use('/admin',adminRoutes)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Database Connected'))
  .catch((err) => console.log(err))

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
