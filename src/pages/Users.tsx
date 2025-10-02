import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  UserCheck,
  Shield,
  User,
  Edit3,
  Trash2,
  Stethoscope,
  Users,
  Briefcase,
  ToggleLeft, // Icon for Deactivate
  ToggleRight, // Icon for Activate
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmModal } from "@/components/modals/DeleteConfirmModal";
import { AddUserModal } from "@/components/modals/AddUserModal";
import { ManagePermissionsModal } from "@/components/modals/ManagePemission";

import {
  useUsers,
  useUpdateUser,
  useDeleteUser,
  useUserStats,
  useActivateUser, // <-- NEW
  useDeactivateUser, // <-- NEW
  userKeys,
} from "@/hooks/useUser";
import { useRegister } from "@/hooks/useAuth";
import { User as UserType } from "@/types/user";
import { formatLastLogin } from "@/lib/timeUtils";

interface StatCard {
  title: string;
  value: number;
  icon: React.ElementType;
  change: string;
}

export default function UserManagement() {
  const queryClient = useQueryClient();
  const { data: users = [], isPending } = useUsers();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const registerMutation = useRegister();
  const activateUserMutation = useActivateUser(); // <-- NEW
  const deactivateUserMutation = useDeactivateUser(); // <-- NEW
  const { data, isLoading, isError } = useUserStats();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserType | null>(null);
  const [permissionsUser, setPermissionsUser] = useState<UserType | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserType | null>(null);

  const stats: StatCard[] = [
    {
      title: "Total Users",
      value: data?.totalUsers ?? 0,
      icon: Users,
      change: "All staff members",
    },
    {
      title: "Active Users",
      value: data?.activeUsers ?? 0,
      icon: UserCheck,
      change: "Currently active staff",
    },
    {
      title: "Admin Users",
      value: data?.adminUsers ?? 0,
      icon: Shield,
      change: "Users with admin access",
    },
    {
      title: "Worker Users",
      value: data?.workerUsers ?? 0,
      icon: Briefcase,
      change: "General farm workers",
    },
  ];

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === "all" || user.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, selectedRole]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="w-4 h-4" />;
      case "MANAGER":
        return <UserCheck className="w-4 h-4" />;
      case "WORKER":
        return <User className="w-4 h-4" />;
      case "VETERINARIAN":
        return <Stethoscope className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "MANAGER":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "WORKER":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "VETERINARIAN":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusColor = (status: string) =>
    status === "ACTIVE"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";

  const handleSaveUser = (payload: any, isUpdate: boolean) => {
    const onSuccessHandler = () => {
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    };

    if (isUpdate && editUser) {
      updateUserMutation.mutate(
        { id: editUser.id, payload },
        { onSuccess: onSuccessHandler }
      );
    } else {
      registerMutation.mutate(payload, { onSuccess: onSuccessHandler });
    }
  };

  const handleActivateDeactivate = (user: UserType) => {
    const onSuccessHandler = () => {
      // Invalidate stats to update Active Users count
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    };

    if (user.status === "ACTIVE") {
      deactivateUserMutation.mutate(user.id, { onSuccess: onSuccessHandler });
    } else {
      activateUserMutation.mutate(user.id, { onSuccess: onSuccessHandler });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2">
            User Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage farm staff, roles, and access permissions
          </p>
        </div>

        <Button
          className="gap-2 px-3 py-2 self-start sm:self-auto text-sm sm:text-base bg-primary hover:bg-primary-hover"
          onClick={() => setAddUserOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-4 text-muted-foreground">
            Loading user statistics...
          </div>
        ) : isError ? (
          <div className="col-span-full text-center py-4 text-red-500">
            Error loading user statistics.
          </div>
        ) : (
          stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Directory</CardTitle>
          <CardDescription>
            View and manage all farm staff members and their access levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search users by name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">All Roles</option>
              <option value="ADMIN">Administrators</option>
              <option value="MANAGER">Managers</option>
              <option value="VETERINARIAN">Veterinarians</option>
              <option value="WORKER">Workers</option>
            </select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.photoUrl || undefined}
                            alt={user.firstName}
                          />
                          <AvatarFallback>
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{user.email}</TableCell>

                    <TableCell>
                      <Badge className={`gap-1 ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {user.role}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {formatLastLogin(user.lastLogin)}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditUser(user)}>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setPermissionsUser(user)}
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Manage Permissions
                          </DropdownMenuItem>

                          {/* Conditional Activate/Deactivate Item */}
                          <DropdownMenuItem
                            onClick={() => handleActivateDeactivate(user)}
                          >
                            {user.status === "ACTIVE" ? (
                              <>
                                <ToggleRight className="w-4 h-4 mr-2" />
                                Deactivate User
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-4 h-4 mr-2" />
                                Activate User
                              </>
                            )}
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteUser(user)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No users found matching your search criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AddUserModal
        open={addUserOpen}
        onOpenChange={setAddUserOpen}
        onSave={handleSaveUser}
      />
      <AddUserModal
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
        user={editUser}
        onSave={handleSaveUser}
      />
      <ManagePermissionsModal
        open={!!permissionsUser}
        onOpenChange={(open) => !open && setPermissionsUser(null)}
        userName={permissionsUser?.firstName}
      />
      <DeleteConfirmModal
        open={!!deleteUser}
        onOpenChange={(open) => !open && setDeleteUser(null)}
        title="Delete User"
        description={`Are you sure you want to delete ${deleteUser?.firstName}? This action cannot be undone.`}
        onConfirm={() => {
          if (deleteUser) {
            deleteUserMutation.mutate(deleteUser.id, {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: userKeys.stats() });
                queryClient.invalidateQueries({ queryKey: userKeys.lists() });
                setDeleteUser(null);
              },
            });
          }
        }}
      />
    </div>
  );
}
