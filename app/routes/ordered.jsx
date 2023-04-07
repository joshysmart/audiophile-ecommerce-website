import { redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/sessions.server";

export const loader = async ({ request }) => {
  const user = await getUser(request);

  await db.cartItem.deleteMany({
    where: {
      userId: {
        equals: user?.id,
      },
    },
  });
  console.log("I run o");
  return redirect("/");
};
