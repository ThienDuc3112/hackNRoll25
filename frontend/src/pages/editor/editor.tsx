import React, { Dispatch, useState } from "react";
import { X, Download, Plus } from "lucide-react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";

import Button from "./button";
import Mydocument from "./mydocument";
import Subsection from "./subsection";
import { useEditorAtom } from "./state";
import { Section } from "./section";
import { IdItemType, ItemType, UserMetaDataItem } from "./types";
import { SetStateAction } from "jotai";

type StateSetter<T> = Dispatch<SetStateAction<T>>

/** Contact info & PDF export components (unchanged) */
const ContactInfo = ({ value, onChange, onRemove }) => {
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

const ExportHandler = ({ name, metadatas }: { name: string, metadatas: UserMetaDataItem[] }) => {
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
              <Mydocument name={name} metadatas={metadatas} />
            </PDFViewer>
          </div>
          <div className="mt-4 flex justify-end">
            <PDFDownloadLink
              document={<Mydocument name={name} metadatas={metadatas} />}
              fileName="resume.pdf"
            >
              {/* @ts-expect-error*/}
              {({ loading }) => (
                <Button variant="primary" disabled={loading}>
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
    <Button onClick={() => setShowPreview(true)} variant="primary">
      <Download size={16} />
      Export
    </Button>
  );
};

/** Metadata shape for contact info. */

const Editor = () => {
  // Divider state for left & right panes
  const [dividerPosition, setDividerPosition] = useState(50);

  // For adding brand-new sections
  const [newSectionName, setNewSectionName] = useState<string>("");

  // Access your editor state & actions
  const { editorState, newSection } = useEditorAtom();

  // Each section uses an ID "section-xxx" for sorting

  // Track item/section being dragged
  //const [activeId, setActiveId] = useState<UniqueIdentifier | null>("");

  // Resume header fields
  const [name, setName] = useState("");
  const [metadatas, setMetadatas] = useState<UserMetaDataItem[]>([]);

  // For adding new subsections from the menu
  const [showNameInput, setShowNameInput] = useState(false);
  const [newSubsectionName, setNewSubsectionName] = useState("");

  /** Contact info handlers */
  const addMetadatas = () => {
    setMetadatas([...metadatas, { id: Date.now(), value: "" }]);
  };
  const removeMetadatas = (id: number) => {
    setMetadatas(metadatas.filter((field) => field.id !== id));
  };
  const updateMetadatas = (id: number, value: string) => {
    setMetadatas(
      metadatas.map((field) => (field.id === id ? { ...field, value } : field))
    );
  };

  /** Draggable divider logic */
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const handleMouseMove = (event: MouseEvent) => {
      const newDividerPosition = (event.clientX / window.innerWidth) * 100;
      setDividerPosition(Math.max(10, Math.min(newDividerPosition, 90)));
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  /** Add new subsection from the left sidebar. */
  const addNewSubsection = () => {
    console.log("addNewSubsection()")
  };

  return (
    <div className="fixed inset-0 flex w-full overflow-hidden">
      {/** DnD Context for the entire workspace */}
      {/** If you need to sort top-level layout items, you can wrap them in a SortableContext */}
      {/** ==================== LEFT SIDEBAR ==================== */}
      <LeftBar
        dividerPosition={dividerPosition}
        addNewSubsection={addNewSubsection}
        newSection={newSection}
        setNewSubsectionName={setNewSubsectionName}
        newSubsectionName={newSubsectionName}
        itemMap={editorState.itemMap}
        menu={editorState.menu}
        showNameInput={showNameInput}
        setShowNameInput={setShowNameInput}
      />

      {/** ==================== DRAGGABLE DIVIDER ==================== */}
      <div
        className="w-1 h-full bg-gray-400 cursor-col-resize hover:bg-gray-500"
        onMouseDown={handleMouseDown}
      />

      {/** ==================== RIGHT SIDE (Resume Document) ==================== */}
      <div
        className="flex overflow-y-auto flex-col h-full bg-gray-100"
        style={{ width: `${100 - dividerPosition}%` }}
      >
        {/** ======= CONTROL BAR ======= */}
        <div className="flex items-center gap-4 p-2 bg-white border-b">
          <ExportHandler name={name} metadatas={metadatas} />
          <input
            type="text"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            className="w-full p-2 rounded"
            placeholder="Add section name"
          />
          <Button
            onClick={() => {
              if (newSectionName === "") return;
              newSection(newSectionName, newSectionName);
              setNewSectionName("");
            }}
          >
            Add
          </Button>
        </div>

        {/** ====== MAIN DOCUMENT (A4) ====== */}
        <div className="flex-1 flex items-center justify-center p-4">
          {/**
               * This container simulates a real A4 page
               * - 210mm x 297mm is standard A4
               * - We can set overflow-y to auto if content is too long
               */}
          <div
            className="relative bg-white shadow-lg"
            style={{
              width: "210mm",
              height: "297mm",
              margin: "0 auto",
              padding: "16px",
              overflowY: "auto",
              fontSize: "12px", // smaller font to fit more content
            }}
          >
            {/** ========== NAME & CONTACT INFO ========== */}
            <div className="text-center mb-6">
              <input
                type="text"
                placeholder="YOUR NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-bold text-2xl text-center w-full border-b border-gray-200 focus:outline-none"
                style={{ marginBottom: "8px" }}
              />

              {/** Contact Info */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-gray-600">
                {metadatas.map((field, index) => (
                  <React.Fragment key={field.id}>
                    {index > 0 && <span>-</span>}
                    <ContactInfo
                      value={field.value}
                      onChange={(value: string) => updateMetadatas(field.id, value)}
                      onRemove={() => removeMetadatas(field.id)}
                    />
                  </React.Fragment>
                ))}
                {metadatas.length < 5 && (
                  <button
                    onClick={addMetadatas}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Plus size={12} />
                  </button>
                )}
              </div>
            </div>

            {/**
                 * SortableContext that contains the sections
                 * We'll show them inside this A4 container
                 */}
            {editorState.sections.map((section) => (
              <Section key={section.id} section={section} />
            ))}
          </div>
        </div>

      </div>

      {/** OPTIONAL: DragOverlay for custom drag previews */}
    </div>
  );
};

type LeftBarProps = {
  dividerPosition: number
  menu: IdItemType[]
  itemMap: Record<string, ItemType>
  showNameInput: boolean
  setShowNameInput: StateSetter<boolean>
  newSubsectionName: string
  setNewSubsectionName: StateSetter<string>
  newSection: (id: string, name: string) => void
  addNewSubsection: () => void
}

const LeftBar = ({
  dividerPosition,
  menu,
  itemMap,
  showNameInput,
  setShowNameInput,
  newSubsectionName,
  setNewSubsectionName,
  newSection,
  addNewSubsection
}: LeftBarProps) => {
  return <div
    className="flex h-full flex-col bg-gray-200 p-4 overflow-y-auto"
    style={{ width: `${dividerPosition}%` }}
  >
    {/** Render the items from the menu */}
    {menu.map((itemId, i) => {
      const item = itemMap[itemId];
      if (item.type === "SUBSECTION") {
        return (
          <Subsection
            key={i}
            onRemove={(_: string) => { }}
            id={`menu-${item.id}`}
            subSection={item}
            isDropped={false}
          />
        );
      } else {
        return <p key={i}>Bullet point</p>;
      }
    })}

    {/** "Add Subsection" UI */}
    {showNameInput ? (
      <div className="w-full p-4 mb-4 border-2 border-dashed border-gray-300 rounded-lg">
        <input
          type="text"
          value={newSubsectionName}
          onChange={(e) => setNewSubsectionName(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          placeholder="New section name"
          onKeyDown={(e) => {
            if (e.key === "Enter" && newSubsectionName.trim()) {
              newSection(newSubsectionName, newSubsectionName);
              setNewSubsectionName("");
            }
          }}
        />
        <div className="flex space-x-2">
          <button
            onClick={addNewSubsection}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
          <button
            onClick={() => {
              setShowNameInput(false);
              setNewSubsectionName("");
            }}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <button
        onClick={() => setShowNameInput(true)}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
      >
        + Add Subsection
      </button>
    )}
  </div>
}

export default Editor;
