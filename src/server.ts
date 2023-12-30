import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'

import usersRoutes from './routes/users.routes'
import postsRoutes from './routes/posts.routes'
import path from 'path'
import fs from 'fs'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Read the 'countries.json' file
const countriesFilePath = path.join(__dirname, 'json', 'countries.json');
app.get('/api/countries', (req, res) => {
    fs.readFile(countriesFilePath, 'utf8', (err: any, data: string) => {
        if (err) {
            console.error('Error reading countries.json:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            const countries = JSON.parse(data);
            res.json(countries);
        }
    });
});
app.use('/api/user', usersRoutes)
app.use('/api/post', postsRoutes)
// app.use('/api/car', carsRoutes)

const port = +process.env.PORT! || 3000

app.listen(port, () => {
    console.log('Server is running port: ' + port);
})