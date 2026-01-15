import { config } from "dotenv";
import { join } from "path";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// Load environment variables BEFORE any other imports
config({ path: join(process.cwd(), ".env") });

// Verify DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in .env.local");
  process.exit(1);
}

// Import schema after env is loaded
import { links } from "@/db/schema";
import type { NewLink } from "@/db/schema";

async function seedExampleLinks(): Promise<void> {
  // Initialize database connection directly
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);
  
  const userId = "user_386KOP9gzMqfy9qehzCrUlqVoYt";
  
  const exampleLinks: Omit<NewLink, "id" | "createdAt" | "updatedAt">[] = [
    { userId, shortCode: "gh2024", originalUrl: "https://github.com/trending" },
    { userId, shortCode: "docs-next", originalUrl: "https://nextjs.org/docs" },
    { userId, shortCode: "tw-css", originalUrl: "https://tailwindcss.com/docs/installation" },
    { userId, shortCode: "clerk-auth", originalUrl: "https://clerk.com/docs/quickstarts/nextjs" },
    { userId, shortCode: "drizzle-orm", originalUrl: "https://orm.drizzle.team/docs/overview" },
    { userId, shortCode: "shadcn-ui", originalUrl: "https://ui.shadcn.com/docs/components/button" },
    { userId, shortCode: "neon-db", originalUrl: "https://neon.tech/docs/introduction" },
    { userId, shortCode: "ts-docs", originalUrl: "https://www.typescriptlang.org/docs/" },
    { userId, shortCode: "react-new", originalUrl: "https://react.dev/blog/2024/12/05/react-19" },
    { userId, shortCode: "vercel-deploy", originalUrl: "https://vercel.com/docs/deployments/overview" },
  ];

  try {
    console.log("Inserting example links...");
    
    const insertedLinks = await db
      .insert(links)
      .values(exampleLinks)
      .returning();
    
    console.log(`✅ Successfully inserted ${insertedLinks.length} links`);
    console.table(insertedLinks.map(link => ({
      id: link.id,
      shortCode: link.shortCode,
      originalUrl: link.originalUrl.substring(0, 40) + "...",
    })));
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error inserting links:", error);
    process.exit(1);
  }
}

seedExampleLinks();