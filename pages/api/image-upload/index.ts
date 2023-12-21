import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import multer from "multer";
import {getServerSession} from "next-auth";
import {authOptions} from "../auth/[...nextauth]";
import DOMPurify from "dompurify";
import {sanitize} from "../new-discovery";
import {nanoid} from "nanoid";
import prisma from "../../../prisma/db";
// Cette configuration est nécessaire pour dire à Next.js de ne pas traiter le corps de la requête automatiquement.
export const config = {
   api: {
      bodyParser: false,
   },
};

async function saveFile(file:any) {
   const data = fs.readFileSync(file.filepath);
   const newPath = path.join(process.cwd(), 'public/uploads', file.originalFilename);
   fs.writeFileSync(newPath, data);
   fs.unlinkSync(file.filepath); // Supprime le fichier temporaire
   return newPath;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
   }

    // @ts-ignore



   // @ts-ignore
     const session = await getServerSession(req, res, authOptions)
    if(!session) return res.status(401).json({message: 'Unauthorized'})
    // @ts-ignore
    const {name, email, image, id} = session?.user;
    if(!req.query.uuid) return res.status(400).json({message: 'Bad request'})
    if(!req.query.title) return res.status(400).json({message: 'Bad request'})

  // @ts-ignore
    const uuid =sanitize(req.query.uuid)
  // @ts-ignore
    const title = sanitize(req.query.title)
   // @ts-ignore

   const folderPath = `./public/uploads/${id+'ID'+uuid}`;
   const storage = multer.diskStorage({
      destination: (req, file, cb) => {
          if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
            cb(null, folderPath);
      },
      filename: async (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const name = `${title}`;
          const filename = `${name}${nanoid(5)}${ext}`;
          try{
              await prisma.urlimage.create({
                  data: {
                      filename: filename ,
                      url: folderPath.replace('./public', '') + '/' + filename,
                      mimetype: file.mimetype,
                      uuid: uuid,
                      uploadedById: id
                  }
              })
          }catch (e) {
              console.log(e)
              res.status(500).json({ error: "Une erreur est survenue" });
              return;

          }
          cb(null, filename);
      }
   });

        // @ts-ignore
    multer({ storage }).single('file')(req, res, async (err) => {
            if (err) {
                console.log("array error",err);
                if(err.code === 'LIMIT_FILE_SIZE')  {
                    res.status(500).json({ error: 'File size is too large. Max limit is 5MB' });
                    return;
                }
               return  res.status(500).json({ error: "Une erreur est survenue" });
            }
           return res.status(200).json({message: 'ok'})
        });
}
