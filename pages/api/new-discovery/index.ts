import {NextApiRequest, NextApiResponse} from 'next';
import multer from 'multer';
import path from 'path';
import * as fs from "fs";
import sanitizeHtml from 'sanitize-html';
import prisma from "../../../prisma/db";
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
    if (req.method === 'POST') {

        const folderPath = `./public/uploads/${generateUniqueFolderId()}`;
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
                    const name = `${title}-${originalName}`;
                    const filename = `${name}${ext}`;

                    if(!req.body.urlimage) req.body.urlimage = [];

                    const description = sanitizeText(req.body.description);
                    req.body.urlimage.push({
                        url: `${req.body.folderPath}/${filename}`,
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
                //10 Mo
                fileSize:  2000000,
                files: 5
            },
            // @ts-ignore
        }).array('files')(req, res, async (err) => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'Erreur lors de l\'upload des fichiers' });
                return;
            }
            // savePointToDB(req.body);
            res.status(200).json(req.body);
            }
        );


    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

const savePointToDB = async (req: any) => {

}