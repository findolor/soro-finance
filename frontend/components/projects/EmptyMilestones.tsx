import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define form schema with Zod
const formSchema = z.object({
  name: z.string().min(1, "Milestone name is required"),
  description: z.string().min(1, "Description is required"),
  dateRange: z
    .object({
      from: z.date({ required_error: "Start date is required" }),
      to: z.date({ required_error: "End date is required" }),
    })
    .refine((data) => data.to !== undefined, {
      message: "End date is required",
      path: ["to"],
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface EmptyMilestonesProps {
  projectId: string;
  onMilestoneCreated: () => void;
}

const EmptyMilestones: FC<EmptyMilestonesProps> = ({ onMilestoneCreated }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      // TODO: Implement the actual API call to create a milestone
      // This will be implemented once the Supabase schema is set up

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Milestone Created", {
        description: `"${values.name}" has been added to your project successfully.`,
      });

      // Reset form and close dialog
      form.reset({
        name: "",
        description: "",
        dateRange: {
          from: new Date(),
          to: new Date(),
        },
      });
      setIsDialogOpen(false);

      // Notify parent component to refresh milestones
      onMilestoneCreated();
    } catch {
      toast.error("Creation Failed", {
        description:
          "There was a problem creating your milestone. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-dashed border-2 bg-muted/50">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="text-center space-y-4 max-w-md mx-auto">
          <PlusCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <h3 className="text-xl font-medium">No Milestones Yet</h3>
          <p className="text-muted-foreground">
            Break down your project into milestones to track progress and manage
            funding.
          </p>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create First Milestone
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Milestone</DialogTitle>
                <DialogDescription>
                  Add details about your project milestone. You&apos;ll be able
                  to add team members and services after creating the milestone.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6 py-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Milestone Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Initial Research & Planning"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timeline</FormLabel>
                        <FormControl>
                          <DatePickerWithRange
                            date={field.value}
                            onDateChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>
                          Select the start and end dates for this milestone
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Development Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what will be accomplished during this milestone"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || form.formState.isSubmitting}
                    >
                      {isSubmitting ? "Creating..." : "Create Milestone"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyMilestones;
