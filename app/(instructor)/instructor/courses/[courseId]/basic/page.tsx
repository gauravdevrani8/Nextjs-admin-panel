import EditCourseForm from "@/components/courses/EditCourseForm";
import AlertBanner from "@/components/custom/AlertBanner";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

const CourseBasics = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const course = await db.course.findUnique({
    where: { id: params.courseId, instructorId: userId },
    include: { sections: true },
  });

  if (!course) {
    redirect("/instructor/courses");
  }

  const categories = await db.category.findMany({ orderBy: { name: "asc" }, include: { subCategories: true } });
  const levels = await db.level.findMany();

  return (
    <div className="px-10">
      <AlertBanner isCompleted={true} missingFieldsCount={0} requiredFieldsCount={0} />
      <EditCourseForm
        course={course}
        categories={categories.map(category => ({
          label: category.name,
          value: category.id,
          subCategories: category.subCategories.map(subcategory => ({
            label: subcategory.name,
            value: subcategory.id,
          })),
        }))}
        levels={levels.map(level => ({ label: level.name, value: level.id }))}
        isCompleted={true}
      />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="bg-red-500 text-white px-4 py-2 rounded">Delete Course</button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <p className="text-lg font-bold">Are you sure?</p>
            <p className="text-sm text-gray-600">This action cannot be undone.</p>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 text-white">Confirm Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseBasics;
