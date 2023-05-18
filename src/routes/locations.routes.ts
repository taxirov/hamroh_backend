import { Router } from 'express'
import { getDistricts, getRegions, getVillages } from '../services/locations.service'

const router = Router()

router.get('/regions', getRegions)
router.get('/districts', getDistricts)
router.get('/villages', getVillages)

export default router