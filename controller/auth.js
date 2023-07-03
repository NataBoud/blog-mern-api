import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Register user
// Если при регистрации мы хотим сразу залогиниться нам нужен токен
export const register = async(req, res) => {
    
    try {
        const{username, password} = req.body

        const isUsed = await User.findOne({username})

        if (isUsed) {
            return res.json({
                message: "Ce nom d'utilisateur est déjà pris."
            })
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const newUser = new User({
            username,
            password: hash,
        })

        const token = jwt.sign(

            { id: newUser._id, }, 
            process.env.JWT_SECRET,
            
            { expiresIn: '30d' }
        )

        await newUser.save()

        res.json({
            token,
            newUser,
            message: "L'enregistrement a réussi."
        })

    } catch (error) {
        res.json({message: "Erreur lors de la création de l'utilisateur."})
    }
}

//Login user
export const login = async(req, res) => {
    try {
        const{username, password} = req.body
        const user = await User.findOne({ username })

        if(!user) {
            return res.json({
                message: "L'utilisateur n'existe pas."
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect) {
            return res.json({
                message: 'Mot de passe incorrect. Essayez à nouveau.'
            })
        }

        const token = jwt.sign(

            { id: user._id }, 
            process.env.JWT_SECRET,

            { expiresIn: '30d' }
        )

        res.json({
            token,
            user,
            message: 'Vous êtes connecté(e).'
        })



    } catch (error) {
        res.json({message: "Erreur d'identification."})
    }
}

//Get me
export const getMe = async(req, res) => {
    try {

        const user = await User.findById(req.userId)

        if(!user) {
            return res.json({
                message: "L'utilisateur n'existe pas"
            })
        }

        const token = jwt.sign({
            id: user._id,
        }, 
            process.env.JWT_SECRET,
        {
            expiresIn: '30d'
        })

        res.json({
            user,
            token
        })
      
    } catch (error) {
        res.json({
            message: "Vous n'avez pas d'accès"
        })
    }
}