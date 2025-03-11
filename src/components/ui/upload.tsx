"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload as UploadIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpload } from "@/hooks/use-upload";
import { Button } from "./button";

interface UploadProps {
  value?: string;
  onChange?: (url: string) => void;
  onRemove?: () => void;
  className?: string;
}

export function Upload({ value, onChange, onRemove, className }: UploadProps) {
  const [error, setError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading } = useUpload({
    onSuccess: (url) => {
      setError(undefined);
      onChange?.(url);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("请选择图片文件");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("文件大小不能超过 10MB");
      return;
    }

    try {
      await upload(file);
    } catch (error) {
      // 错误已在 onError 中处理
    }

    // 清空 input 值，允许重复上传相同文件
    e.target.value = "";
  };

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <Image
            src={value}
            alt="上传预览"
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <button
            type="button"
            className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="relative aspect-video w-full"
          onClick={handleClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              上传中...
            </>
          ) : (
            <>
              <UploadIcon className="mr-2 h-4 w-4" />
              点击上传图片
            </>
          )}
        </Button>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
} 