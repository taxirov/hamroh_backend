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
    email: Joi.string().required(),
    password: Joi.string().required()
})

const schemaGet = Joi.object({
    current_page: Joi.number().required(),
    per_page: Joi.number().required()
})


router.get('/', checkToken, checkAdmin, validator.query(schemaGet), getUsers) // to do
router.post('/register', validator.body(schemaRegister), registerUser) // done
router.post('/login', validator.body(schemaLogin), loginUser) //done
router.post('/reset', checkToken, resetUserPassword) // to do
router.post('/forget', forgetUserPassword) // to do
router.get('/verify', checkToken, getVerify) // done
router.get('/refresh', checkToken, getToken) // to do
router.patch('/:id/role', checkToken, checkAdminKey, patchUserStatus) // to do

export default router