import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
const prisma = new PrismaClient()


export default async function handler(req: NextApiRequest, res:NextApiResponse){
    const { method } = req
    switch (method) {
        case 'GET':
            const points = await prisma.point.findMany({
                select: {
                    id: true,
                    title: true,
                    latitude: true,
                    longitude: true,
                    description: true,
                    typepoint: {
                        select: {
                            libelle: true,
                            icon: true
                        }
                    }
                }
            })
            res.status(200).json(points)
            break
        case 'POST':
            const { name, latitude, longitude, description, image, city, uf, items } = req.body

            res.status(200).json('')
            break
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

