import prisma from "../prisma"
import { RegisterDto } from "../models/users.model";
import { CarType, Prisma, Role } from "@prisma/client";

export const userSelect: Prisma.UserSelect = {
    id: true,
    role: true,
    profile: true,
    car: true
}

export class UserService {
    async create(dto: RegisterDto) {
        if (dto.carNumber !== null && dto.carType !== null) {
            return prisma.user.create({
                data: {
                    name: dto.name,
                    phone: dto.phone,
                    email: dto.email,
                    role: dto.role as Role,
                    password: dto.password,
                    car: {
                        create: {
                            carNumber: dto.carNumber,
                            carType: dto.carType as CarType
                        }
                    },
                    profile: {
                        create: {
                            userName: dto.name,
                            userRole: dto.role as Role 
                        }
                    }
                },
                select: userSelect
            })
        } else {
            return prisma.user.create({
                data: {
                    name: dto.name,
                    phone: dto.phone,
                    email: dto.email,
                    role: dto.role as Role,
                    password: dto.password,
                    profile: {
                        create: {
                            userName: dto.name,
                            userRole: dto.role as Role
                        }
                    }
                },
                select: userSelect
            })
        }
    }
    async updateRole(id: number, role: string) {
        return await prisma.user.update({ where: { id }, data: { role: role as Role }, select: userSelect })
    }
    async updatePassword(id: number, password: string) {
        return await prisma.user.update({ where: { id }, data: { password }, select: userSelect })
    }
    async findAll(page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.user.findMany({ select: userSelect, skip, take })
    }
    async findAllCount() {
        return (await prisma.user.findMany({ select: { id: true }})).length
    }
    async findProfileById(id: number) {
        return await prisma.profile.findUnique({ where: { userId: id }})
    }
    async findByPhone(phone: string) {
        return prisma.user.findUnique({ where: { phone }, select: userSelect })
    }
    async findByPhonePassword(phone: string) {
        return prisma.user.findUnique({ where: { phone }, select: { id: true, password: true } })
    }
    async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email }, select: userSelect})
    }
    async findByEmailPass(email: string) {
        return prisma.user.findUnique({ where: { email }, select: { id: true, password: true }})
    }
    async findByName(name: string, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return prisma.user.findMany({ where: { name }, select: userSelect, skip, take })
    }
    async findById(id: number) {
        return prisma.user.findUnique({ where: { id }, select: userSelect })
    }
    async findByIdPass(id: number) {
        return prisma.user.findUnique({ where: { id }, select: { id: true, password: true} })
    }
}

