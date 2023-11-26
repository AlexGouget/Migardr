import {PrismaClient, account, point, session, user} from "@prisma/client";
import {HashPassword} from "@/utils/hashPassword";

const prisma = new PrismaClient();


export const baseUser = {
    email: true,
    name: true,
    createdAt: true,
    image: true,
    roles: true,
    description: true,
}

export class UserModel {
        private email: string;
        private name: string;
        private password?: string | null;
        private createdAt?: Date | null;
        private roles: string | "user" | "admin" | "superAdmin" | "moderator" | "editor" | null | undefined;
        private id?: string;
        private description?: string | null;
        private updatedAt?: Date | null;
        private deletedAt?: Date | null;
        private admin?: boolean;
        private active?: boolean;
        private emailVerified?: Date | null;
        private image?: string | null;
        private account?: account[] | null;
        private point?: point[] | null;
        private session?: session[] | null;



    constructor(user: {
        email: string;
        name: string;
        password?: string | null;
        createdAt?: Date | null;
        roles?: string | 'user' | 'admin' | 'superAdmin' | 'moderator' | 'editor' | null;
        id?: string;
        description?: string | null;
        updatedAt?: Date | null;
        deletedAt?: Date | null;
        admin?: boolean;
        active?: boolean;
        emailVerified?: Date | null;
        image?: string | null;
        account?: account[] | null;
        point?: point[] | null;
        session?: session[] | null;
    }) {
        // Initialisation des propriétés
        this.email = user.email;
        this.name = user.name;
        this.password = user.password;
        this.createdAt = user.createdAt;
        this.roles = user.roles;
        this.id = user.id;
        this.description = user.description;
        this.updatedAt = user.updatedAt;
        this.deletedAt = user.deletedAt;
        this.admin = user.admin;
        this.active = user.active;
        this.emailVerified = user.emailVerified;
        this.image = user.image;
        this.account = user.account;
        this.point = user.point;
        this.session = user.session;
    }



    static async isEmailExist(email: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        return !!user;
    }

    static async isUsernameExist(username: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: {
                name: username,
            },
        });
        return !!user;
    }

    static async findUserbyNameOrEmail(username:string): Promise<UserModel | null> {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        email: username,
                    },
                    {
                        name: username,
                    },
                ],
            },
            include: {
                account: true,
                point: true,
                session: true,
            }
        });
        if(!user) return null
        return new UserModel(user)
    }

    //validate user password
    public async validatePassword(_password: string): Promise<boolean> {
        if(!this.password) return false
        return await new HashPassword(_password).compare(this.password)
    }

    /**
     * return user json without password
     */
    get getUser():{
        id: string | undefined;
        email: string;
        name: string;
        description?: string | null | undefined;
        createdAt?: Date | null | undefined;
        updatedAt?: Date | null | undefined;
        deletedAt?: Date | null | undefined;
        admin?: boolean | undefined;
        active?: boolean | undefined;
        emailVerified?: Date | null | undefined;
        image?: string | null | undefined;
        roles?: string | 'user' | 'admin' | 'superAdmin' | 'moderator' | 'editor' | null | undefined;
        account?: account[] | null | undefined;
        point?: point[] | null | undefined;
        session?: session[] | null | undefined;
    }{
      return {
            id: this.id,
            email: this.email,
            name: this.name,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
            admin: this.admin,
            active: this.active,
            emailVerified: this.emailVerified,
            image: this.image,
            roles: this.roles,
        };
    }


    get points(): point[] | null | undefined {
        return this.point;
    }


    async createUser(): Promise<UserModel> {
        if(!this.password) throw new Error('Password is required')
        //hash password
        this.password = await new HashPassword(this.password).hash()

        try{
            const user = await prisma.user.create({
                data: {
                    ...this,
                    password: this.password,
                },
                select:baseUser
            });
            return new UserModel(user)
        }catch (e) {
            console.log(e)
            throw new Error('Error creating user')
        }
    }

   async updateUser(): Promise<UserModel> {
            try{
                const user = await prisma.user.update({
                    where: {
                        id: this.id,
                    },
                    data: {
                        email: this.email,
                        name: this.name,
                        description: this.description,
                        image: this.image,
                        emailVerified: this.emailVerified,
                    },
                    select: baseUser
                });
                return new UserModel(user)
            }catch (e) {
                console.log(e)
                throw new Error('Error updating user')
            }
        }
}


