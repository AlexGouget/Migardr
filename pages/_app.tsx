import type {AppProps} from 'next/app'
import '../src/styles/globals.css'

import {SessionProvider} from "next-auth/react";
import {Metadata} from "next";
import {DevSupport} from "@react-buddy/ide-toolbox-next";
import {ComponentPreviews, useInitial} from "@/dev";
import ToastProvider from "@/provider/toastProvider/ToastProvider";


export const metadata: Metadata = {
    title: 'Midgard Project',
    description: 'Site communautaire de partage archéologique',


}

export default function MyApp({Component, pageProps: {session, ...pageProps}}: AppProps) {
    return <SessionProvider session={pageProps.session}>

                <DevSupport ComponentPreviews={ComponentPreviews}
                            useInitialHook={useInitial}>
                    <Component {...pageProps} />
                </DevSupport>

    </SessionProvider>

}