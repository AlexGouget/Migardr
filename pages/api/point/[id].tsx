import {NextApiRequest, NextApiResponse} from "next";
import {PointService} from "./point.service";
import {PointModel} from "@/model/point.model";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const pointService = new PointService(req, res)
    const { id } = req.query;
    if(!id) return res.status(400).json({message: "id is required"})
    const point = await PointModel.getPointById(Number(id))
   
    return res.status(200).json(point)

}