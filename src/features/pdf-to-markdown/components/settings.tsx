import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { usePdfToMarkdownContext } from "../context";

export function PdfToMarkdownSettings() {
  const { settings, updateSettings, fileData } = usePdfToMarkdownContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="markdown-profile">Output profile</Label>
          <Select
            value={settings.profile}
            onValueChange={(value) => {
              if (value) updateSettings({ profile: value as typeof settings.profile });
            }}
            disabled={!fileData}
          >
            <SelectTrigger id="markdown-profile" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fidelity">Fidelity — preserve layout details</SelectItem>
              <SelectItem value="compact">Compact — fewer tokens for AI use</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Compact mode collapses dot leaders and similar padding for shorter output.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <Label htmlFor="page-markers">Page markers</Label>
            <p className="text-xs text-muted-foreground">
              Insert page-break comments between pages
            </p>
          </div>
          <Switch
            id="page-markers"
            checked={settings.includePageMarkers}
            onCheckedChange={(checked) => updateSettings({ includePageMarkers: checked })}
            disabled={!fileData}
          />
        </div>
      </CardContent>
    </Card>
  );
}
