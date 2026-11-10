"use client";

import { useState, type ReactNode } from "react";
import { FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ImportFlow, type ImportKind } from "@/components/content/import-flow";

/**
 * "Import from Excel" on a content page: check the spreadsheet first (nothing is written), then
 * import, limited to that page's spreadsheets. The page's table refreshes after an import.
 */
export function ImportSheet({
  kinds,
  title,
  description,
}: {
  kinds: ImportKind[];
  title: string;
  description: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" className="h-9 gap-2 bg-white/60" onClick={() => setOpen(true)}>
        <FileSpreadsheet className="size-4 text-emerald-700" />
        Import from Excel
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full gap-0 overflow-y-auto data-[side=right]:sm:max-w-2xl">
          <SheetHeader className="border-b border-black/5">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <div className="p-4">
            {/* Remounted on every open, so a new import starts from an empty list. */}
            {open ? <ImportFlow kinds={kinds} /> : null}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
