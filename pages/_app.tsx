import type {AppProps} from 'next/app'
import '../src/styles/globals.css'
import {SessionContext, SessionProvider} from "next-auth/react";
import {Metadata} from "next";

import React from "react";
import ToastProvider from "../src/provider/toastProvider/ToastProvider";
import {ReactTreeProvider} from "react-tree-provider";




export const metadata: Metadata = {
    title: 'Midgard Project',
    description: 'Site communautaire de partage archéologique',
}

export default function MyApp({Component, pageProps: {session, ...pageProps}}: AppProps) {

    const Providers =  ReactTreeProvider( [
        [SessionProvider, { session: session }]
    ]);

    return(
        <Providers>
            <Component {...pageProps} />
        </Providers>
    )
}



// const BuildProviderTree = (providers: any[]) => {
//     if (providers.length === 1) return providers[0];
//
//     const A = providers.shift();
//     const B = providers.shift();
//     return BuildProviderTree([
//         ({ children }) => (
//             <A>
//                 <B>
//                     {children}
//                 </B>
//             </A>
//         ),
//         ...providers,
//     ]);
// };

// <SessionProvider session={pageProps.session}>
//     <DevSupport ComponentPreviews={ComponentPreviews}
//                 useInitialHook={useInitial}>
//         <ToastProvider>
//             <Component {...pageProps} />
//         </ToastProvider>
//     </DevSupport>
// </SessionProvider>