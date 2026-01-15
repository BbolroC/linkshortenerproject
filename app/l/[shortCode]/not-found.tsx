import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkIcon, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-muted p-3">
                <LinkIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">Link Not Found</CardTitle>
            <CardDescription>
              The short link you're looking for doesn't exist or may have been removed.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                Return to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
