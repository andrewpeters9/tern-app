"use client";

import type { QueryClientConfig } from "@tanstack/react-query";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import toast from "react-hot-toast";
import transformer from "superjson";

import { AppRouter } from "@/app/api/root";

const queryClientConfig: QueryClientConfig = {
  queryCache: new QueryCache({
    onError: (error) => {
      console.error("Error in QueryClient:", error);
      toast.error("Something went wrong. Please try again later.");
    },
  }),
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        console.warn(error);
        toast.error(
          "Something went wrong. Please refresh your browser and try again.",
        );
      },
    },
  },
};

const createQueryClient = (config: QueryClientConfig) =>
  new QueryClient(config);

let clientQueryClientSingleton:
  | ReturnType<typeof createQueryClient>
  | undefined;

export const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient(queryClientConfig);
  } else {
    // Browser: use singleton pattern to keep the same query client
    return (clientQueryClientSingleton ??=
      createQueryClient(queryClientConfig));
  }
};

export const trpc = createTRPCReact<AppRouter>();

// const asyncStoragePersister = createAsyncStoragePersister({
//   storage: AsyncStorage,
// });

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          transformer,
          url: getBaseUrl() + "/api/trpc",
          headers() {
            const headers = new Headers();

            headers.set("x-trpc-source", "nextjs-react");

            return headers;
          },
        }),
      ],
    }),
  );

  return (
    // <PersistQueryClientProvider
    <QueryClientProvider
      client={queryClient}
      // persistOptions={{ persister: asyncStoragePersister }}
    >
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </trpc.Provider>
    </QueryClientProvider>
  );
}

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
};
