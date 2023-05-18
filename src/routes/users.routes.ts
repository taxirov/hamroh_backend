import { Router } from "express"
import { getUsers, registerUser, loginUser, getVerify } from "../controllers/users.controller"
import { createValidator } from 'express-joi-validation'
import Joi from 'joi'
import { checkToken } from "../middlewares/users.middleware"

const router = Router()

const validator = createValidator()

const schemaRegister = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
    car_number: Joi.string().allow(null),
    car_model: Joi.string().allow(null)
})

const schemaLogin = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required()
})


router.get('/', getUsers)
router.post('/register', validator.body(schemaRegister), registerUser)
router.post('/login', validator.body(schemaLogin), loginUser)
router.get('/verify', checkToken, getVerify)

export default router