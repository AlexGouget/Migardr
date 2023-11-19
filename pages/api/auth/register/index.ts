import {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "../[...nextAuth]";
import {PrismaClient} from "@prisma/client";


const prisma = new PrismaClient()
export default async function handler(req: NextApiRequest, res:NextApiResponse){
    // @ts-ignore
    const session = await getServerSession(req, res, authOptions)
    const { method } = req
    switch (method) {
        case 'POST':
            handleRegistration(req, res)
            break
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }

    /**
     * Handle the registration of a new user
     * @param req
     * @param res
     */
    function handleRegistration(req: NextApiRequest, res: NextApiResponse) {
        if(session) res.status(400).json({message: 'You are already logged in'})
        const {email, password, name} = req.body
        const errors: { message: string; errorType: string; }[] = []
        if(!email || !password || !name) res.status(400).json({message: 'Missing fields'})



        const existingEmail = checkEmail(email).then(email => {
            // if(email) res.status(400).json({message: 'Email already use', errorType:'email'})
           if(email) errors.push({message: 'Email already use', errorType:'email'})
         })

        const existingUser = checkUsername(name).then( user =>{
            if(user) errors.push({message:'Username already exist', errorType:'username'})
        })


        if(errors.length > 0) {
            console.log("error",errors)
            //transform errors to json
            res.status(400).json({message: 'Error creating user', errors: errors})
        }else{
            createUser(email, password, name).then(user => {
                res.status(200).json({message: 'User created'})
            }).catch(err => {
                res.status(400).json({message: 'Error creating user', errors: errors})
            })
        }




        async function checkEmail(email: string) {
        return prisma.user.findUnique({
            where: {
                email:email
            }
        });
    }

    async function checkUsername(username:string)   {
            return prisma.user.findUnique({
                where:{
                    name:username
                }
            })
    }

    async function createUser(email: string, password: string, name:string) {
            const hashPwd = await hashPassword(password)

        return prisma.user.create({
                 // @ts-ignore
                data: {
                    email: email,
                    password: hashPwd,
                    name: name

                }
            })
    }

        async  function hashPassword(password: string) {
            // Encoder le mot de passe en Uint8Array
            const encoder = new TextEncoder();
            const data = encoder.encode(password);

            // Hacher le mot de passe avec SHA-256
            const hash = await crypto.subtle.digest('SHA-256', data);

            // Convertir le résultat en chaîne hexadécimale
            return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
        }
    }
}

