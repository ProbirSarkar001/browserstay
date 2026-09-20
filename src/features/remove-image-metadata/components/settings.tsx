import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { ShieldCheck } from "lucide-react";
import { useRemoveImageMetadataContext } from "../context";

export function RemoveImageMetadataSettings() {
  const { settings, updateSettings } = useRemoveImageMetadataContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          What Gets Removed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-4">
          <li>GPS location and coordinates</li>
          <li>Camera and phone model</li>
          <li>Date, time, and software tags</li>
          <li>Other hidden EXIF metadata</li>
        </ul>

        <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/40">
          <div className="space-y-1">
            <Label htmlFor="preserve-format">Keep original format</Label>
            <p className="text-xs text-muted-foreground">
              Re-encode at maximum quality. HEIC files become JPEG.
            </p>
          </div>
          <Switch
            id="preserve-format"
            checked={settings.preserveFormat}
            onCheckedChange={(checked) => updateSettings({ preserveFormat: checked })}
          />
        </div>

        {!settings.preserveFormat && (
          <p className="text-xs text-muted-foreground">
            Output will be lossless PNG with all metadata stripped.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
