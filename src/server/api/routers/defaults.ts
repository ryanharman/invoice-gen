import { InvoiceDefaultSchema } from "~/server/schemas";
import {
  decryptPaymentDetails,
  encryptPaymentDetails,
} from "~/server/utils/encryptPaymentDetails";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const defaultsRouter = createTRPCRouter({
  getUserDefaults: protectedProcedure.query(async ({ ctx }) => {
    const defaults = await ctx.prisma.userDefaultInvoiceValues.findUnique({
      where: { userId: ctx.session.user.id },
    });
    const defaultsWithDecryptedValues = await decryptPaymentDetails(defaults);
    return defaultsWithDecryptedValues;
  }),
  upsert: protectedProcedure
    .input(InvoiceDefaultSchema)
    .mutation(async ({ ctx, input }) => {
      const defaultsWithEncryptedValues = await encryptPaymentDetails(input);
      const defaults = await ctx.prisma.userDefaultInvoiceValues.upsert({
        where: { userId: ctx.session.user.id },
        update: defaultsWithEncryptedValues,
        create: { ...defaultsWithEncryptedValues, userId: ctx.session.user.id },
      });
      return defaults;
    }),
});
