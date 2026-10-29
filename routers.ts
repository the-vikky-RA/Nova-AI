import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(12_000),
});

const chatInputSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(32),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  ai: router({
    chat: publicProcedure.input(chatInputSchema).mutation(async ({ input }) => {
      try {
        const result = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "You are Nova, a precise and thoughtful AI assistant. Be concise but useful. Use Markdown when it improves clarity. Never claim to have performed an action you could not perform.",
            },
            ...input.messages,
          ],
          maxTokens: 1200,
        });

        const content = result.choices?.[0]?.message?.content;
        if (typeof content !== "string" || !content.trim()) {
          return {
            ok: false as const,
            code: "EMPTY_RESPONSE" as const,
            error: "Nova received an empty response. Please try again.",
          };
        }

        return {
          ok: true as const,
          content: content.trim(),
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown AI service error";
        const notConfigured = /not configured/i.test(message);
        return {
          ok: false as const,
          code: notConfigured ? ("NOT_CONFIGURED" as const) : ("SERVICE_ERROR" as const),
          error: notConfigured
            ? "Nova's AI service is not configured in this environment yet. Add the managed Manus AI credentials to enable live responses."
            : "Nova could not reach the AI service right now. Your prompt is safe to retry.",
        };
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
