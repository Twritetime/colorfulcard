import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "@/lib/auth";
import { createPresignedUploadUrl } from "@/lib/s3";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      );
    }

    const { filename, contentType } = await request.json();

    if (!filename || !contentType || !contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "无效的文件类型" },
        { status: 400 }
      );
    }

    // 生成唯一的文件名
    const ext = filename.split(".").pop();
    const key = `uploads/${uuidv4()}.${ext}`;

    // 获取预签名上传 URL
    const { url, fields } = await createPresignedUploadUrl(key);

    return NextResponse.json({
      url,
      fields,
      key,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "获取上传 URL 失败" },
      { status: 500 }
    );
  }
} 