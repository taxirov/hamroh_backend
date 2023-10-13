import { Request, Response } from "express"
import { RegisterDto, LoginDto, DriverPayload, PassagerPayload, UserDto } from "../models/users.model"
import User from "../services/users.service"
import Car from "../services/cars.service"
import jwt from 'jsonwebtoken'

const user = new User()
const car = new Car()

export async function getVerify(req: Request, res: Response) {
    res.status(200).json({
        message: "All good",
        payload: res.locals.payload
    })
}

export async function registerUser(req: Request, res: Response) {
    const body: RegisterDto = req.body
    const user_exsist = await user.findByPhone(body.phone)
    if(user_exsist) {
        res.status(403).json({
            message: "User already exsist this number " + body.phone
        })
    }else{
        const user_dto: UserDto = {
            name: body.name,
            phone: body.phone,
            password: body.password,
            role: body.role
        }

        const user_created = await  user.create(user_dto)

        if(body.role == 'driver' && body.car_number != null && body.car_model != null) {

            const car_created = await car.create(user_created.id, body.car_number, body.car_model)

            const payload: DriverPayload = {
                id: user_created.id,
                name: user_created.name,
                phone: user_created.phone,
                role: user_created.role,
                car_id: car_created.id,
                car_number: car_created.carNumber,
                car_model: car_created.carType
            }
            
            const token = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: "7d"})

            res.status(200).json({
                message: "Register success",
                payload,
                token
            })
        }else{

            const payload: PassagerPayload = {
                id: user_created.id,
                name: user_created.name,
                phone: user_created.phone,
                role: user_created.role
            }

            const token = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: "7d"})

            res.status(200).json({
                message: "Register success",
                payload,
                token
            })
        }
    }
}

export async function loginUser(req: Request, res: Response) {
    const body: LoginDto = req.body
    const user_exsist = await user.findByPhone(body.phone)
    if(!user_exsist) {
        res.status(404).json({
            message: "User not found by phone " + body.phone
        })
    }else{
        if(body.password === user_exsist.password){
                const user_car = await car.findByUserId(user_exsist.id)
                if(user_car == null) {
                    const payload: PassagerPayload = {
                        id: user_exsist.id,
                        name: user_exsist.name,
                        phone: user_exsist.phone,
                        role: user_exsist.role
                    }
                    const token = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: "7d"})
                    res.status(200).json({
                        message: "Login success",
                        payload,
                        token
                    })
                }else{
                    const payload: DriverPayload = {
                        id: user_exsist.id,
                        name: user_exsist.name,
                        phone: user_exsist.phone,
                        role: user_exsist.role,
                        car_id: user_car.id,
                        car_number: user_car.carNumber,
                        car_model: user_car.carType
                    }
                    const token = jwt.sign(payload, process.env.SECRET_KEY!, { expiresIn: "7d"})
                    res.status(200).json({
                        message: "Login success",
                        payload,
                        token
                    })
            }

        }else{
            res.status(401).json({
                message: "Phone or password wrong"
            })
        }
    }
}

export async function getUsers(req: Request, res: Response) {
    const users = await user.findAll()
    res.status(200).json({
        message: "All users",
        users
    })
}