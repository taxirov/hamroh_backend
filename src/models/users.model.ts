import { $Enums } from "@prisma/client"

export type RegisterDto = {
    name: string
    phone: string
    email: string
    password: string
    role: string
    carNumber: string | null
    carType: string | null
}

export type LoginDto = {
    email: string
    password: string
}

export type Payload = {
    id: number,
    role: string
}