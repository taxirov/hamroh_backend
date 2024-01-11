import { Prisma, Role } from "@prisma/client"
import prisma from "../prisma"

const postSelect: Prisma.PostSelect = {
    id: true,
    profile: {
        select: {
            id: true,
            userId: true,
            userName: true,
            userPhone: true,
            userRole: true,
            userEmail: true,
            userCarNumber: true,
            userCarType: true
        }
    },
    fromLocation: true,
    toLocation: true,
    goTime: true,
    count: true,
    addition: true,
    status: true,
    createdAt: true,
    updatedAt: true
}
export class PostService {
    async create(profileId: number, fromLocation: string, toLocation: string, goTime: string, count: number, addition: string | null) {
        return await prisma.post.create({
            data: {
                profileId,
                fromLocation,
                toLocation,
                goTime,
                count,
                addition
            },
            select: postSelect
        })
    }
    async update(id: number, fromLocation: string, toLocation: string, goTime: string, count: number, addition: string | null) {
        return await prisma.post.update({
            where: { id },
            data: {
                fromLocation,
                toLocation,
                goTime,
                count,
                addition
            },
            select: postSelect
        })
    }
    async delete(id: number) {
        return await prisma.post.delete({ where: { id }, select: postSelect })
    }
    async deleteAll() {
        return await prisma.post.deleteMany()
    }
    async updateStatus(id: number, status: number) {
        return await prisma.post.update({ where: { id }, data: { status }, select: postSelect })
    }
    async findAll(page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.post.findMany({ where: { status: { in: [1, 0] } }, orderBy: { createdAt: 'desc' }, select: postSelect, skip, take })
    }
    async findAllByRole(role: string, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.post.findMany({ where: { profile: { userRole: role as Role }}, orderBy: { createdAt: 'desc' }, select: postSelect, skip, take })
    }
    async CountAll() {
        return (await prisma.post.findMany({ select: { id: true } })).length
    }
    async CountAllByRole(role: string) {
        return (await prisma.post.findMany({ where: { profile: { userRole: role as Role } }, select: { id: true } })).length
    }
    async findAllActive(page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.post.findMany({
            where: { status: 1 },
            orderBy: { createdAt: 'desc' },
            select: postSelect,
            skip, take
        })
    }
    async findByFromLocation(fromLocation: string, role: string, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.post.findMany({
            where: { fromLocation: { startsWith: fromLocation }, profile: { userRole: role as Role } },
            orderBy: { createdAt: 'desc' },
            select: postSelect,
            skip, take
        })
    }
    async CountByFromLocation(fromLocation: string, role: string) {
        return (await prisma.post.findMany({
            where: { fromLocation: { startsWith: fromLocation }, profile: { userRole: role as Role } },
            select: { id: true },
        })).length
    }
    async findByToLocation(toLocation: string, role: string, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.post.findMany({
            where: { toLocation: { startsWith: toLocation }, profile: { userRole: role as Role } },
            orderBy: { createdAt: 'desc' },
            select: postSelect,
            skip, take
        })
    }
    async CountByToLocation(toLocation: string, role: string) {
        return (await prisma.post.findMany({
            where: { toLocation: { startsWith: toLocation }, profile: { userRole: role as Role } },
            select: { id: true }
        })).length
    }
    async findByDirection(fromLocation: string, toLocation: string, role: string, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.post.findMany({
            where: { fromLocation: { startsWith: fromLocation }, toLocation: { startsWith: toLocation }, profile: { userRole: role as Role } },
            select: postSelect,
            orderBy: { createdAt: 'desc' },
            skip, take
        })
    }
    async CountByDirection(fromLocation: string, toLocation: string, role: string) {
        return (await prisma.post.findMany({
            where: { fromLocation: { startsWith: fromLocation }, toLocation: { startsWith: toLocation }, profile: { userRole: role as Role} },
            select: { id: true }
        })).length
    }
    async findByProfileId(profileId: number, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.post.findMany({
            where: { profileId },
            select: postSelect,
            orderBy: { createdAt: 'desc' },
            skip, take
        })
    }
    async findByUserId(userId: number, status: number, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.post.findMany({
            where: { profile: { userId }, status },
            select: postSelect,
            orderBy: { createdAt: 'desc' },
            skip, take
        })
    }
    async countByUserId(userId: number, status: number) {
        return (await prisma.post.findMany({
            where: { profile: { userId }, status },
            select: { id: true }
        })).length
    }
    async findById(id: number) {
        return await prisma.post.findUnique({
            where: { id },
            select: postSelect
        })
    }
}
