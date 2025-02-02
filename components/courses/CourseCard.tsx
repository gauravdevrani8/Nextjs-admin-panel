import { Gem } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CourseCardProps {
  course: {
    id: string;
    title: string | null;
    imageUrl: string | null;
    price: number | null;
    instructor?: {
      fullName: string | null;
      imageUrl: string | null;
    };
    level?: {
      name: string | null;
    };
  };
}

const CourseCard = ({ course }: CourseCardProps) => {
  const { instructor, level } = course;

  return (
    <Link
      href={`/courses/${course.id}/overview`}
      className="border rounded-lg cursor-pointer"
    >
      <Image
        src={course.imageUrl || "/image_placeholder.webp"}
        alt={course.title || "Course image"}
        width={500}
        height={300}
        className="rounded-t-xl w-[320px] h-[180px] object-cover"
      />

      <div className="px-4 py-3 flex flex-col gap-2">
        <h2 className="text-lg font-bold hover:text-[#FDAB04]">
          {course.title || "Untitled Course"}
        </h2>

        <div className="flex justify-between text-sm font-medium">
          {instructor ? (
            <div className="flex gap-2 items-center">
              <Image
                src={instructor.imageUrl || "/avatar_placeholder.jpg"}
                alt={instructor.fullName || "Instructor photo"}
                width={30}
                height={30}
                className="rounded-full"
              />
              <p>{instructor.fullName || "Unknown Instructor"}</p>
            </div>
          ) : (
            <div className="text-gray-500">Instructor not found</div>
          )}

          {level ? (
            <div className="flex gap-2 items-center">
              <Gem size={20} />
              <p>{level.name || "Unknown Level"}</p>
            </div>
          ) : (
            <div className="text-gray-500">Level not specified</div>
          )}
        </div>

        <p className="text-sm font-bold">${course.price || "N/A"}</p>
      </div>
    </Link>
  );
};

export default CourseCard;
