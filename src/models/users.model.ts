export type RegisterDto = {
    name: string
    phone: string
    password: string
    role: 'driver' | 'passager'
    car_number: string | null
    car_model: string | null
}

export type UserDto = {
    name: string
    phone: string
    password: string
    role: string
}

export type LoginDto = {
    phone: string
    password: string
}

export type DriverPayload = {
    id: number,
    name: string
    phone: string
    role: string
    car_id: number
    car_number: string
    car_model: string
}

export type PassagerPayload = {
    id: number,
    name: string
    phone: string
    role: string
}