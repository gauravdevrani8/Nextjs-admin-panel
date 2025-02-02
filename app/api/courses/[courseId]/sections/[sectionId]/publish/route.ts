import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, { params }: { params: { courseId: string } }) => {
  try {
    const { userId } = await auth();
    const { courseId } = params;

    if (!userId) return new Response("Unauthorized", { status: 401 });

    const course = await db.course.findUnique({
      where: { id: courseId, instructorId: userId },
      include: { sections: true },
    });

    if (!course) return new Response("Course not found", { status: 404 });

    const hasRequiredFields =
      course.title &&
      course.description &&
      course.categoryId &&
      course.subCategoryId &&
      course.price &&
      course.sections.some((s) => s.isPublished);

    if (!hasRequiredFields) {
      return new Response("Missing required fields for publishing.", { status: 400 });
    }

    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: { isPublished: true },
    });

    return NextResponse.json(updatedCourse);
  } catch (err) {
    console.error("Error publishing course:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
