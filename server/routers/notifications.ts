import { z } from "zod";
import { listNotifications, markAllNotificationsRead, markNotificationRead } from "../db";
import { protectedProcedure, router } from "../_core/trpc";
import { getOperationalUserId } from "./helpers";

export const notificationsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => listNotifications(await getOperationalUserId(ctx.user))),
  markRead: protectedProcedure
    .input(z.object({ notificationId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await markNotificationRead(await getOperationalUserId(ctx.user), input.notificationId);
      return { success: true } as const;
    }),
  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    await markAllNotificationsRead(await getOperationalUserId(ctx.user));
    return { success: true } as const;
  }),
});
