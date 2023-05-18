import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'

import locations from './routes/locations.routes'
import users from './routes/users.routes'
import posts from './routes/posts.routes'

const app = express()


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/reg', locations)
app.use('/users', users)
app.use('/posts', posts)

const port = +process.env.PORT! || 3000
app.listen(port, () => {
    console.log('Server is running port: ' + port);
})