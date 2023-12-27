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
    phone: string
    password: string
}

export type Payload = {
    id: number
    phone: string
    email: string
    role: string
}