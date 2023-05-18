import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'

export async function checkToken(req: Request, res: Response, next: NextFunction) {
    const token = req.header('x-auth-key')

    if(!token) {
        return res.status(403).json({
            message: "Token not provided"
        })
    }

    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY!)
        res.locals.payload = payload    
        next()
    }
    catch(err: any) {
        console.log(err.message)

        return res.status(401).json({
            message: "Token invalid or expired"
        })        
    }
}