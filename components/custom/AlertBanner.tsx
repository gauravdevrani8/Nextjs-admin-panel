import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Rocket, TriangleAlert } from "lucide-react";

interface AlertBannerProps {
  isCompleted: boolean;
  requiredFieldsCount: number;
  missingFieldsCount: number;
}

const AlertBanner = ({
  isCompleted,
  requiredFieldsCount,
  missingFieldsCount,
}: AlertBannerProps) => {
  console.log("Missing Fields Count:", missingFieldsCount);

  return (
    <Alert className="my-4" variant={isCompleted ? "complete" : "destructive"}>
      <div className="flex items-center">
        {isCompleted ? (
          <Rocket className="h-4 w-4" />
        ) : (
          <TriangleAlert className="h-4 w-4" />
        )}
        <div className="ml-2">
          <AlertTitle className="text-xs font-medium">
            {missingFieldsCount} missing field(s) / {requiredFieldsCount} required fields
          </AlertTitle>
          <AlertDescription className="text-xs">
            {isCompleted
              ? "Great job! Ready to publish"
              : "You can only publish when all the required fields are completed"}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default AlertBanner;
