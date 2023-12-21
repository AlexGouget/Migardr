import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {PrismaAdapter} from "@auth/prisma-adapter";
import prisma from "../../../prisma/db";
import {UserModel} from "@/model/user.model";
import {HashPassword} from "@/utils/hashPassword";

export const authOptions = {
    // adaptater prisma
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
        strategy: 'jwt',
    },
    // Configure one or more authentication providers
    providers: [
        //strategy jwt

        CredentialsProvider({
                                // The name to display on the sign in form (e.g. 'Sign in with...')
                                name: 'Credentials',

                                credentials: {
                                    username: { label: "Username", type: "text", placeholder: "test" },
                                    password: { label: "Password", type: "password" },
                                    rememberMe: {  label: "Remember me", type: "checkbox" }
                                },
                                async authorize(credentials, req) {
                                     if(!credentials.username || !credentials.password) return false
                                    try{
                                        const user = await UserModel.findUserbyNameOrEmail(credentials.username)
                                        if (!user) return false;
                                        const isValidUser = await user.validatePassword(credentials.password)
                                        if (!isValidUser) return null;
                                        return user
                                    }catch (e) {
                                        console.log(e)
                                    }
                                }
                            })
    ],
    callbacks: {
        //add user to session
        async signIn({ user, account, profile, email, credentials }) {
            return true
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        async session({ session, user, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    email: token.email,
                    name: token.name,
                    image: token.image,
                    description: token.description,
                }
            }
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            if(user) {
                return {
                    ...token,
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    description: user.description,
                }
            }

            return token
        }
    },

}


export default NextAuth(authOptions)


