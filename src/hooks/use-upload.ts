import { useState } from "react";

interface UploadOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

export function useUpload(options: UploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (file: File) => {
    try {
      setIsUploading(true);

      // 获取预签名上传 URL
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!response.ok) {
        throw new Error("获取上传 URL 失败");
      }

      const { url, fields, key } = await response.json();

      // 准备表单数据
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append("file", file);

      // 上传文件到 S3
      const uploadResponse = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("文件上传失败");
      }

      // 构建完整的文件 URL
      const fileUrl = `${process.env.NEXT_PUBLIC_AWS_S3_URL}/${key}`;
      options.onSuccess?.(fileUrl);

      return fileUrl;
    } catch (error) {
      console.error("Upload error:", error);
      options.onError?.(error as Error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    upload,
    isUploading,
  };
} 