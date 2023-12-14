import {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "../[...nextauth]";
import {PrismaClient} from "@prisma/client";
import {UserModel} from "@/model/user.model";



export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    // @ts-ignore
    const session = await getServerSession(req, res, authOptions)
    const {method} = req
    switch (method) {
        case 'POST':
            await handleRegistration(req, res)
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
    async function handleRegistration(req: NextApiRequest, res: NextApiResponse) {
        if (session) res.status(400).json({message: 'You are already logged in'})
        const {email, password, name} = req.body
        const errors: { message: string; errorType: string; }[] = []
        if (!email || !password || !name) res.status(400).json({message: 'Missing fields'})


        await UserModel.isEmailExist(email).then(user => {
            console.log("exist", user)
            if (user) errors.push({message: 'Email already exist', errorType: 'email'})
        })

       await UserModel.isUsernameExist(name).then(user => {
            if (user) errors.push({message: 'Username already exist', errorType: 'username'})
        })


        if (errors.length > 0) {
            res.status(400).json({message: 'Error creating user', errors: errors})
            return
        }


        const user = new UserModel({email: email, password: password, name: name})
        user.createUser().then(user => {
            res.status(200).json({message: 'User created'})
        }).catch(err => {
            res.status(400).json({message: 'Error creating user', errors: errors})
        })

    }
}

