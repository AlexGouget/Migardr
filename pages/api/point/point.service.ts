import prisma from "../../../prisma/db";
import {NextApiRequest, NextApiResponse} from "next";
import {point, PrismaClient} from "@prisma/client";
export class PointService {

    private prisma: PrismaClient;
    constructor(private req: NextApiRequest,private res: NextApiResponse) {
        this.prisma = prisma;
    }

    async getPointBySlug(slug: string) {

    }

    async getPointById(id: number) {
        if(!id && typeof id !== 'number') return this.res.status(400).json({message: 'id is required or invalid'})
        try{
            const resut = await this.prisma.point.findUnique({
                where: {id: id},
                select: {
                    id: true,
                    createdAt: true,
                    updatedAt: true,
                    content: true,
                    title: true,
                    description: true,
                    coverImage: {
                        select: {
                            url: true,
                            description: true,
                        }
                    },
                    yearDiscovery: true,
                    slug: true,
                    dyear: true,
                    dmonth: true,
                    dday: true,
                    dyearAfter: true,
                    dmonthAfter: true,
                    ddayAfter: true,

                    urlimage: {
                        select: {
                            url: true,
                            description: true,
                        }
                    },
                    typepoint: {
                        select: {
                            libelle: true,
                        }
                    },
                    url: true,
                    user: {
                        select: {
                            name: true,
                            id: true,
                            image: true,
                        }
                    }

                },

            });
            return this.res.status(200).json(resut)
        }catch (e) {
            return this.res.status(500).json({message: 'Error while fetching point'})
        }
    }

    async createPoint(point : point) {
        //check if point has all required fields
        if(!point) return this.res.status(400).json({message: 'point is required'})

        try{
            const result = await this.prisma.point.create({
                data: point
            })
            return this.res.status(200).json(result)
        }catch (e) {
            console.log(e)
            return this.res.status(500).json({message: 'Error while creating point'})
        }
    }

}