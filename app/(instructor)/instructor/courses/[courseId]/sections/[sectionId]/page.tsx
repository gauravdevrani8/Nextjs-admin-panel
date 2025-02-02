import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AlertBanner from "@/components/custom/AlertBanner";
import EditSectionForm from "@/components/sections/EditSectionForm";

const SectionDetailsPage = async ({ params }: { params: { courseId: string; sectionId: string } }) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const { courseId, sectionId } = params;
  const course = await db.course.findUnique({ where: { id: courseId, instructorId: userId } });
  if (!course) return redirect("/instructor/courses");

  const section = await db.section.findUnique({ where: { id: sectionId, courseId }, include: { muxData: true, resources: true } });
  if (!section) return redirect(`/instructor/courses/${courseId}/sections`);

  return (
    <div className="px-10">
      <AlertBanner isCompleted={true} requiredFieldsCount={0} missingFieldsCount={0} />
      <EditSectionForm section={section} courseId={courseId} isCompleted={true} />
    </div>
  );
};

export default SectionDetailsPage;
