"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLink } from "./actions";
import { Plus } from "lucide-react";

export function CreateLinkDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    originalUrl: "",
    shortCode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await createLink({
      originalUrl: formData.originalUrl,
      shortCode: formData.shortCode || undefined,
    });

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      // Success - close dialog and reset form
      setOpen(false);
      setFormData({ originalUrl: "", shortCode: "" });
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Short Link</DialogTitle>
            <DialogDescription>
              Enter the URL you want to shorten. You can optionally provide a custom short code.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="originalUrl">
                Original URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="originalUrl"
                type="url"
                placeholder="https://example.com/very/long/url"
                value={formData.originalUrl}
                onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shortCode">
                Custom Short Code <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="shortCode"
                type="text"
                placeholder="my-link"
                value={formData.shortCode}
                onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })}
                disabled={isLoading}
                minLength={3}
                maxLength={20}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to generate a random short code
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
