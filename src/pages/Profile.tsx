import { useState, useEffect } from "react";
import { Camera, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { useMe } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

const updateProfileApi = async (data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) {
        resolve({ message: "Profile update successful" });
      } else {
        reject(new Error("Failed to connect to the server."));
      }
    }, 1000);
  });
};

// Skeleton Component for the Profile Page
const ProfileSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-10 w-64" />
    <Skeleton className="h-5 w-96" />

    <div className="grid gap-6 md:grid-cols-3">
      {/* Skeleton for Profile Photo Card */}
      <Card className="md:col-span-1">
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>

      {/* Skeleton for Personal Information Card */}
      <Card className="md:col-span-2">
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-24 w-full" />
          </div>

          <div className="flex justify-end space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function Profile() {
  const { isLoading: isMeLoading } = useMe();
  const storedUser = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    location: "",
    bio: "",
  });

  useEffect(() => {
    if (storedUser) {
      setFormData({
        firstName: storedUser.firstName || "",
        lastName: storedUser.lastName || "",
        email: storedUser.email || "",
        phoneNumber: storedUser.phoneNumber || "",
        location: "",
        bio: "",
      });
    }
  }, [storedUser]);

  const updateProfileMutation = useMutation({
    mutationFn: updateProfileApi,

    onMutate: () => {
      toast.info("Saving changes...", { id: "profile-update" });
    },

    onSuccess: () => {
      toast.success("Profile updated successfully!", { id: "profile-update" });
    },

    onError: (error: Error) => {
      toast.error(`Error: ${error.message || "Failed to update profile."}`, {
        id: "profile-update",
      });
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return (
      `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "GU"
    );
  };

  const initials = getInitials(formData.firstName, formData.lastName);
  const isSaving = updateProfileMutation.isPending;
  const isDisabled = isMeLoading || isSaving;
  const photoUrl = storedUser?.photoUrl || "/avatars/farm-manager.png";

  if (isMeLoading && !storedUser) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
            <CardDescription>Update your profile picture</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={photoUrl} alt={formData.firstName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" className="w-full">
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  disabled={isDisabled}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  disabled={isDisabled}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  value={formData.email}
                  disabled={isDisabled}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  className="pl-10"
                  value={formData.phoneNumber}
                  disabled={isDisabled}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  className="pl-10"
                  value={formData.location}
                  disabled={isDisabled}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={4}
                value={formData.bio}
                disabled={isDisabled}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" disabled={isDisabled}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isDisabled}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
