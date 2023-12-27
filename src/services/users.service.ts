import prisma from "../prisma"
import { RegisterDto } from "../models/users.model";
import { CarType, Prisma, Role } from "@prisma/client";

export const userSelect: Prisma.UserSelect = {
    car: true,
    profile: true
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
                            userName: dto.name
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
                            userName: dto.name
                        }
                    }
                },
                select: userSelect
            })
        }
    }
    async findAll(page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return await prisma.user.findMany({ select: userSelect, skip, take })
    }
    async findAllCount() {
        return (await prisma.user.findMany({ select: { id: true }})).length
    }
    async findByPhone(phone: string) {
        return prisma.user.findUnique({ where: { phone }, select: userSelect})
    }
    async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email }, select: userSelect})
    }
    async findByName(name: string, page: number, limit: number) {
        let skip: number = (page - 1) * limit;
        let take: number = limit;
        return prisma.user.findMany({ where: { name }, select: userSelect, skip, take })
    }
    async findById(id: number) {
        return prisma.user.findUnique({ where: { id }, select: userSelect })
    }

}

