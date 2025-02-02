import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, { params }: { params: { courseId?: string } }) => {
  try {
    const { userId } = await auth();
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const course = await db.course.findUnique({ where: { id: params?.courseId, instructorId: userId }, include: { sections: true } });
    if (!course) return new Response("Course not found", { status: 404 });

    const publishedCourse = await db.course.update({ where: { id: params?.courseId, instructorId: userId }, data: { isPublished: true } });

    return NextResponse.json(publishedCourse, { status: 200 });
  } catch (err) {
    console.error("[courseId_publish_POST]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
