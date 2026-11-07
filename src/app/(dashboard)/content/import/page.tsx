import type { Metadata } from "next";
import { ImportFlow } from "./import-flow";

export const metadata: Metadata = { title: "Import spreadsheets" };

export default function ImportPage() {
  return (
    <div className="grid max-w-4xl gap-4">
      <p className="text-sm text-muted-foreground">
        Load the content team&apos;s spreadsheets: Recommendations Set A and Set B, Did You Know, and the cycle-day
        lines. Files are recognised by their sheets, so renamed files work. Checking writes nothing; you see the
        counts, any problems and what would change before you import.
      </p>
      <ImportFlow />
    </div>
  );
}
