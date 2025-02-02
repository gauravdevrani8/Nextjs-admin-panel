"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const PublishButton = ({ disabled, courseId, isPublished }: { disabled: boolean; courseId: string; isPublished: boolean }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    setIsLoading(true);
    try {
      await axios.post(`/api/courses/${courseId}/${isPublished ? "unpublish" : "publish"}`);
      toast.success(`Course ${isPublished ? "unpublished" : "published"} successfully!`);
      router.refresh();
    } catch (err) {
      toast.error("Failed to update publish state.");
    } finally {
      setIsLoading(false);
    }
  };

  return <Button variant="outline" disabled={disabled || isLoading} onClick={onClick}>{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isPublished ? "Unpublish" : "Publish"}</Button>;
};

export default PublishButton;
