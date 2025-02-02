import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Detect file type
    const fileType = file.type.startsWith("video/")
      ? "video"
      : file.type === "application/pdf"
      ? "raw"
      : "image";

    // Cloudinary Upload
    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "uploads", resource_type: fileType },
        (error, result) => {
          if (error || !result) {
            reject(new Error("Cloudinary upload failed"));
          } else {
            resolve(result);
          }
        }
      );

      Readable.from(buffer).pipe(stream);
    });

    return NextResponse.json({ url: uploadResult.secure_url }, { status: 200 });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
