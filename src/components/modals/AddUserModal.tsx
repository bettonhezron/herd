import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { User, UserRole } from "@/types/user";
import { RegisterPayload, UpdateUserPayload } from "@/types/auths";

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSave: (
    payload: RegisterPayload | UpdateUserPayload,
    isUpdate: boolean
  ) => void;
}

// Shared form data type
type UserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password?: string;
  role: UserRole;
};

type FormErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
};

export function AddUserModal({
  open,
  onOpenChange,
  user,
  onSave,
}: AddUserModalProps) {
  const initialFormData: UserFormData = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "WORKER",
  };

  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber ?? "",
        role: user.role,
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
    setTouched({});
  }, [user, open]);

  // Validation functions
  const validateName = (
    name: string,
    fieldName: string
  ): string | undefined => {
    if (!name.trim()) {
      return `${fieldName} is required`;
    }
    if (name.trim().length < 3) {
      return `${fieldName} must be at least 3 characters`;
    }
    if (/\d/.test(name)) {
      return `${fieldName} cannot contain numbers`;
    }
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return undefined;
  };

  const validatePhoneNumber = (phone?: string): string | undefined => {
    if (!phone || !phone.trim()) {
      return undefined; // Phone is optional
    }
    if (phone.length > 10) {
      return "Phone number cannot exceed 10 digits";
    }
    if (!/^\d+$/.test(phone)) {
      return "Phone number must contain only digits";
    }
    return undefined;
  };

  const validatePassword = (password?: string) => {
    if (!password) {
      return { error: "Password is required", checks: null };
    }

    const checks = {
      length: password.length >= 8,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const isValid = Object.values(checks).every((check) => check);

    return {
      error: isValid ? undefined : "Password does not meet requirements",
      checks,
    };
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    newErrors.firstName = validateName(formData.firstName, "First name");
    newErrors.lastName = validateName(formData.lastName, "Last name");
    newErrors.email = validateEmail(formData.email);
    newErrors.phoneNumber = validatePhoneNumber(formData.phoneNumber);

    if (!user) {
      const passwordValidation = validatePassword(formData.password);
      newErrors.password = passwordValidation.error;
    }

    // Remove undefined errors
    Object.keys(newErrors).forEach((key) => {
      if (newErrors[key as keyof FormErrors] === undefined) {
        delete newErrors[key as keyof FormErrors];
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    // Special handling for phone number - limit to 10 digits
    if (id === "phoneNumber") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [id]: digitsOnly,
      }));

      // Clear error when user types
      if (touched[id]) {
        const error = validatePhoneNumber(digitsOnly);
        setErrors((prev) => ({
          ...prev,
          phoneNumber: error,
        }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Clear error for this field when user types
    if (touched[id]) {
      const newErrors = { ...errors };

      if (id === "firstName") {
        const error = validateName(value, "First name");
        if (error) newErrors.firstName = error;
        else delete newErrors.firstName;
      } else if (id === "lastName") {
        const error = validateName(value, "Last name");
        if (error) newErrors.lastName = error;
        else delete newErrors.lastName;
      } else if (id === "email") {
        const error = validateEmail(value);
        if (error) newErrors.email = error;
        else delete newErrors.email;
      } else if (id === "password") {
        const passwordValidation = validatePassword(value);
        if (passwordValidation.error)
          newErrors.password = passwordValidation.error;
        else delete newErrors.password;
      }

      setErrors(newErrors);
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));

    // Validate on blur
    const newErrors = { ...errors };

    if (fieldName === "firstName") {
      const error = validateName(formData.firstName, "First name");
      if (error) newErrors.firstName = error;
      else delete newErrors.firstName;
    } else if (fieldName === "lastName") {
      const error = validateName(formData.lastName, "Last name");
      if (error) newErrors.lastName = error;
      else delete newErrors.lastName;
    } else if (fieldName === "email") {
      const error = validateEmail(formData.email);
      if (error) newErrors.email = error;
      else delete newErrors.email;
    } else if (fieldName === "phoneNumber") {
      const error = validatePhoneNumber(formData.phoneNumber);
      if (error) newErrors.phoneNumber = error;
      else delete newErrors.phoneNumber;
    } else if (fieldName === "password") {
      const passwordValidation = validatePassword(formData.password);
      if (passwordValidation.error)
        newErrors.password = passwordValidation.error;
      else delete newErrors.password;
    }

    setErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      password: !user,
    });

    if (!validateForm()) {
      return;
    }

    if (user) {
      const updatePayload: UpdateUserPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      };
      onSave(updatePayload, true);
    } else {
      const registerPayload: RegisterPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password!,
        role: formData.role,
      };
      onSave(registerPayload, false);
    }

    onOpenChange(false);
  };

  const passwordValidation =
    !user && formData.password ? validatePassword(formData.password) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-[600px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Register User"}</DialogTitle>
          <DialogDescription>
            {user
              ? "Update user information and role"
              : "Register a new staff member to your farm management system"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 py-4">
          {/* First Name */}
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              onBlur={() => handleBlur("firstName")}
              placeholder="John"
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-red-600 text-sm font-medium">
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              onBlur={() => handleBlur("lastName")}
              placeholder="Smith"
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="text-red-600 text-sm font-medium">
                {errors.lastName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={() => handleBlur("email")}
              placeholder="john.smith@farm.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-600 text-sm font-medium">{errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="grid gap-2">
            <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber || ""}
              onChange={handleInputChange}
              onBlur={() => handleBlur("phoneNumber")}
              placeholder="07XXXXXXXX"
              maxLength={10}
              className={errors.phoneNumber ? "border-red-500" : ""}
            />
            {errors.phoneNumber && (
              <p className="text-red-600 text-sm font-medium">
                {errors.phoneNumber}
              </p>
            )}
            <p className="text-xs text-gray-500">Max 10 digits</p>
          </div>

          {/* Password (only for register) */}
          {!user && (
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("password")}
                  placeholder="Enter password"
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              {formData.password && passwordValidation?.checks && (
                <div className="bg-gray-50 rounded-lg p-3 space-y-2 border">
                  <p className="text-gray-700 font-semibold text-xs">
                    Password must contain:
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {passwordValidation.checks.length ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                      )}
                      <span
                        className={`text-xs ${
                          passwordValidation.checks.length
                            ? "text-green-700"
                            : "text-gray-600"
                        }`}
                      >
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordValidation.checks.hasLetter ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                      )}
                      <span
                        className={`text-xs ${
                          passwordValidation.checks.hasLetter
                            ? "text-green-700"
                            : "text-gray-600"
                        }`}
                      >
                        At least one letter (a-z, A-Z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordValidation.checks.hasNumber ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                      )}
                      <span
                        className={`text-xs ${
                          passwordValidation.checks.hasNumber
                            ? "text-green-700"
                            : "text-gray-600"
                        }`}
                      >
                        At least one number (0-9)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {passwordValidation.checks.hasSpecial ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                      )}
                      <span
                        className={`text-xs ${
                          passwordValidation.checks.hasSpecial
                            ? "text-green-700"
                            : "text-gray-600"
                        }`}
                      >
                        At least one special character (!@#$%^&*...)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="text-red-600 text-sm font-medium">
                  {errors.password}
                </p>
              )}
            </div>
          )}

          {/* Role */}
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: UserRole) =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Administrator</SelectItem>
                <SelectItem value="FARM_OWNER">Farm Owner</SelectItem>
                <SelectItem value="MANAGER">Manager</SelectItem>
                <SelectItem value="VETERINARIAN">Veterinarian</SelectItem>
                <SelectItem value="WORKER">Worker</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-3 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="min-w-[140px]"
          >
            {user ? "Update User" : "Register User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
