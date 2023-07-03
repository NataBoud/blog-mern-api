import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import fileUpload from 'express-fileupload' 
//чтобы загружать файлы (images) на сервер нужен доп. plugin - npm i express-fileupload (middleware)


import authRoute from './routes/auth.js'
import postRoute from './routes/posts.js'
import commentRoute from './routes/comments.js'

// import commentRoute from './routes/comments.js'

const app = express()
dotenv.config()
require("dotenv").config()

// Constants
const PORT = process.env.PORT || 3001
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

// Middleware // Промежуточный
app.use(cors())
app.use(fileUpload()) // также express нужно дать понять где будут храниться статическ файлы, как правильго ему прописывать все пути:
app.use(express.json())
app.use(express.static('uploads')) // загружаем в заранее созданную папку uploads 

// Routes
// http://127.0.0.1:3002/
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/comments', commentRoute)

// app.use('/api/comments', commentRoute)



async function start() {
    try {
        await mongoose.connect(
            `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.vwow4lm.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
        )

        app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))

    }catch(error) {
        console.log(error);
    }

}
start()


