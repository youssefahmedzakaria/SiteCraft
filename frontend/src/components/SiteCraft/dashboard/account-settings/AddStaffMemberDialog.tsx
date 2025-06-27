// frontend/src/components/dashboard/account-settings/AddStaffMemberDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/SiteCraft/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/SiteCraft/ui/dialog";
import { Input } from "@/components/SiteCraft/ui/input";
import { Label } from "@/components/SiteCraft/ui/label";

interface StaffMember {
  name: string;
  email: string;
  gender: "Male" | "Female";
  phone: string;
}

interface AddStaffMemberDialogProps {
  onSave: (member: StaffMember) => void;
}

export function AddStaffMemberDialog({ onSave }: AddStaffMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [phone, setPhone] = useState("");

  // reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setGender("Male");
      setPhone("");
    }
  }, [open]);

  const handleSave = () => {
    onSave({ name, email, gender, phone });
    setOpen(false);
  };

  return (
    <>
      {/* Trigger button */}
      <Button
        className="flex items-center bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover px-4 py-2 text-sm font-medium rounded-md"
        onClick={() => setOpen(true)}
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
              <Label htmlFor="staff-name">Name</Label>
              <Input
                id="staff-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="staff-email">Email</Label>
              <Input
                id="staff-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
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
              <Label htmlFor="staff-phone">Phone</Label>
              <Input
                id="staff-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 1XXXXXXXXX"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover px-4 py-2 text-sm font-medium rounded-md"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
