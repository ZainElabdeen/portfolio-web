"use client";

import { useRef, useState, useTransition, useActionState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadImage, deleteImage, UploadResult } from "@/actions/upload.action";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  className?: string;
  disabled?: boolean;
}

const initialState: UploadResult = { success: false };

export function ImageUpload({
  value,
  onChange,
  onRemove,
  className,
  disabled = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const [state, formAction] = useActionState(
    async (_prevState: UploadResult, formData: FormData): Promise<UploadResult> => {
      const result = await uploadImage(formData);
      if (result.success && result.url) {
        onChange(result.url);
        setPreview(null);
      }
      return result;
    },
    initialState
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Upload using React 19 form action
    const formData = new FormData();
    formData.append("file", file);

    startTransition(() => {
      formAction(formData);
    });
  };

  const handleRemove = async () => {
    if (!value) return;

    setIsDeleting(true);
    try {
      // Only delete from Supabase if it's a Supabase URL
      if (value.includes("supabase")) {
        await deleteImage(value);
      }
      onChange("");
      onRemove?.();
      setPreview(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClick = () => {
    if (!disabled && !isPending) {
      inputRef.current?.click();
    }
  };

  const displayUrl = preview || value;
  const isLoading = isPending || isDeleting;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        onChange={handleFileSelect}
        disabled={disabled || isLoading}
        className="hidden"
      />

      {displayUrl ? (
        <div className="relative group">
          <div className="relative w-full h-40 rounded-lg overflow-hidden border bg-muted">
            <Image
              src={displayUrl}
              alt="Upload preview"
              fill
              className="object-cover"
            />
            {isPending && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
                <span className="ml-2 text-white text-sm">Uploading...</span>
              </div>
            )}
          </div>
          {!isLoading && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled || isLoading}
          className={cn(
            "flex flex-col items-center justify-center w-full h-40 rounded-lg border-2 border-dashed transition-colors",
            "hover:border-primary hover:bg-muted/50",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isLoading && "cursor-wait"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">
                Click to upload image
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                JPEG, PNG, WebP, SVG (max 5MB)
              </span>
            </>
          )}
        </button>
      )}

      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
    </div>
  );
}
