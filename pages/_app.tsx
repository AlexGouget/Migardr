
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import '../src/styles/globals.css'
import NavBar from "@/components/navigation/NavBar";
export default function MyApp({ Component, pageProps }: AppProps) {
    return  <main className="flex min-h-screen flex-col items-center justify-between">
                <NavBar />
                <Component {...pageProps} />
            </main>
}