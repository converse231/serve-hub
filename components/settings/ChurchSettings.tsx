"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, Save, Upload } from "lucide-react";
import type { ChurchSettings } from "@/lib/types";

interface ChurchSettingsProps {
  initialSettings: ChurchSettings;
  onSave: (settings: ChurchSettings) => void;
}

export function ChurchSettings({ initialSettings, onSave }: ChurchSettingsProps) {
  const [settings, setSettings] = useState<ChurchSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave(settings);
      setIsSaving(false);
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Church Information
        </CardTitle>
        <CardDescription>
          Customize your church details and branding
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="church-name">Church Name *</Label>
          <Input
            id="church-name"
            value={settings.name}
            onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            placeholder="Enter church name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="church-logo">Church Logo</Label>
          <div className="flex items-center gap-4">
            {settings.logo ? (
              <div className="h-20 w-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50">
                <img src={settings.logo} alt="Church logo" className="h-full w-full object-cover rounded-lg" />
              </div>
            ) : (
              <div className="h-20 w-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Logo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Recommended: Square image, at least 200x200px
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="church-address">Address</Label>
          <Input
            id="church-address"
            value={settings.address || ""}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            placeholder="123 Main Street, City, State"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="church-phone">Phone</Label>
            <Input
              id="church-phone"
              type="tel"
              value={settings.phone || ""}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              placeholder="(123) 456-7890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="church-email">Email</Label>
            <Input
              id="church-email"
              type="email"
              value={settings.email || ""}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              placeholder="info@church.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="church-website">Website</Label>
          <Input
            id="church-website"
            type="url"
            value={settings.website || ""}
            onChange={(e) => setSettings({ ...settings, website: e.target.value })}
            placeholder="https://www.church.com"
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving || !settings.name} className="w-full md:w-auto gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}

