import jwt from 'jsonwebtoken'

export const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

    if(token) {
        try {

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.userId = decoded.id

            next()
            
        } catch (error) {
            return res.json({
                message: "Vous n'avez pas d'accès"
            })
        }
    } else {
        return res.json({
            message: "Vous n'avez pas d'accès"
        })
    }

}  