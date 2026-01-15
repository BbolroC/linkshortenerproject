"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createLinkInDb, updateLinkInDb, deleteLinkInDb } from "@/data/links";
import { revalidatePath } from "next/cache";

// Define input type
type CreateLinkInput = {
  originalUrl: string;
  shortCode?: string;
};

type UpdateLinkInput = {
  id: number;
  originalUrl: string;
  shortCode: string;
};

type DeleteLinkInput = {
  id: number;
};

// Define validation schema
const createLinkSchema = z.object({
  originalUrl: z.string().url("Please enter a valid URL"),
  shortCode: z.string().min(3, "Short code must be at least 3 characters").max(20, "Short code must be at most 20 characters").optional(),
});

const updateLinkSchema = z.object({
  id: z.number().int().positive(),
  originalUrl: z.string().url("Please enter a valid URL"),
  shortCode: z.string().min(3, "Short code must be at least 3 characters").max(20, "Short code must be at most 20 characters"),
});

const deleteLinkSchema = z.object({
  id: z.number().int().positive(),
});

// Server action to create a new link
export async function createLink(input: CreateLinkInput) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }
    
    // Validate input
    const result = createLinkSchema.safeParse(input);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const errorMessage = errors.originalUrl?.[0] || errors.shortCode?.[0] || "Invalid input data";
      return { error: errorMessage };
    }
    
    // Use helper function for DB operation
    const link = await createLinkInDb(userId, result.data);
    
    // Revalidate the dashboard page to show the new link
    revalidatePath("/dashboard");
    
    return { success: true, link };
  } catch (error) {
    console.error("Error creating link:", error);
    
    // Check for unique constraint violation (duplicate short code)
    if (error instanceof Error && error.message.includes("unique")) {
      return { error: "This short code is already taken. Please try another one." };
    }
    
    return { error: "Failed to create link. Please try again." };
  }
}

// Server action to update an existing link
export async function updateLink(input: UpdateLinkInput) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }
    
    // Validate input
    const result = updateLinkSchema.safeParse(input);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const errorMessage = errors.originalUrl?.[0] || errors.shortCode?.[0] || "Invalid input data";
      return { error: errorMessage };
    }
    
    // Use helper function for DB operation
    const link = await updateLinkInDb(userId, result.data.id, {
      originalUrl: result.data.originalUrl,
      shortCode: result.data.shortCode,
    });
    
    if (!link) {
      return { error: "Link not found or you don't have permission to edit it" };
    }
    
    // Revalidate the dashboard page to show the updated link
    revalidatePath("/dashboard");
    
    return { success: true, link };
  } catch (error) {
    console.error("Error updating link:", error);
    
    // Check for unique constraint violation (duplicate short code)
    if (error instanceof Error && error.message.includes("unique")) {
      return { error: "This short code is already taken. Please try another one." };
    }
    
    return { error: "Failed to update link. Please try again." };
  }
}

// Server action to delete a link
export async function deleteLink(input: DeleteLinkInput) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }
    
    // Validate input
    const result = deleteLinkSchema.safeParse(input);
    if (!result.success) {
      return { error: "Invalid input data" };
    }
    
    // Use helper function for DB operation
    const deleted = await deleteLinkInDb(userId, result.data.id);
    
    if (!deleted) {
      return { error: "Link not found or you don't have permission to delete it" };
    }
    
    // Revalidate the dashboard page to remove the deleted link
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting link:", error);
    return { error: "Failed to delete link. Please try again." };
  }
}
