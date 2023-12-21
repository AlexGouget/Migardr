import {getServerSession} from "next-auth";
import {authOptions} from "../auth/[...nextauth]";
import {NextApiRequest, NextApiResponse} from "next";
import prisma from "../../../prisma/db";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed' });
    }


    // @ts-ignore
    const session = await getServerSession(req, res, authOptions)
    if(!session) return res.status(401).json({message: 'Unauthorized'})
    // @ts-ignore
    const {name, email, image, id} = session?.user;


    if(!req.query.id) return res.status(400).json({message: 'Bad request'})
    try {
        const result = await prisma.urlimage.delete({
            where: {
                id: Number(req.query.id)
            }
        })
        return res.status(200).json(result);
    }catch (e) {
        console.log(e)
        return res.status(500).json({message: 'Internal server error'})
    }


}