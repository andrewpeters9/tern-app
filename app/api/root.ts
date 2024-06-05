import { createTRPCRouter } from "@/app/api/trpc";
import { aiRouter } from "@/app/api/routers/ai";

export const appRouter = createTRPCRouter({
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
