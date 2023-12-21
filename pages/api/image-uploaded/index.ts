import {NextApiRequest, NextApiResponse} from "next";
import prisma from "../../../prisma/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
    const uuid = req.query.uuid as string;
    if(!uuid) return res.status(400).json({message: 'Bad request'})

    const images = await prisma.urlimage.findMany({
        where: {
            uuid: req.query.uuid as string
        }
    });

    return res.status(200).json(images);
}