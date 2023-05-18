import prisma from "../database"

export default class Post {
    public async create(author_id: number, from_loc: string, to_loc: string, go_time: string, count: number, addition: string | '') {
        return await prisma.post.create({
            data: { author_id, from_loc, to_loc, go_time, count, addition }
        })
    }
    
    public async findAll() {
        return await prisma.post.findMany()
    }

    public async findAllActive() {
        return await prisma.post.findMany({
            where: { status: true }
        })
    }
    
    public async findByFromLoc(from_loc: string) {
        return await prisma.post.findMany({
            where: { from_loc }
        })
    }

    public async findByToLoc(to_loc: string) {
        return await prisma.post.findMany({
            where: { to_loc }
        })
    }

    public async findByDirection(from_loc: string, to_loc: string) {
        return await prisma.post.findMany({
            where: { from_loc, to_loc }
        })
    }

    public async searchPost(search: string) {
        return await prisma.post.findMany({
            where: {
                from_loc: { startsWith: search },
                to_loc: { startsWith: search  }
            }
        })
    }
}
