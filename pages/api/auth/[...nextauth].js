import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {PrismaAdapter} from "@auth/prisma-adapter";
import {PrismaClient} from "@prisma/client";

const prisma =  new PrismaClient()

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
                                        //check if we have a user and password
                                        if(!credentials.username || !credentials.password) return null


                                    const  hashPassword = async (password) => {
                                        // Encoder le mot de passe en Uint8Array
                                        const encoder = new TextEncoder();
                                        const data = encoder.encode(password);

                                        // Hacher le mot de passe avec SHA-256
                                        const hash = await crypto.subtle.digest('SHA-256', data);

                                        // Convertir le résultat en chaîne hexadécimale
                                        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
                                    }


                                    //check if user exist
                                    let user = await prisma.user.findUnique({
                                                                                where: {
                                                                                    name: credentials.username,
                                                                                },
                                                                                select: {
                                                                                    id: true,
                                                                                    name: true,
                                                                                    email: true,
                                                                                    password: true,
                                                                                    image: true,
                                                                                }
                                                                            });

                                    if (!user) {
                                        user = await prisma.user.findUnique({
                                                                                where: {
                                                                                    email: credentials.username,
                                                                                },
                                                                                select: {
                                                                                    id: true,
                                                                                    name: true,
                                                                                    email: true,
                                                                                    password: true,
                                                                                    image: true,
                                                                                }
                                                                            });
                                    }

                                         if (!user) return null;
                                         console.log(user)
                                        if(user.password !== await hashPassword(credentials.password)) return null

                                        //add user to session



                                        return {
                                            id: user.id,
                                            name: user.name,
                                            email: user.email,
                                            image: user.image,
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
                }
            }

            return token
        }
    },

}


export default NextAuth(authOptions)


