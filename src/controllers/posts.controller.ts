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
                if (post_exsist.profile.userId == payload.id || payload.role == 'admin') {
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
            res.status(500).json({ message: 'Internal server error' })
        }
    }
    async get(req: Request, res: Response) {
        try {
            const { current_page, per_page, role, fromLocation, toLocation } = req.query
            if (current_page != undefined && per_page != undefined && role != undefined) {
                if (fromLocation != undefined) {
                    if (toLocation != undefined) {
                        let u: number = await postService.CountByDirection(fromLocation.toString(), toLocation.toString(), role.toString())
                        let p: number = u % +per_page == 0 ? Math.floor(u / +per_page) : Math.floor(u / +per_page) + 1
                        const posts = await postService.findByDirection(fromLocation.toString(), toLocation.toString(), role.toString(), +current_page, +per_page)
                        return res.status(200).json({
                            posts,
                            current_page,
                            per_page,
                            role,
                            total_page_count: p,
                            total_post_count: u
                        })
                    } else {
                        let u: number = await postService.CountByFromLocation(fromLocation.toString(), role.toString())
                        let p: number = u % +per_page == 0 ? Math.floor(u / +per_page) : Math.floor(u / +per_page) + 1
                        const posts = await postService.findByFromLocation(fromLocation.toString(), role.toString(), +current_page, +per_page)
                        return res.status(200).json({
                            posts,
                            current_page,
                            per_page,
                            role,
                            total_page_count: p,
                            total_post_count: u
                        })
                    }
                } else if (toLocation != undefined) {
                    let u: number = await postService.CountByToLocation(toLocation.toString(), role.toString())
                    let p: number = u % +per_page == 0 ? Math.floor(u / +per_page) : Math.floor(u / +per_page) + 1
                    const posts = await postService.findByToLocation(toLocation.toString(), role.toString(), +current_page, +per_page)
                    return res.status(200).json({
                        posts,
                        current_page,
                        per_page,
                        role,
                        total_page_count: p,
                        total_post_count: u
                    })
                } else {
                    let u: number = await postService.CountAllByRole(role.toString())
                    let p: number = u % +per_page == 0 ? Math.floor(u / +per_page) : Math.floor(u / +per_page) + 1
                    const posts = await postService.findAllByRole(role.toString(), +current_page, +per_page)
                    return res.status(200).json({
                        posts,
                        current_page,
                        per_page,
                        role,
                        total_page_count: p,
                        total_post_count: u
                    })
                }
            }
        } catch (e) {
            res.status(500).json({ message: "Internal server error" })
        }
    }
    async getByUser(req: Request, res: Response) {
        try {
            const { current_page, per_page, status } = req.query
            if (current_page != undefined && per_page != undefined && status != undefined) {
                let payload: Payload = res.locals.payload
                let u: number = await postService.countByUserId(payload.id, +status)
                let p: number = u % +per_page == 0 ? Math.floor(u / +per_page) : Math.floor(u / +per_page) + 1
                const posts = await postService.findByUserId(payload.id, +status, +current_page, +per_page)
                res.status(200).json({
                    posts,
                    current_page,
                    per_page,
                    total_page_count: p,
                    total_post_count: u
                })
            }
        } catch (e) {
            res.status(500).json({ message: "Internal server error", error: e })
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
    async patchStatus(req: Request, res: Response) {
        try {
            const payload: Payload = res.locals.payload
            const { status } = req.body
            const { id } = req.params
            const post_exsist = await postService.findById(+id)
            if (post_exsist != null) {
                if (post_exsist.profile.userId == payload.id || payload.role == 'admin') {
                    const post_updated = await postService.updateStatus(+id, +status)
                    res.status(200).json({
                        post: post_updated
                    })
                } else {
                    res.status(403).json({ message: "You do not own this post" })
                }
            } else {}

        } catch (e) {
            res.status(500).json({ message: "Internal server error" })
        }
    }
}
