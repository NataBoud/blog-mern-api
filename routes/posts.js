import { Router } from 'express'
import { checkAuth } from '../utils/checkAuth.js'
import { 
    createPost, 
    getAll, 
    getById, 
    getMyPosts, 
    removePost,
    updatePost,
    getPostComments 
} from '../controller/posts.js'

const router = new Router()

// Create Post
// http://127.0.0.1:3002/api/posts
router.post('/', checkAuth, createPost)

// Get all Posts
// http://127.0.0.1:3002/api/posts
router.get('/', getAll)

// Get Post by Id
// http://127.0.0.1:3002/api/posts/:id
router.get('/:id', getById)

// Get My Posts 
// http://127.0.0.1:3002/api/posts/user/me
router.get('/user/me', checkAuth, getMyPosts)

// Remove Post
// http://127.0.0.1:3002/api/posts/:id
router.delete('/:id',checkAuth, removePost)

// Update Post
// http://127.0.0.1:3002/api/posts/:id
router.put('/:id',checkAuth, updatePost)

// Get Post Comments
// http://127.0.0.1:3002/api/posts/comments/:id
router.get('/comments/:id', getPostComments)

export default router

