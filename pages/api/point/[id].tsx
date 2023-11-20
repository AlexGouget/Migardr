import { PrismaClient } from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";
import {PointService} from "./point.service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const pointService = new PointService(req, res)
    const { id } = req.query;
    if(!id) return res.status(400).json({message: "id is required"})
    return await pointService.getPointById(Number(id))
;
}