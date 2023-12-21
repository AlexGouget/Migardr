import {NextApiRequest, NextApiResponse} from 'next';
import multer from 'multer';
import path from 'path';
import * as fs from "fs";
import sanitizeHtml from 'sanitize-html';
import prisma from "../../../prisma/db";
import {getSession} from "next-auth/react";
import {authOptions} from "../auth/[...nextauth]";
import {getServerSession} from "next-auth";
import DOMPurify from "dompurify";



const HTML_ALLOWED_TAGS = {
    allowedTags: ['b', 'i', 'em', 'strong', 'a'],
    allowedAttributes: {
        'a': ['href']
    }
}

const generateUniqueFolderId = () => {
    return Date.now().toString(36) + Math.random().toString(36);
}

const sanitizeText = (text: string) => {
    if(!text) return undefined;
    return sanitizeHtml(text, {
        allowedTags: [],
        allowedAttributes: {},
    });
}
export const sanitize = (filename: string) => {
    return filename
        .normalize("NFD") // décompose les caractères accentués en leurs composants
        .replace(/[\u0300-\u036f]/g, "") // supprime les signes diacritiques
        .replace(/[^a-z0-9\- ]/gi, "") // supprime tout ce qui n'est pas alphanumérique, espace ou tiret
        .trim() // supprime les espaces au début et à la fin
        .replace(/\s+/g, "-") // remplace les espaces par des tirets
        .toLowerCase(); // convertit en minuscules
}



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // @ts-ignore
    const session = await getServerSession(req, res, authOptions)
    // @ts-ignore
    const {name, email, image, id} = session?.user;
    if (req.method === 'POST') {
        if(!req.body) return res.status(400).json({message: 'missing data'});
        const body = JSON.parse(req.body);

        console.log("body", body);

        const result = await savePointToDB(body, id);

        if(!result) return res.status(400).json({message: 'missing data'});
        return res.status(200).json(result);

    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}


function getTypePoint(body:any) {
    let typepointData;
    if (body.newCategory) {
        // L'utilisateur a fourni une nouvelle catégorie
        return {
            create: {
                libelle: sanitizeHtml(body.newCategory, HTML_ALLOWED_TAGS),
            }
        };
    } else {
        // Connecter à une catégorie existante
        return {
            connect: {
                id: Number(body.category)
            }
        };
    }
}

async function getImagesToConnect(uuid: string) {
    const img = await prisma.urlimage.findMany({
        where: {
            uuid: uuid
        }
    });
    if (!img) return [];
    let images = [];
    for (const image of img) {
        images.push({
            id: image.id
        });
    }
    return images;
}

const savePointToDB = async (data: any, userId:any) => {
    //retrieve user id
    const session = await getSession();
    const body = await checkData(data);

    let typepointData = getTypePoint(body);
    let images = getImagesToConnect(body.uuid);

    // GESTION DES DATES
    const { year, month, day } = body;
    const { yearAfter, monthAfter, dayAfter } = body;

    const yearDiscoveryDate = new Date(body.yearDiscovery);
    yearDiscoveryDate.setUTCHours(0, 0, 0, 0);

    try{
        //transform yearDiscovery to UTC date with hours 00:00:00


        const result = await prisma.point.create({
            data: {
                user: {
                    connect: {
                        id: userId
                    }
                },
                slug: body.slug,
                title: sanitizeHtml(body.title, HTML_ALLOWED_TAGS),
                description: sanitizeHtml(body.description, HTML_ALLOWED_TAGS),
                content: sanitizeHtml(body.content, HTML_ALLOWED_TAGS),
                //date de découverte with hours 0 to avoid bug
                yearDiscovery: yearDiscoveryDate,
                url: sanitizeHtml(body.url, HTML_ALLOWED_TAGS),
                dyear: Number(year),
                dmonth: Number(month),
                dday: Number(day),
                dyearAfter: Number(yearAfter),
                dmonthAfter: Number(monthAfter),
                ddayAfter: Number(dayAfter),
                latitude: Number(body.lat),
                longitude: Number(body.lng),
                bc: false,
                urlimage: {
                    connect: await images
                },
                typepoint: typepointData,

            }});
        return result;
    }catch (e) {
        console.log("e", e);
        throw new Error('Missing required fields');
    }


}

function generateSlug(title: string) {
    return title
        .normalize("NFD") // décompose les caractères accentués en leurs composants
        .replace(/[\u0300-\u036f]/g, "") // supprime les signes diacritiques
        .replace(/[^a-z0-9\- ]/gi, "") // supprime tout ce qui n'est pas alphanumérique, espace ou tiret
        .trim() // supprime les espaces au début et à la fin
        .replace(/\s+/g, "-") // remplace les espaces par des tirets
        .toLowerCase(); // convertit en minuscules
}

function escapeInput(input:string) {
    if(!input) return input;
    return input.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")

}



async function checkData(body: any) {

    const {lat, lng, title, yearDiscovery, uuid} = body;

    console.log("body", body);

    if (!lat || !lng || !title || !yearDiscovery || !uuid )  throw new Error('Missing required fields');

    const {category, newCategory} = body;
    if (category === '1') {
        if (!newCategory)
            throw new Error('Missing required fields');
    }

    const {year, yearAfter} = body;
    if (!year) {
        if (!yearAfter)
            throw new Error('Missing required fields');
    }

    //check if slug already exist
    const slug = generateSlug(title);
    const point = await prisma.point.findUnique({
        where: {
            slug: slug
        }
    });
    if (point){
        //we add small uuid to slug
        body.slug = `${slug}-${Date.now().toString(36)}`;

    }else{
        body.slug = slug;
    }
    return body;
}
