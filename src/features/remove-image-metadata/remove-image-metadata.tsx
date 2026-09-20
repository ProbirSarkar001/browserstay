import { RemoveImageMetadataDropZone } from "./components/drop-zone";
import { RemoveImageMetadataFileList } from "./components/file-list";
import { RemoveImageMetadataSettings } from "./components/settings";
import { RemoveImageMetadataActionCard } from "./components/action-card";

export function RemoveImageMetadata() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <RemoveImageMetadataDropZone />
        <RemoveImageMetadataFileList />
      </div>

      <div className="space-y-6">
        <RemoveImageMetadataSettings />
        <RemoveImageMetadataActionCard />
      </div>
    </div>
  );
}
