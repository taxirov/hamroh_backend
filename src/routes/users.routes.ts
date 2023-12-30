import { Router } from 'express'
import { getUsers, registerUser, loginUser, getVerify, getToken, patchUserStatus, resetUserPassword, forgetUserPassword } from "../controllers/users.controller"
import { createValidator } from 'express-joi-validation'
import  Joi from 'joi'
import { checkToken, checkAdmin, checkAdminKey } from "../middlewares/users.middleware"

const router = Router()

const validator = createValidator()

const schemaRegister = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('driver', 'passenger').required(),
    carNumber: Joi.string().allow(null),
    carType: Joi.string().valid('Damas','Largus','Tico','Matiz','Nexia_1','Nexia_2','Nexia_3','Lacetti','Captiva','Epica','Tacuma','Spark','Cobalt','Orlondo','Gentra','Boshqa').allow(null)
})

const schemaLogin = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required()
})

const schemaGet = Joi.object({
    current_page: Joi.number().required(),
    per_page: Joi.number().required()
})


router.get('/', checkToken, checkAdmin, validator.query(schemaGet), getUsers)
router.post('/register', validator.body(schemaRegister), registerUser)
router.post('/login', validator.body(schemaLogin), loginUser)
router.post('/reset', checkToken, resetUserPassword)
router.post('/forget', forgetUserPassword)
router.get('/verify', checkToken, getVerify)
router.get('/refresh', checkToken, getToken)
router.patch('/:id/role', checkToken, checkAdminKey, patchUserStatus)

export default router