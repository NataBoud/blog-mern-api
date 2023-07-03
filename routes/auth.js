import { Router } from 'express'
import { register, login, getMe } from '../controller/auth.js'
import { checkAuth } from '../utils/checkAuth.js'

const router = new Router()

// Registration
// http://127.0.0.1:3002/api/auth/register
router.post('/register', register)

// Login
// http://127.0.0.1:3002/api/auth/login
router.post('/login', login)

// Get me
// http://127.0.0.1:3002/api/auth/me
router.get('/me', checkAuth, getMe)

export default router

