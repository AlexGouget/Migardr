import {NextApiRequest, NextApiResponse} from "next";
import prisma from "../../../prisma/db";


export default async function handler(req: NextApiRequest, res:NextApiResponse){
    const { method, body } = req

    switch (method) {
        case 'GET':


            return res.status(200).json(await getCategories())
        case 'POST':
            return res.status(200).json({message: 'Hello world'})
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

async function getCategories(){
    return prisma.typepoint.findMany();
}
