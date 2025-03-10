"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import useWallet from "@/lib/hooks/useWallet";
import useAppStore from "@/lib/store/app";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Database } from "@/lib/supabase/types";

// Define social media platforms
const SOCIAL_MEDIA_PLATFORMS = [
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "github", label: "GitHub" },
  { value: "discord", label: "Discord" },
  { value: "telegram", label: "Telegram" },
];

// Types
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type SocialMediaLink = {
  platform: string;
  url: string;
};

// Form values type
type FormValues = {
  projectName: string;
  projectDescription: string;
  scfLink: string;
  socialMediaLinks: SocialMediaLink[];
  email: string;
};

const CreateProjectPage: FC = () => {
  const { connect, disconnect, walletAddress, isConnected } = useWallet();
  const { loading } = useAppStore();
  const router = useRouter();

  // Review dialog state
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    defaultValues: {
      projectName: "",
      projectDescription: "",
      scfLink: "",
      socialMediaLinks: [{ platform: "twitter", url: "" }],
      email: "",
    },
  });

  // Add new social media input field
  const addSocialMediaField = () => {
    const currentLinks = form.getValues("socialMediaLinks");
    form.setValue("socialMediaLinks", [
      ...currentLinks,
      { platform: "twitter", url: "" },
    ]);
  };

  // Remove social media link at specific index
  const removeSocialMediaLink = (index: number) => {
    const currentLinks = form.getValues("socialMediaLinks");
    if (currentLinks.length > 1) {
      const updatedLinks = [...currentLinks];
      updatedLinks.splice(index, 1);
      form.setValue("socialMediaLinks", updatedLinks);
    }
  };

  // Handle form submission
  const onSubmit = () => {
    setShowReviewDialog(true);
  };

  // Handle project creation after review
  const handleCreateProject = async () => {
    try {
      const supabase = createClient();

      // Get form data
      const formData = form.getValues();

      // Create project data object using Supabase types
      const projectData: ProjectInsert = {
        name: formData.projectName,
        description: formData.projectDescription,
        scf_link: formData.scfLink || null,
        social_media_links: formData.socialMediaLinks.filter(
          (link) => link.url.trim() !== ""
        ),
        email: formData.email,
        wallet_address: walletAddress!,
      };

      const { data, error } = await supabase
        .from("projects")
        .insert(projectData)
        .select("id")
        .single();

      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error("No data returned from project creation");
      }

      // Close dialog
      setShowReviewDialog(false);

      router.push(`/projects/${data.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  // Get platform display name
  const getPlatformDisplayName = (platform: string) => {
    return (
      SOCIAL_MEDIA_PLATFORMS.find((p) => p.value === platform)?.label ||
      platform
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800">Create Project</h1>

      {isConnected ? (
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
            <CardDescription>Connected wallet: {walletAddress}</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent>
                <div className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="projectName"
                    rules={{ required: "Project name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your project name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projectDescription"
                    rules={{ required: "Project description is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your project in detail..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="scfLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SCF Project Link (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid w-full items-center gap-1.5">
                    <Label>Social Media Profiles</Label>
                    {form.watch("socialMediaLinks").map((link, index) => (
                      <div key={index} className="flex gap-2 mb-3">
                        <Select
                          value={link.platform}
                          onValueChange={(value) => {
                            const currentLinks =
                              form.getValues("socialMediaLinks");
                            const updatedLinks = [...currentLinks];
                            updatedLinks[index] = {
                              ...updatedLinks[index],
                              platform: value,
                            };
                            form.setValue("socialMediaLinks", updatedLinks);
                          }}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            {SOCIAL_MEDIA_PLATFORMS.map((platform) => (
                              <SelectItem
                                key={platform.value}
                                value={platform.value}
                              >
                                {platform.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Input
                          value={link.url}
                          onChange={(e) => {
                            const currentLinks =
                              form.getValues("socialMediaLinks");
                            const updatedLinks = [...currentLinks];
                            updatedLinks[index] = {
                              ...updatedLinks[index],
                              url: e.target.value,
                            };
                            form.setValue("socialMediaLinks", updatedLinks);
                          }}
                          placeholder={`${getPlatformDisplayName(
                            link.platform
                          )} URL`}
                          className="flex-1"
                        />

                        {form.watch("socialMediaLinks").length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSocialMediaLink(index)}
                            type="button"
                            className="px-2"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addSocialMediaField}
                      type="button"
                      className="mt-2 w-full"
                    >
                      Add Social Media Link
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between mt-6">
                <Button variant="outline" onClick={disconnect} type="button">
                  Disconnect Wallet
                </Button>
                <Button type="submit">Create Project</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Wallet Connection Required</CardTitle>
            <CardDescription>
              Please connect your wallet to create a project
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              onClick={connect}
              disabled={loading}
              className="cursor-pointer"
            >
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Project Details</DialogTitle>
            <DialogDescription>
              Please review your project details before submitting
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Project Name</h4>
              <p className="text-sm text-gray-500">
                {form.getValues("projectName")}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Project Description</h4>
              <p className="text-sm text-gray-500 whitespace-pre-line">
                {form.getValues("projectDescription")}
              </p>
            </div>

            {form.getValues("scfLink") && (
              <div className="space-y-2">
                <h4 className="font-medium">SCF Project Link</h4>
                <p className="text-sm text-gray-500">
                  {form.getValues("scfLink")}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="font-medium">Social Media Profiles</h4>
              {form
                .getValues("socialMediaLinks")
                .filter((link) => link.url.trim() !== "").length > 0 ? (
                <ul className="list-disc pl-5 text-sm text-gray-500">
                  {form
                    .getValues("socialMediaLinks")
                    .filter((link) => link.url.trim() !== "")
                    .map((link, index) => (
                      <li key={index}>
                        {getPlatformDisplayName(link.platform)}: {link.url}
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">None provided</p>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Email</h4>
              <p className="text-sm text-gray-500">{form.getValues("email")}</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReviewDialog(false)}
            >
              Back to Edit
            </Button>
            <Button onClick={handleCreateProject}>Confirm & Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateProjectPage;
