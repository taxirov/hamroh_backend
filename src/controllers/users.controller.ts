import dotenv from 'dotenv'
dotenv.config()

import { Request, Response } from "express"
import { RegisterDto, LoginDto, Payload } from "../models/users.model"
import { UserService } from "../services/users.service"
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

const userService = new UserService()

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD,
    },
});

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
            message: 'Internal Server Error'
        })
    }
}

export async function getVerify(req: Request, res: Response) {
    try {
        const payload: Payload = res.locals.payload
        const user = await userService.findById(payload.id)
        if (user) {
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
            message: 'Internal Server Error'
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
            message: 'Internal Server Error'
        })
    }
}

export async function loginUser(req: Request, res: Response) {
    try {
        const body: LoginDto = req.body
        const user_exsist = await userService.findByEmailPass(body.email)
        if (!user_exsist) {
            res.status(404).json({
                message: "User not found by phone " + body.email
            })
        } else {
            if (body.password === user_exsist.password) {
                const user = (await userService.findById(user_exsist.id))!
                const payload: Payload = {
                    id: user.id,
                    role: user.role
                }
                const access = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: process.env.ACCESS_EXPIRED })
                const refresh = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: process.env.REFRESH_EXPIRED })
                res.status(200).json({
                    user,
                    access,
                    refresh
                })
            } else {
                res.status(401).json({
                    message: "Parol noto'g'ri! Iltimos qaytadan urinib ko'ring."
                })
            }
        }
    } catch (e) {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

export async function getUsers(req: Request, res: Response) {
    try {
        const { current_page, per_page } = req.query
        if (current_page != undefined && per_page != undefined) {
            const users = await userService.findAll(+current_page, +per_page)
            let u: number = await userService.findAllCount()
            let p: number = u % +per_page == 0 ? Math.floor(u / +per_page) : Math.floor(u / +per_page) + 1
            res.status(200).json({ users, current_page, per_page, total_page_count: p, total_user_cout: u })
        }
    } catch (e) {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

export async function patchUserStatus(req: Request, res: Response) {
    try {
        const { role } = req.body
        const { id } = req.params
        const user_exsist = await userService.findById(+id)
        if (user_exsist) {
            const user_updated = await userService.updateRole(+id, role)
            res.status(200).json({
                user: user_updated
            })
        } else {
            res.status(404).json({
                message: "User not found"
            })
        }
    } catch (e) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export async function resetUserPassword(req: Request, res: Response) {
    try {
        const { oldPassword, newPassword } = req.body;
        const payload = res.locals.payload
        const user_exsist = await userService.findByIdPass(payload.id);
        if (!user_exsist) {
            return res.status(404).json({
                message: "User not found"
            });
        } else {
            if (oldPassword == user_exsist.password) {
                const user = await userService.updatePassword(user_exsist.id, newPassword)
                res.status(200).json({ message: "Password success updated", user })
            } else {
                res.status(401).json({ message: "Joriy parol noto'g'ri" })
            }
        }
    } catch (e) {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

export async function forgetUserPassword(req: Request, res: Response) {
    try {
        const { email } = req.body;
        const user_pass = await userService.findByEmailPass(email)
        if (!user_pass) {
            res.status(404).json({
                message: "User not found by email " + email
            });
        } else {
            const user = (await userService.findByEmail(email))!
            transporter.sendMail({
                from: "hamrohtaxi@gmail.com",
                to: email,
                subject: "Parolni tiklash",
                text: user.profile?.userName + " sizning parolingiz: " + user_pass.password
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}
export async function put(req: Request, res: Response) {
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
        res.status(500).json({ message: "Internal server error" })
    }
}