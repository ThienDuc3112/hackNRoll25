// helpers.tsx
import { useState } from "react";
import { X, Download } from "lucide-react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import Button from "./button";
import Mydocument from "./mydocument";
import { IdItemType } from "./types";

/** ContactInfo is the small input + "x" button to remove a piece of contact info. */
export const ContactInfo = ({
  value,
  onChange,
  onRemove,
}: {
  value: string;
  onChange: (val: string) => void;
  onRemove: () => void;
}) => {
  const [placeholder, setPlaceholder] = useState("Enter contact info");

  return (
    <div className="relative group">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={() => setPlaceholder("Enter contact info")}
        onBlur={() => !value && setPlaceholder("Click to edit")}
        placeholder={placeholder}
        className="text-sm text-center border-b border-gray-200 focus:outline-none focus:border-gray-400"
      />
      {value && (
        <button
          onClick={onRemove}
          className="absolute -right-6 top-1/2 -translate-y-1/2 hidden group-hover:block p-1 hover:bg-gray-100 rounded"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

/** ExportHandler handles the “Preview PDF” and “Download PDF” logic. */
export const ExportHandler = ({
  name,
  metadatas,
  sections,
}: {
  name: string;
  metadatas: { id: number; value: string }[];
  sections: { id: string; displayName: string; items: IdItemType[] }[];
}) => {
  const [showPreview, setShowPreview] = useState(false);

  if (showPreview) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg shadow-lg w-full h-full max-w-4xl mx-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">PDF Preview</h3>
            <button
              onClick={() => setShowPreview(false)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1">
            <PDFViewer width="100%" height="100%">
              <Mydocument
                name={name}
                metadatas={metadatas}
                sections={sections}
              />
            </PDFViewer>
          </div>
          <div className="mt-4 flex justify-end">
            <PDFDownloadLink
              document={
                <Mydocument
                  name={name}
                  metadatas={metadatas}
                  sections={sections}
                />
              }
              fileName="resume.pdf"
            >
              {/* 
                Sometimes TypeScript can complain about the children function. 
                You can ignore or adjust the type definition as needed.
              */}
              {/* @ts-expect-error */}
              {({ loading }: { loading: boolean }) => (
                <Button variant="primary" disabled={loading} onClick={() => { }}>
                  <Download size={16} />
                  {loading ? "Preparing..." : "Download PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="primary"
      disabled={false}
      onClick={() => setShowPreview(true)}
    >
      <Download size={16} />
      Export
    </Button>
  );
};
