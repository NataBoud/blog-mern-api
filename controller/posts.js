import Post from '../models/Post.js'
import User from '../models/User.js'
import Comment from '../models/Comment.js'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

// Create Post
export const createPost = async(req, res) => {
    try {
        const { title, text } = req.body
        const user = await User.findById(req.userId)

        // post avec une image
        if(req.files) {
            let fileName = Date.now().toString() + req.files.image.name
            const __dirname = dirname(fileURLToPath(import.meta.url)) // сформировали имя для картинки и
            req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName)) //  поместили ее в папку uploads

            // maintenant on crée un post
            const newPostWithImage = new Post({
                username: user.username,
                title,
                text,
                imgUrl: fileName,
                author: req.userId,
            })

            // si tout est ok on appelle methode .save()
            await newPostWithImage.save() // создали пост и сохранили его в базе данных
            // теперь нужно запушить этот пост для user
            // потом мы нашли юзера кот этот пост принадлежит
            await User.findByIdAndUpdate(req.userId, {
                $push: { posts: newPostWithImage},
            })

            return res.json(newPostWithImage)

        }

        // post sans image

        const newPostWithoutImage = new Post({
            username: user.username,
            title,
            text,
            imgUrl: '',
            author: req.userId,
        })
        await newPostWithoutImage.save()
        await User.findByIdAndUpdate(req.userId, {
            $push: { posts: newPostWithoutImage},
        })

        return res.json(newPostWithoutImage)
         
    } catch (error) {
        res.json({message: "1 Quelque chose n'a pas marché: " + error })      
    }
}

// Get All Posts
export const getAll= async (req, res) => {
    try {
        // таким образом мы находим все посты и сортируем по дате создания
        const posts = await Post.find().sort('-createdAt')
        const popularPosts = await Post.find().limit(5).sort('-views')

        // теперь если нет постов:
        if(!posts) {
            return res.json({message: "Vous n'avez pas de posts."})
        }
        // если есть:
        res.json({posts, popularPosts})
        
    } catch (error) {
        res.json({message: "2 Quelque chose n'a pas marché: " + error })      
    }
}

// Get Post by Id

// нужно не просто получить пост но и увеличить кол-во просмотров
        // инкримент $inc: { views: 1} 
        // ищем этот пост по (req.params.id)

export const getById = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id,{
            $inc: {views: 1},
        })    
        res.json(post)        
    } catch (error) {
        res.json({message: "3 Quelque chose n'a pas marché: " + error })      
    }
}

// Get My Posts 

// Есть user у кот есть массив постов (для кажд поста (отдельная сущьность) есть отдельная модель). По всех постам проходимся с помощью функции map() и получаем всю инфу о каждом из постов. 
// Как кажд итерация пройдет Promise. all завершаться
 // в переменной list будет массив всех постов кот мы искали 

 export const getMyPosts = async (req, res) => {

   
    try {
        const user = await User.findById(req.userId)
        
        const list = await Promise.all(

            
            
            user.posts.map((post) => {
                return Post.findById(post._id)
            })
        )  
        res.json(list)
    } catch (error) {
        res.json({ message: " 111 Quelque chose n'a pas marché: " + error })
    }
}



// Remove Post

// удаляем посты по id
// теперь PostSlice нужно создать функцию кот будет удалять пост

 export const removePost = async (req, res) => {
    try {

        const post = await Post.findByIdAndDelete(req.params.id)
        if(!post) return res.json({message: "Ce post n'existe pas."})

        await User.findByIdAndUpdate(req.userId, {
            $pull: { posts: req.params.id }
        }) 
      
        res.json({message: "Le post a été supprimé."})        
    } catch (error) {
        res.json({message: "5 Quelque chose n'a pas marché: " + error })      
    }
}


// Update Post // знак || или 
export const updatePost = async (req, res) => {
    try {
        const { title, text, id} = req.body
        const post = await Post.findById(id)

        if(req.files) {
            let fileName = Date.now().toString() + req.files.image.name
            const __dirname = dirname(fileURLToPath(import.meta.url)) 
            req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName))
            post.imgUrl = fileName || ''
        }

        post.title = title
        post.text = text

        await post.save()
             
        res.json(post)        
    } catch (error) {
        res.json({message: "5 Quelque chose n'a pas marché: " + error })      
    }
}
// res.json(post) - возвращаем обновленный пост

// Get Post Comments

export const getPostComments = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const list = await Promise.all(
            
            post.comments.map((comment) => {
                return Comment.findById(comment)
            })
        )
        res.json(list)
    } catch (error) {
        res.json({message: "6 Quelque chose n'a pas marché: " + error })      
    }
}




