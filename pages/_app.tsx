import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import '../src/styles/globals.css'
export default function MyApp({ Component, pageProps }: AppProps) {
    return  <main className="flex min-h-screen flex-col items-center justify-between">

                <Component {...pageProps} />
            </main>
}