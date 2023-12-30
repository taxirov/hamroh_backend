import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import { Payload } from "../models/users.model"

export async function checkToken(req: Request, res: Response, next: NextFunction) {
    try {
        const bearer = req.header('authorization')
        if (!bearer) {
            return res.status(403).json({
                message: "Token not provided"
            })
        } else {
            const token = bearer.split(' ')[1]
            const payload = jwt.verify(token, process.env.SECRET_KEY!)
            res.locals.payload = payload
            next()
        }
    }
    catch (err: any) {
        res.status(401).json({
            message: "Token invalid or expired"
        })
    }
}

export async function checkAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        const payload: Payload = res.locals.payload
        if (payload.role == 'admin') {
            next()
        } else {
            res.status(401).json({
                message: "Your not admin"
            })
        }
    }
    catch (err: any) {
        res.status(500).json({
            error: 'Internal Server Error'
        })
    }
}

export async function checkAdminKey(req: Request, res: Response, next: NextFunction) {
    try {
        const admin_key = req.header('Admin-Key')
        if (admin_key == undefined) {
            res.status(403).json({
                message: "Admin key not provided"
            })
        } else {
            if (admin_key == process.env.ADMIN_KEY) {
                next()
            } else {
                res.status(401).json({
                    message: "Invalid admin key"
                })
            }
        }
    }
    catch (err: any) {
        res.status(500).json({
            error: 'Internal Server Error'
        })
    }
}
