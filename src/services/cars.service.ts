import prisma from "../database";

export default class Car {

    public async findAll() {
        return await prisma.car.findMany()
    }

    public async findByUserId(userId: number) {
        return await prisma.car.findUnique({ where: { userId }})
    }

    public async create(userId: number, carNumber: string, carType: string) {
        return await prisma.car.create({ data: { userId, carNumber, carType }})
    }

    public async delete(id: number) {
        return await prisma.car.delete({ where: { id }})
    }
}