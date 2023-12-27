import { Request, Response } from "express"
import { RegisterDto, LoginDto, Payload } from "../models/users.model"
import { UserService } from "../services/users.service"
import jwt from 'jsonwebtoken'

const userService = new UserService()

export async function getToken(req: Request, res: Response) {
    try {
        const payload: Payload = res.locals.payload
        const user = await userService.findById(payload.id)
        const access = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: process.env.ACCESS_EXPIRED })
        const refresh = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: process.env.REFRESH_EXPIRED })
        res.status(200).json({
            user,
            access,
            refresh
        })
    } catch (e) {
        res.status(500).json({
            error: 'Internal Server Error'
        })
    }
}

export async function getVerify(req: Request, res: Response) {
    try {
        const payload: Payload = res.locals.payload
        const user = userService.findById(payload.id)
        if (user != null) {
            res.status(200).json({
                user
            })
        } else {
            res.status(404).json({
                message: "User not found"
            })
        }
    } catch (e) {
        res.status(500).json({
            error: 'Internal Server Error'
        })
    }
}

export async function registerUser(req: Request, res: Response) {
    try {
        const body: RegisterDto = req.body
        const userExsistByPhone = await userService.findByPhone(body.phone)
        if (userExsistByPhone) {
            res.status(409).json({
                message: body.phone + " bu raqamdan ro'yhatdan o'tishda foydalanilgan! Iltimos boshqa raqamdan foydalaning."
            })
        } else {
            const userExsistByEmail = await userService.findByEmail(body.email)
            if (userExsistByEmail) {
                res.status(409).json({
                    message: body.email + " bu emaildan ro'yhatdan o'tishda foydalanilgan! Iltimos boshqa emaildan foydalaning."
                })
            } else {
                const user_dto: RegisterDto = {
                    name: body.name,
                    phone: body.phone,
                    password: body.password,
                    role: body.role,
                    email: body.email,
                    carNumber: body.carNumber,
                    carType: body.carType
                }
                const user_created = await userService.create(user_dto)
                const payload: Payload = {
                    id: user_created.id,
                    phone: user_created.phone,
                    email: user_created.email,
                    role: user_created.role
                }
                const access = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: process.env.ACCESS_EXPIRED })
                const refresh = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: process.env.REFRESH_EXPIRED })
                res.status(200).json({
                    user: user_created,
                    access,
                    refresh
                })
            }

        }
    } catch (e) {
        res.status(500).json({
            error: 'Internal Server Error'
        })
    }
}

export async function loginUser(req: Request, res: Response) {
    try {
        const body: LoginDto = req.body
        const user_exsist = await userService.findByPhone(body.phone)
        if (!user_exsist) {
            res.status(404).json({
                message: "User not found by phone " + body.phone
            })
        } else {
            if (body.password === user_exsist.password) {
                const payload: Payload = {
                    id: user_exsist.id,
                    email: user_exsist.email,
                    phone: user_exsist.phone,
                    role: user_exsist.role
                }
                const access = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: process.env.ACCESS_EXPIRED })
                const refresh = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: process.env.REFRESH_EXPIRED })
                res.status(200).json({
                    user: user_exsist,
                    access,
                    refresh
                })
            } else {
                res.status(401).json({
                    message: "Telefon raqam yoki parol noto'g'ri! Iltimos qaytadan urinib ko'ring."
                })
            }
        }
    } catch (e) {
        res.status(500).json({
            error: 'Internal Server Error'
        })
    }
}

export async function getUsers(req: Request, res: Response) {
    try {
        const { current_page, per_page } = req.query
        if (current_page != undefined && per_page != undefined) {
            const users = await userService.findAll(+current_page, +per_page)
            let u: number = await userService.findAllCount()
            let p: number = u%+per_page == 0 ? u/+per_page : u/+per_page + 1
            res.status(200).json({ users, current_page, per_page, total_page_count: p, total_user_cout: u })
        }
    } catch (e) {
        res.status(500).json({
            error: 'Internal Server Error'
        })
    }
}