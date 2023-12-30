import { Request, Response } from "express";
import { PostService } from "../services/posts.service";
import { UserService } from "../services/users.service";
import { PostDto, } from "../models/posts.model";
import { Payload } from "../models/users.model";

const postService = new PostService()
const userService = new UserService()

export class PostController {
    async post(req: Request, res: Response) {
        try {
            const body: PostDto = req.body
            const payload = res.locals.payload as Payload
            console.log(payload)
            const profile = await userService.findProfileById(payload.id)
            if (profile != null) {
                const post_created = await postService.create(profile.id, body.fromLocation, body.toLocation, body.goTime, body.count, body.addition)
                res.status(201).json({
                    message: "Post created",
                    post: post_created
                })
            } else {
                res.status(404).json({
                    message: "User not found"
                })
            }
        } catch (e) {
            console.log(e)
            res.status(500)
        }
    }
    async put(req: Request, res: Response) {
        try {
            const id = req.params.id
            const body: PostDto = req.body
            const payload: Payload = res.locals.payload
            const post_exsist = await postService.findById(+id)
            if (post_exsist == null) {
                return res.status(404).json({
                    message: "Post not found"
                })
            } else {
                if (post_exsist.profile.userId == payload.id) {
                    const post_updated = await postService.update(+id, body.fromLocation, body.toLocation, body.goTime, body.count, body.addition)
                    res.status(200).json({
                        message: "Post created",
                        post: post_updated
                    })
                } else if (post_exsist.profile.userRole == 'admin') {
                    const post_updated = await postService.update(+id, body.fromLocation, body.toLocation, body.goTime, body.count, body.addition)
                    res.status(200).json({
                        message: "Post created",
                        post: post_updated
                    })
                } else {
                    res.status(403).json({ message: 'You do not own this post' })
                }
            }
        } catch (e) {
            res.status(500)
        }
    }
    async get(req: Request, res: Response) {
        try {
            const { current_page, per_page, fromLocation, toLocation } = req.query
            if (current_page != undefined && per_page != undefined) {
                if (fromLocation != undefined) {
                    if (toLocation != undefined) {
                        let u: number = await postService.CountByDirection(fromLocation.toString(), toLocation.toString())
                        let p: number = u % +per_page == 0 ? Math.floor(u / +per_page) : Math.floor(u / +per_page) + 1
                        const posts = await postService.findByDirection(fromLocation.toString(), toLocation.toString(), +current_page, +per_page)
                        return res.status(200).json({
                            posts,
                            current_page,
                            per_page,
                            total_page_count: p,
                            total_post_count: u
                        })
                    } else {
                        let u: number = await postService.CountByFromLocation(fromLocation.toString())
                        let p: number = u % +per_page == 0 ? Math.floor(u / +per_page) : Math.floor(u / +per_page) + 1
                        const posts = await postService.findByFromLocation(fromLocation.toString(), +current_page, +per_page)
                        return res.status(200).json({
                            posts,
                            current_page,
                            per_page,
                            total_page_count: p,
                            total_post_count: u
                        })
                    }
                } else if (toLocation != undefined) {
                    let u: number = await postService.CountByToLocation(toLocation.toString())
                    let p: number = u % +per_page == 0 ? Math.floor(u / +per_page) : Math.floor(u / +per_page) + 1
                    const posts = await postService.findByToLocation(toLocation.toString(), +current_page, +per_page)
                    return res.status(200).json({
                        posts,
                        current_page,
                        per_page,
                        total_page_count: p,
                        total_post_count: u
                    })
                } else {
                    let u: number = await postService.CountAll()
                    let p: number = u % +per_page == 0 ? Math.floor(u / +per_page) : Math.floor(u / +per_page) + 1
                    const posts = await postService.findAll(+current_page, +per_page)
                    return res.status(200).json({
                        posts,
                        current_page,
                        per_page,
                        total_page_count: p,
                        total_post_count: u
                    })
                }
            }
        } catch (e) {
            res.status(500)
        }
    }
    async getByUser(req: Request, res: Response) {
        try {
            const { current_page, per_page } = req.query
            if (current_page != undefined && per_page != undefined) {
                let payload: Payload = res.locals.payload
                const posts = await postService.findByUserId(payload.id, +current_page, +per_page)
                res.status(200).json({
                    posts
                })
            }
        } catch (e) {
            res.status(500)
        }
    }
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params
            const payload: Payload = res.locals.payload
            const post_exsist = await postService.findById(+id)
            if (post_exsist) {
                if (post_exsist.profile.userId == payload.id) {
                    const post_deleted = await postService.delete(post_exsist.id)
                    res.status(200).json({
                        post: post_deleted
                    })
                } else if (post_exsist.profile.userRole == 'admin') {
                    const post_deleted = await postService.delete(post_exsist.id)
                    res.status(200).json({
                        post: post_deleted
                    })
                } else {
                    res.status(403).json({
                        message: "You do not own this post"
                    })
                }
            } else {
                res.status(404).json({
                    message: "Post not found"
                })
            }
        } catch (e) {
            res.status(500)
        }
    }
    async patchStatus(req: Request, res: Response) { }
}
