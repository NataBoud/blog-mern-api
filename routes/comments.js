import { Router } from 'express'
const router = new Router()
import { checkAuth } from '../utils/checkAuth.js'
import { createComment } from '../controller/comments.js'


// Create Comment
// http://127.0.0.1:3002/api/comments/:id
router.post('/:id', checkAuth, createComment)

export default router