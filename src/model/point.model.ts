
import {baseUser} from "@/model/user.model";
import prisma from "../../prisma/db";
import {point} from "@prisma/client";



export class PointModel {
    constructor(public pointData: point) {}

    static async getAll(): Promise<point[]> {
        return prisma.point.findMany({
            include: {
                typepoint: {
                    select: {
                        libelle: true,
                        id: true,
                        icon: true,
                    },
                },
                user: {
                    select: baseUser,
                },
                coverImage: true,

            },
            where: {
                active: true,
            },
        });
    }

    static async getPointById(id: number): Promise<point | null> {
        const point = await prisma.point.findUnique({
            where: {
                id: id,
            },
            include: {
                typepoint: {
                    select: {
                        libelle: true,
                        id: true,
                        icon: true,
                    },
                },
                user: {
                    select: baseUser,
                },
                urlimage: {
                    select: {
                        url: true,
                        description: true,
                        mimetype: true,
                    },
                },
                coverImage: true,
            },
        });
        return point;
    }

}
