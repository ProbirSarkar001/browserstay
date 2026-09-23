import { useEffect, useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

interface PdfToMarkdownPasswordDialogProps {
  open: boolean;
  fileName: string;
  error: string | null;
  isProcessing: boolean;
  onOpenChange: (open: boolean) => void;
  onClearError: () => void;
  onSubmit: (password: string) => void;
}

export function PdfToMarkdownPasswordDialog({
  open,
  fileName,
  error,
  isProcessing,
  onOpenChange,
  onClearError,
  onSubmit,
}: PdfToMarkdownPasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open) {
      setPassword("");
      setShowPassword(false);
    }
  }, [open]);

  const handleSubmit = () => {
    if (password) onSubmit(password);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Password-protected PDF</DialogTitle>
          <DialogDescription>
            "{fileName}.pdf" is encrypted. Enter its password to convert it to Markdown.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="markdown-pdf-password">Password</Label>
          <div className="relative">
            <Input
              id="markdown-pdf-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter PDF password"
              value={password}
              autoFocus
              className="pr-10"
              onChange={(e) => {
                setPassword(e.target.value);
                onClearError();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
            {password && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            )}
          </div>
          {error && (
            <p className="flex items-center gap-1.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!password || isProcessing}>
            {isProcessing ? "Converting..." : "Unlock & Convert"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
