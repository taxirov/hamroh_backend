import { Router }  from "express"
import { postPost, getPosts, getUserPosts } from "../controllers/posts.controller"
import { createValidator } from 'express-joi-validation'
import Joi from 'joi'
import { checkToken } from "../middlewares/users.middleware"

const router = Router()

const validator = createValidator()

const schemaBody = Joi.object({
    author_id: Joi.number().required(),
    from_loc: Joi.string().required(),
    to_loc: Joi.string().required(),
    go_time: Joi.string().required(),
    count: Joi.number().required(),
    addition: Joi.string().allow('')
})

const schemaQuery = Joi.object({
    from_loc: Joi.string().allow('', null),
    to_loc: Joi.string().allow('', null),
    search: Joi.string().allow('', null)
})

router.post('/', validator.body(schemaBody), postPost)
router.get('/', validator.query(schemaQuery), getPosts)
router.get('/user', checkToken, getUserPosts)

export default router