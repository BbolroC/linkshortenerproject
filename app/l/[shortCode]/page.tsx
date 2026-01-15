import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";

type Params = Promise<{
  shortCode: string;
}>;

export default async function RedirectPage({
  params,
}: {
  params: Params;
}) {
  const { shortCode } = await params;

  // Find the link by shortCode
  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);

  // If link not found, show custom 404 page
  if (!link) {
    notFound();
  }

  // Redirect to the original URL
  redirect(link.originalUrl);
}
