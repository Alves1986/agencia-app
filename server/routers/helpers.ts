import type { User } from "../../drizzle/schema";
import { getUserByOpenId, upsertUser } from "../db";

export async function getOperationalUserId(user: User) {
  await upsertUser({
    openId: user.openId,
    name: user.name,
    email: user.email,
    loginMethod: user.loginMethod,
    role: user.role,
    lastSignedIn: new Date(),
  });
  const storedUser = await getUserByOpenId(user.openId);
  if (!storedUser) throw new Error("Não foi possível preparar o perfil operacional.");
  return storedUser.id;
}
