import { db } from "@/db";
import { links } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import type { Link } from "@/db/schema";

/**
 * Generate a random short code for a link
 */
function generateShortCode(length: number = 6): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Fetch all links for a specific user
 */
export async function getUserLinks(userId: string): Promise<Link[]> {
  try {
    const userLinks = await db
      .select()
      .from(links)
      .where(eq(links.userId, userId))
      .orderBy(desc(links.updatedAt));
    
    return userLinks;
  } catch (error) {
    console.error("Error fetching user links:", error);
    throw error;
  }
}

/**
 * Create a new link for a user
 */
export async function createLinkInDb(
  userId: string,
  data: { originalUrl: string; shortCode?: string }
): Promise<Link> {
  try {
    const shortCode = data.shortCode || generateShortCode();
    
    const [link] = await db
      .insert(links)
      .values({
        userId,
        originalUrl: data.originalUrl,
        shortCode,
      })
      .returning();
    
    return link;
  } catch (error) {
    console.error("Error creating link:", error);
    throw error;
  }
}

/**
 * Update an existing link for a user
 */
export async function updateLinkInDb(
  userId: string,
  linkId: number,
  data: { originalUrl: string; shortCode: string }
): Promise<Link | null> {
  try {
    const [updatedLink] = await db
      .update(links)
      .set({
        originalUrl: data.originalUrl,
        shortCode: data.shortCode,
        updatedAt: sql`now()`,
      })
      .where(and(eq(links.id, linkId), eq(links.userId, userId)))
      .returning();
    
    return updatedLink || null;
  } catch (error) {
    console.error("Error updating link:", error);
    throw error;
  }
}

/**
 * Delete a link for a user
 */
export async function deleteLinkInDb(
  userId: string,
  linkId: number
): Promise<boolean> {
  try {
    const [deletedLink] = await db
      .delete(links)
      .where(and(eq(links.id, linkId), eq(links.userId, userId)))
      .returning();
    
    return !!deletedLink;
  } catch (error) {
    console.error("Error deleting link:", error);
    throw error;
  }
}
