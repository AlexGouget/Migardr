
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import '../src/styles/globals.css'
import NavBar from "@/components/navigation/NavBar";
import {SessionProvider} from "next-auth/react";
import {Metadata} from "next";


export const metadata: Metadata = {
    title: 'Midgard Project'
}

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return <SessionProvider session={pageProps.session}>


                    <Component {...pageProps} />

            </SessionProvider>

}