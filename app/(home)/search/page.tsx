import CourseCard from "@/components/courses/CourseCard";
import { db } from "@/lib/db";

const SearchPage = async ({ searchParams }: { searchParams: Promise<{ query: string }> }) => {
  // Await the searchParams to resolve the Promise
  const resolvedSearchParams = await searchParams;
  const queryText = resolvedSearchParams.query || "";

  const courses = await db.course.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: queryText } },
        { category: { name: { contains: queryText } } },
        { subCategory: { name: { contains: queryText } } },
      ],
    },
    include: {
      category: true,
      subCategory: true,
      level: true,
      instructor: true, // Include instructor details
      sections: {
        where: {
          isPublished: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="px-4 py-6 md:px-10 xl:px-16">
      <p className="text-lg md:text-2xl font-semibold mb-10">
        Recommended courses for {queryText}
      </p>
      <div className="flex gap-4 flex-wrap">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
