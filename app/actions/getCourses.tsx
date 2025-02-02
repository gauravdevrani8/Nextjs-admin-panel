import { db } from "@/lib/db";
import { Course } from "@prisma/client";

const getCoursesByCategory = async (categoryId: string | null): Promise<Course[]> => {
  return await db.course.findMany({
    where: { ...(categoryId ? { categoryId, isPublished: true } : { isPublished: true }) },
    include: { category: true, subCategory: true, level: true, sections: { where: { isPublished: true } } },
    orderBy: { createdAt: "desc" },
  });
};

export default getCoursesByCategory;
