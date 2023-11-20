import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import {PointService} from "./point.service";
const prisma = new PrismaClient()


export default async function handler(req: NextApiRequest, res:NextApiResponse){
    const pointService = new PointService(req, res)
    const { method, body } = req

    switch (method) {
        case 'GET':
            return await pointService.getAll()
        case 'POST':
            return await pointService.createPoint(body)
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

