import { Request, Response } from "express";
import Post from "../services/posts.service";
import User from "../services/users.service";
import { PostDto } from "../models/posts.model";

const post = new Post()
const user = new User()

export async function postPost(req: Request, res: Response) {
    const body: PostDto = req.body
    const author = await user.findById(body.author_id)
    if(author == null) {
        return res.status(404).json({
            message: "User not found by id " + body.author_id
        })
    }
    const post_created = await post.create(body.author_id, body.from_loc, body.to_loc, body.go_time, body.count, body.addition)
    res.status(201).json({
        message: "Post created",
        post: post_created
    })
}

export async function getPosts(req: Request, res: Response) {
    const { from_loc , to_loc } = req.query
    if(from_loc === undefined && to_loc === undefined){
        const posts = await post.findAll()
        return res.status(200).json({
            message: "All posts",
            posts
        })
    }
    if(from_loc === '' && to_loc === ''){
        const posts = await post.findAll()
        return res.status(200).json({
            message: "All posts",
            posts
        })
    }
    if(from_loc === '' && to_loc !== undefined){
        const posts_by_toloc = await post.findByToLoc(to_loc.toString())
        return res.status(200).json({
            message: "All posts to " + to_loc,
            posts: posts_by_toloc
        })
    }
    if(from_loc !== undefined && to_loc === ''){
        const posts_by_fromloc = await post.findByFromLoc(from_loc.toString())
        return res.status(200).json({
            message: "All posts from " + from_loc,
            posts: posts_by_fromloc
        })
    }
    const posts_by_direction = await post.findByDirection(from_loc as string, to_loc as string)
    res.status(200).json({
        message: "All posts from " + from_loc + " to " + to_loc,
        posts: posts_by_direction
    })
}