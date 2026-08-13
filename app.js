// const dns = require('dns')
// dns.setServers(['8.8.8.8', '8.8.4.4'])

require('dotenv').config()
require('express-async-errors')
// rest of your code...


const connectDB=require('./db/connect')
const rateLimit = require('express-rate-limit')
const express=require('express')
const notFound = require('./middleware/not-found')     // ← middleware
const errorHandler = require('./middleware/errorhandler')
const calorieRouter = require('./routes/calories')
const recipeRouter = require('./routes/recipe')

const cors=require('cors')

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { msg: 'Too many attempts, please try again after 15 minutes' },
})
const app=express()
const authRouter=require('./routes/auth')
const userRouter=require('./routes/user')
const habitRouter=require('./routes/habits')
const auth=require('./middleware/authentication')

app.use(express.json())
app.use(cors())
app.use('/api/v1/auth', authLimiter, authRouter)
app.use('/api/v1/food-log', auth, calorieRouter) // ← error handler
app.use('/api/v1/habits',auth,habitRouter)
app.use('/api/v1/saved-recipes', auth, recipeRouter)

// app.js
app.use('/api/v1/user', auth, userRouter)
app.use(notFound)
app.use(errorHandler)


const port = process.env.PORT || 3000


const start= async ()=> {
    try {
        await connectDB(process.env.MONGO_URI)
       app.listen(port, '0.0.0.0', () => console.log(`server is listing on ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start()
