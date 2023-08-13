import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const meRouter = createTRPCRouter({
  session: publicProcedure.query(({ ctx }) => ctx.session),
  info: protectedProcedure.query(async ({ ctx }) =>
    ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    })
  ),
});
