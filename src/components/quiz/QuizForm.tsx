
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QuizFormData } from "@/types/quiz-types";

const formSchema = z.object({
  gradeLevel: z.string().min(1, "Grade level is required"),
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().min(1, "Topic is required"),
  instructions: z.string().optional(),
  numberOfItems: z.coerce
    .number()
    .min(1, "Must have at least 1 item")
    .max(50, "Cannot exceed 50 items"),
  examType: z.enum([
    "identification",
    "multiple-choice",
    "true-false",
    "matching-type",
    "fill-in-the-blanks",
  ]),
});

interface QuizFormProps {
  onSubmit: (data: QuizFormData) => void;
  isLoading: boolean;
}

export const QuizForm = ({ onSubmit, isLoading }: QuizFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<QuizFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gradeLevel: "",
      subject: "",
      topic: "",
      instructions: "",
      numberOfItems: 10,
      examType: "multiple-choice",
    },
  });

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gradeLevel">Grade Level</Label>
                <Input
                  id="gradeLevel"
                  {...register("gradeLevel")}
                  placeholder="e.g. Grade 6"
                />
                {errors.gradeLevel && (
                  <p className="text-sm text-red-500">
                    {errors.gradeLevel.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  {...register("subject")}
                  placeholder="e.g. Science"
                />
                {errors.subject && (
                  <p className="text-sm text-red-500">
                    {errors.subject.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                {...register("topic")}
                placeholder="e.g. Photosynthesis"
              />
              {errors.topic && (
                <p className="text-sm text-red-500">{errors.topic.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">
                Custom Instructions (Optional)
              </Label>
              <Textarea
                id="instructions"
                {...register("instructions")}
                placeholder="e.g. Focus on the process and importance of photosynthesis"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfItems">Number of Items (1-50)</Label>
                <Input
                  id="numberOfItems"
                  type="number"
                  min={1}
                  max={50}
                  {...register("numberOfItems")}
                />
                {errors.numberOfItems && (
                  <p className="text-sm text-red-500">
                    {errors.numberOfItems.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="examType">Type of Exam</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("examType", value as QuizFormData["examType"])
                  }
                  defaultValue={watch("examType")}
                >
                  <SelectTrigger id="examType">
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="identification">Identification</SelectItem>
                    <SelectItem value="multiple-choice">
                      Multiple Choice
                    </SelectItem>
                    <SelectItem value="true-false">True or False</SelectItem>
                    <SelectItem value="matching-type">Matching Type</SelectItem>
                    <SelectItem value="fill-in-the-blanks">
                      Fill in the Blanks
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.examType && (
                  <p className="text-sm text-red-500">
                    {errors.examType.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#023d54] hover:bg-[#035c7b] text-white"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Quiz"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
