"use client";

import * as React from "react";
import {NextUIProvider} from "@nextui-org/system";
import {useRouter} from "next/navigation";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {ThemeProviderProps} from "next-themes/dist/types";
import {createConfig, http, WagmiProvider} from "wagmi";
import {mainnet} from "viem/chains";

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

const wagmiConfig = createConfig({
    chains: [mainnet], 
    transports: {
        [mainnet.id]: http(),
    },
})

export function Providers({children, themeProps}: ProvidersProps) {
    const router = useRouter();

    return (
        <WagmiProvider config={wagmiConfig}>
            <NextUIProvider navigate={router.push}>
                <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
            </NextUIProvider>
        </WagmiProvider>
    );
}
