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

export const config = {
    api: {
        bodyParser: false,
    },
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
const sanitize = (filename: string) => {
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
        const uuidFolder = generateUniqueFolderId();

        const folderPath = `./public/uploads/${uuidFolder}`;
        const storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
                    if(!req.body.folderPath) req.body.folderPath = folderPath;
                    cb(null, folderPath);
                },
                filename: (req, file, cb) => {
                    const ext = path.extname(file.originalname);
                    const title = sanitize(req.body.title);
                    const originalName = sanitize(file.originalname);
                    const name = `${title}`;

                    //10 caractères max UUID
                    const uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

                    const filename = `${name+uuid}${ext}`;

                    if(!req.body.urlimage) req.body.urlimage = [];

                    const description = sanitizeText(req.body.description);
                    req.body.urlimage.push({
                        url: `/uploads/${uuidFolder}/${filename}`,
                        filename: name,
                        mimetype: file.mimetype,
                        description: description,
                    });

                    cb(null, filename);
                }
            });



        multer({
            storage,
            limits: {
                // 5 MB
                fileSize: 5 * 1024 * 1024,
                files: 5
            },
            // @ts-ignore
        }).array('files')(req, res, async (err) => {
            if (err) {
                console.log("array error",err);
                if(err.code === 'LIMIT_FILE_SIZE')  {
                    res.status(500).json({ error: 'File size is too large. Max limit is 5MB' });
                    return;
                }
                res.status(500).json({ error: "Une erreur est survenue" });
                return;
            }
            savePointToDB(req.body, id).then(() => {
                console.log('saved');
                res.status(200).json(req.body);
            }).catch((e) => {
                console.log("erreur",e);
                //delete folder in req.body.folderPath

                // fs.rmdirSync(req.body.folderPath, { recursive: true });
                res.status(500).json({ error: 'Une erreur est survenue' });
            });
            }
        );


    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}


const savePointToDB = async (data: any, userId:any) => {
    //retrieve user id
    const session = await getSession();
   const body = await checkData(data);

   console.log("body", new Date(body.yearDiscovery));

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
            yearDiscovery: new Date(body.yearDiscovery),
            year: new Date(body.year),
            url: sanitizeHtml(body.url, HTML_ALLOWED_TAGS),
            ApproximateYearBefore: body.ApproximateYearBefore ? new Date(body.ApproximateYearBefore) : null,
            ApproximateYearAfter: body.ApproximateYearAfter ? new Date(body.ApproximateYearAfter) : null,
            latitude: Number(body.lat),
            longitude: Number(body.lng),
            bc: false,
            urlimage: {
                create: body.urlimage
            },
            typepoint: {
                connectOrCreate: {
                    where: {
                        id: Number(body.category)
                    },
                    create: {
                        libelle: body.newCategory ? sanitizeHtml(body.newCategory, HTML_ALLOWED_TAGS) : '',


                    }
                }
            },

    }});
    return result;
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

    const {lat, lng, title, yearDiscovery} = body;
    if (!lat || !lng || !title || !yearDiscovery) throw new Error('Missing required fields');

    const {category, newCategory} = body;
    if (category === '25') {
        if (!newCategory)
            throw new Error('Missing required fields');
    }

    const {year, ApproximateYearBefore, ApproximateYearAfter} = body;
    if (!year) {
        if (!ApproximateYearBefore || !ApproximateYearAfter)
            throw new Error('Missing required fields');
    }


    //check if slug already exist
    const slug = generateSlug(title);
    const point = await prisma.point.findUnique({
        where: {
            slug: slug
        }
    });

    console.log("point", point);

    if (point){
        //we add small uuid to slug
        body.slug = `${slug}-${Date.now().toString(36)}`;

    }else{
        body.slug = slug;
    }


    return body;
}
