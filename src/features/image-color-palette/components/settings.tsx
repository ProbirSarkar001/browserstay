import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { useImageColorPaletteContext } from "../context";

export function PaletteSettings() {
  const { settings, updateSettings } = useImageColorPaletteContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <Label htmlFor="skip-white">Skip near-white background</Label>
            <p className="text-xs text-muted-foreground">
              Useful for logos on white. Colors merge together, so a palette can hold fewer
              entries than the count shown above.
            </p>
          </div>
          <Switch
            id="skip-white"
            checked={settings.skipWhite}
            onCheckedChange={(checked) => updateSettings({ skipWhite: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
