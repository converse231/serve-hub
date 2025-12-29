"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Save, Lock } from "lucide-react";
import type { UserProfile } from "@/lib/types";

interface ProfileSettingsProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export function ProfileSettings({ initialProfile, onSave }: ProfileSettingsProps) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave(profile);
      setIsSaving(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Full Name *</Label>
            <Input
              id="profile-name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-email">Email *</Label>
            <Input
              id="profile-email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="your.email@church.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-phone">Phone</Label>
            <Input
              id="profile-phone"
              type="tel"
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="(123) 456-7890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-role">Role</Label>
            <Input
              id="profile-role"
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              placeholder="Ministry Coordinator"
            />
          </div>

          <Button onClick={handleSave} disabled={isSaving || !profile.name || !profile.email} className="w-full md:w-auto gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>
            Update your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              placeholder="Enter current password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
            />
          </div>

          <Button variant="outline" className="w-full md:w-auto gap-2">
            <Lock className="h-4 w-4" />
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

