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
import { deleteLink } from "./actions";
import { Trash2 } from "lucide-react";
import type { Link } from "@/db/schema";

type DeleteLinkDialogProps = {
  link: Link;
};

export function DeleteLinkDialog({ link }: DeleteLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    const result = await deleteLink({ id: link.id });

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      // Success - close dialog
      setOpen(false);
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Link</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this link? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <div className="space-y-2 p-4 bg-muted rounded-md">
            <div className="font-mono text-sm break-all">
              <span className="font-semibold">Short Code:</span> {link.shortCode}
            </div>
            <div className="text-sm break-all">
              <span className="font-semibold">URL:</span> {link.originalUrl}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setOpen(false);
              setError(null);
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
