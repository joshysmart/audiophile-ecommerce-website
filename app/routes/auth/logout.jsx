import { redirect } from "remix";
import {logout} from "~/utils/sessions.server";

export const action = async ({request}) => {
  return logout(request)
}

export const loader = async () => {
  return redirect("/")
}
