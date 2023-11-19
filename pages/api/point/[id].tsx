import { PrismaClient } from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const prisma = new PrismaClient();
    const { id } = req.query;

    if(!id) return res.status(400).json({message: "id is required"})

    const point = await prisma.point.findUnique({
        where: { id: Number(id) },
        select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            content: true,
            title: true,
            description: true,
            yearDiscovery: true,
            slug: true,
            year: true,
            bc: true,
            typepoint: {
                select: {
                    libelle: true,
                }
            },
            url: true,
            user: {
                select: {
                    name:true,
                    id:true,
                    image:true,
                }
            }

        },

    });

    console.log(point)

    res.status(200).json(point);
}