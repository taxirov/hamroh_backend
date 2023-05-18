import prisma from "../database"
import { UserDto } from "../models/users.model";

export default class User {
    public async create(dto: UserDto){
        return prisma.user.create({ data: { name: dto.name, phone: dto.phone, password: dto.password, role: dto.role }})
    }
    
    public async findAll() {
        return await prisma.user.findMany()
    }
    
    public async findByPhone(phone: string) {
        return prisma.user.findUnique({ where: { phone }})
    }

    public async findById(id: number) {
        return prisma.user.findUnique({ where: { id }})
    }
}

