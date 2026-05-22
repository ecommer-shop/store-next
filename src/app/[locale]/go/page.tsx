import { redirect } from "next/navigation";

export default function GoPage() {
  const target = process.env.REDIRECT_GO || "/sellers";
  redirect(target);
}
