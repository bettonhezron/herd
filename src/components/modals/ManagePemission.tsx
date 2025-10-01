import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Shield } from "lucide-react";

interface Permission {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface PermissionCategory {
  category: string;
  permissions: Permission[];
}

interface ManagePermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName?: string;
  onSave?: (permissions: Permission[]) => void;
}

export function ManagePermissionsModal({
  open,
  onOpenChange,
  userName,
  onSave,
}: ManagePermissionsModalProps) {
  const [permissionGroups, setPermissionGroups] = useState<
    PermissionCategory[]
  >([
    {
      category: "Animal Management",
      permissions: [
        {
          id: "animals_view",
          label: "View Animals",
          description: "View animal records and profiles",
          enabled: true,
        },
        {
          id: "animals_add",
          label: "Add Animals",
          description: "Add new animals to the herd",
          enabled: true,
        },
        {
          id: "animals_edit",
          label: "Edit Animals",
          description: "Modify animal information",
          enabled: false,
        },
        {
          id: "animals_delete",
          label: "Delete Animals",
          description: "Remove animals from the system",
          enabled: false,
        },
      ],
    },
    {
      category: "Health & Breeding",
      permissions: [
        {
          id: "health_view",
          label: "View Health Records",
          description: "Access health and medical records",
          enabled: true,
        },
        {
          id: "health_add",
          label: "Add Health Records",
          description: "Create new health records",
          enabled: true,
        },
        {
          id: "breeding_manage",
          label: "Manage Breeding",
          description: "Handle breeding and pregnancy tracking",
          enabled: false,
        },
      ],
    },
    {
      category: "Reports & Analytics",
      permissions: [
        {
          id: "reports_view",
          label: "View Reports",
          description: "Access farm reports and analytics",
          enabled: true,
        },
        {
          id: "reports_export",
          label: "Export Reports",
          description: "Download and print reports",
          enabled: false,
        },
        {
          id: "analytics_full",
          label: "Full Analytics Access",
          description: "Access all analytics features",
          enabled: false,
        },
      ],
    },
    {
      category: "System Administration",
      permissions: [
        {
          id: "users_manage",
          label: "Manage Users",
          description: "Add, edit, and remove users",
          enabled: false,
        },
        {
          id: "settings_modify",
          label: "Modify Settings",
          description: "Change farm and system settings",
          enabled: false,
        },
      ],
    },
  ]);

  const togglePermission = (categoryIndex: number, permissionIndex: number) => {
    const newGroups = [...permissionGroups];
    newGroups[categoryIndex].permissions[permissionIndex].enabled =
      !newGroups[categoryIndex].permissions[permissionIndex].enabled;
    setPermissionGroups(newGroups);
  };

  const handleSave = () => {
    const allPermissions = permissionGroups.flatMap(
      (group) => group.permissions
    );
    if (onSave) {
      onSave(allPermissions);
    } else {
      toast.success("Permissions updated successfully");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Manage Permissions
          </DialogTitle>
          <DialogDescription>
            {userName
              ? `Configure access permissions for ${userName}`
              : "Configure user access permissions"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {permissionGroups.map((group, groupIndex) => (
            <div key={group.category}>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                {group.category}
              </h3>
              <div className="space-y-4">
                {group.permissions.map((permission, permIndex) => (
                  <div
                    key={permission.id}
                    className="flex items-start justify-between space-x-4"
                  >
                    <div className="flex-1">
                      <Label
                        htmlFor={permission.id}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {permission.label}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {permission.description}
                      </p>
                    </div>
                    <Switch
                      id={permission.id}
                      checked={permission.enabled}
                      onCheckedChange={() =>
                        togglePermission(groupIndex, permIndex)
                      }
                    />
                  </div>
                ))}
              </div>
              {groupIndex < permissionGroups.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Permissions</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
