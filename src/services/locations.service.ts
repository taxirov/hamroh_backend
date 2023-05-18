import { Request, Response } from "express"
import prisma from "../database"

// for regions
async function allRegions() {
    return await prisma.region.findMany()
}
export async function getRegions(req: Request, res: Response) {
    res.status(200).json({
        message: "All regions",
        regions: await allRegions()
    })
}


// for districts
async function allDistricts() {
    return await prisma.district.findMany()
}
export async function getDistricts(req: Request, res: Response) {
    res.status(200).json({
        message: "All districts",
        districts: await allDistricts()
    })
}


// for villages
async function allVillages() {
    return await prisma.village.findMany()
}
export async function getVillages(req: Request, res: Response) {
    res.status(200).json({
        message: "All villages",
        villages: await allVillages()
    })
}