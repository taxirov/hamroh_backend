import { Router }  from "express"
import { PostController } from "../controllers/posts.controller"
import { createValidator } from 'express-joi-validation'
import Joi from 'joi'
import { checkToken } from "../middlewares/users.middleware"

const router = Router()
const validator = createValidator()
const postController = new PostController()

const schemaBody = Joi.object({
    fromLocation: Joi.string().required(),
    toLocation: Joi.string().required(),
    goTime: Joi.string().required(),
    count: Joi.number().required(),
    addition: Joi.string().allow(null)
})

const schemaStatusBody = Joi.object({
    status: Joi.number().required()
})

const schemaGetQuery = Joi.object({
    current_page: Joi.number().required(),
    per_page: Joi.number().required(),
    fromLocation: Joi.string().allow(null),
    toLocation: Joi.string().allow(null)
})

router.post('/', checkToken, validator.body(schemaBody), postController.post)
router.put('/:id', checkToken, validator.body(schemaBody), postController.put)
router.get('/', validator.query(schemaGetQuery), postController.get)
router.get('/profile/:id', checkToken, postController.getByUser)
router.delete('/:id', checkToken, postController.delete)
// router.patch('/:id', checkToken, validator.body(schemaUpdateStatusBody, postController.patchStatus))

export default router