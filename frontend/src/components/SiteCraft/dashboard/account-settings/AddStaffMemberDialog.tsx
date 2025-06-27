// frontend/src/components/dashboard/account-settings/AddStaffMemberDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/SiteCraft/ui/button";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/SiteCraft/ui/dialog";
import { Input } from "@/components/SiteCraft/ui/input";
import { Label } from "@/components/SiteCraft/ui/label";
import { StaffMember } from "@/lib/store-info";

interface AddStaffMemberDialogProps {
  onSave: (member: Omit<StaffMember, 'id'>) => void;
  disabled?: boolean;
}

export function AddStaffMemberDialog({ onSave, disabled = false }: AddStaffMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Staff");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setGender("Male");
      setPhone("");
      setRole("Staff");
      setErrors({});
    }
  }, [open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const staffData: Omit<StaffMember, 'id'> = {
        name: name.trim(),
        email: email.trim(),
        gender,
        phone: phone.trim(),
        role: role.trim(),
      };

      await onSave(staffData);
      setOpen(false);
    } catch (error) {
      console.error('Failed to save staff member:', error);
      // You can add a toast notification here to show the error
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <Button
        className="flex items-center bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover px-4 py-2 text-sm font-medium rounded-md"
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add New Staff Member
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        {/* 
          - On xs: w-full, max-w-[95vw], mx-2 → fits nearly full width 
          - On sm+: center and cap at max-w-md 
        */}
        <DialogContent className="w-full max-w-[95vw] mx-2 sm:mx-auto sm:max-w-md p-4">
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* Name */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="staff-name">Name <span className="text-red-500">*</span></Label>
              <Input
                id="staff-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="staff-email">Email <span className="text-red-500">*</span></Label>
              <Input
                id="staff-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>

            {/* Role */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="staff-role">Role</Label>
              <Input
                id="staff-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Staff"
              />
            </div>

            {/* Gender */}
            <div className="flex flex-col space-y-2">
              <Label>Gender</Label>
              <div className="flex space-x-6">
                {(["Male", "Female"] as const).map((option) => (
                  <label
                    key={option}
                    className="inline-flex items-center space-x-2"
                  >
                    <input
                      type="radio"
                      name="staff-gender"
                      value={option}
                      checked={gender === option}
                      onChange={() => setGender(option)}
                      className="h-4 w-4 accent-logo-dark-button focus:ring-logo-dark-button"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="staff-phone">Phone <span className="text-red-500">*</span></Label>
              <Input
                id="staff-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 1XXXXXXXXX"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover px-4 py-2 text-sm font-medium rounded-md"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
