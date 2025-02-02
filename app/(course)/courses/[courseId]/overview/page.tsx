import { clerkClient } from "@clerk/clerk-sdk-node"; // Ensure correct import
import Image from "next/image";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ReadText from "@/components/custom/ReadText";
import SectionMenu from "@/components/layout/SectionMenu";

const CourseOverview = async ({ params }: { params: { courseId: string } }) => {
  // Fetch course with related sections
  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: { sections: { where: { isPublished: true } } },
  });

  // Redirect if course is not found or not published
  if (!course || !course.isPublished) return redirect("/");

  // Fetch instructor details safely
  let instructor = null;
  if (course.instructorId) {
    try {
      instructor = await clerkClient.users.getUser(course.instructorId);
    } catch (error) {
      console.error("Failed to fetch instructor details:", error);
    }
  }

  // Fetch course level
  const level = course.levelId
    ? await db.level.findUnique({ where: { id: course.levelId } })
    : null;

  return (
    <div className="px-6 py-4 flex flex-col gap-5 text-sm">
      {/* Header Section */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <SectionMenu course={course} />
      </div>

      {/* Subtitle */}
      {course.subtitle && <p className="font-medium">{course.subtitle}</p>}

      {/* Instructor Section */}
      <div className="flex gap-2 items-center">
        <Image
          src={instructor?.imageUrl || "/avatar_placeholder.jpg"}
          alt={instructor?.fullName || "Instructor photo"}
          width={30}
          height={30}
          className="rounded-full"
        />
        <p className="font-bold">Instructor:</p>
        <p>{instructor?.fullName || "Unknown Instructor"}</p>
      </div>

      {/* Price Section */}
      {course.price !== null && (
        <div className="flex gap-2">
          <p className="font-bold">Price:</p>
          <p>${course.price.toFixed(2)}</p>
        </div>
      )}

      {/* Level Section */}
      {level && (
        <div className="flex gap-2">
          <p className="font-bold">Level:</p>
          <p>{level.name}</p>
        </div>
      )}

      {/* Description Section */}
      {course.description && (
        <div className="flex flex-col gap-2">
          <p className="font-bold">Description:</p>
          <ReadText value={course.description} />
        </div>
      )}
    </div>
  );
};

export default CourseOverview;
