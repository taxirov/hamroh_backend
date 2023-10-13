import prisma from "../prisma"
import { UserDto } from "../models/users.model";

export default class User {

    async create(dto: UserDto){
        return prisma.user.create({ data: { name: dto.name, phone: dto.phone, password: dto.password, role: dto.role }})
    }
    
    async findAll() {
        return await prisma.user.findMany()
    }
    
    async findByPhone(phone: string) {
        return prisma.user.findUnique({ where: { phone }})
    }

    async findById(id: number) {
        return prisma.user.findUnique({ where: { id }})
    }

}

