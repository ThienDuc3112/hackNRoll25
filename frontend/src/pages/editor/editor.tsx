import React, { useState } from "react";
import { Plus } from "lucide-react";

import Button from "./button";
import Subsection from "./subsection";
import { useEditorAtom } from "./state";
import { Section } from "./section";
import {
  IdItemType,
  ItemType,
  SectionType,
  SubsectionType,
  UserMetaDataItem,
} from "./types";
import BulletPoint from "./bulletpoint";
import { ContactInfo, ExportHandler } from "./helpers";

/** Contact info & PDF export components (unchanged) */

/** Metadata shape for contact info. */

const Editor = () => {
  // Divider state for left & right panes
  const [dividerPosition, setDividerPosition] = useState(50);

  // Access your editor state & actions
  const { editorState, newSection, newSubSection } = useEditorAtom();

  // Each section uses an ID "section-xxx" for sorting

  // Track item/section being dragged
  //const [activeId, setActiveId] = useState<UniqueIdentifier | null>("");

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
  const addNewSubsection = (subSection: SubsectionType) => {
    newSubSection(subSection);
  };

  return (
    <div className="fixed inset-0 flex w-full overflow-hidden">
      {/** DnD Context for the entire workspace */}
      {/** If you need to sort top-level layout items, you can wrap them in a SortableContext */}
      {/** ==================== LEFT SIDEBAR ==================== */}
      <LeftBar
        dividerPosition={dividerPosition}
        addNewSubsection={addNewSubsection}
        itemMap={editorState.itemMap}
        menu={editorState.menu}
      />

      {/** ==================== DRAGGABLE DIVIDER ==================== */}
      <div
        className="w-1 h-full bg-gray-400 cursor-col-resize hover:bg-gray-500"
        onMouseDown={handleMouseDown}
      />

      {/** ==================== RIGHT SIDE (Resume Document) ==================== */}
      <RightSide
        newSection={newSection}
        dividerPosition={dividerPosition}
        sections={editorState.sections}
      />
      {/** OPTIONAL: DragOverlay for custom drag previews */}
    </div>
  );
};

type RightSideProps = {
  dividerPosition: number;
  newSection: (id: string, name: string) => void;
  sections: SectionType[];
};

const RightSide = ({
  sections,
  dividerPosition,
  newSection,
}: RightSideProps) => {
  // Resume header fields
  const [name, setName] = useState("");
  // For adding brand-new sections
  const [newSectionName, setNewSectionName] = useState<string>("");

  const [metadatas, setMetadatas] = useState<UserMetaDataItem[]>([]);
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

  return (
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
                    onChange={(value: string) =>
                      updateMetadatas(field.id, value)
                    }
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
          {sections.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
};

type LeftBarProps = {
  dividerPosition: number;
  menu: IdItemType[];
  itemMap: Record<string, ItemType>;
  addNewSubsection: (subSection: SubsectionType) => void;
};

const LeftBar = ({
  dividerPosition,
  menu,
  itemMap,
  addNewSubsection,
}: LeftBarProps) => {
  // For adding new subsections from the menu
  const [showNameInput, setShowNameInput] = useState(false);
  const [newSubsectionName, setNewSubsectionName] = useState("");
  const [newSubsectionSubTitle, setNewSubsectionSubTitle] = useState("");
  const [timerange, setTimerange] = useState("");

  const [showGBulletInput, setGBulletInput] = useState(false);
  const { newBulletPoint } = useEditorAtom();
  const [newGBulletPointName, setNewGBulletPointName] = useState("");

  return (
    <div
      className="flex h-full flex-col bg-gray-200 p-4 overflow-y-auto"
      style={{ width: `${dividerPosition}%` }}
    >
      {/** Render the items from the menu */}
      {menu.map((itemId, i) => {
        const item = itemMap[itemId];
        if (item.type === "SUBSECTION") {
          // SUBSECTION DISPLAY IN MENU ==================
          return (
            <Subsection
              key={i}
              subSection={item}
            />
          );
        } else {
          // BULLETPOINT DISPLAY IN MENU ==================
          return (
            <BulletPoint key={i} point={item} />
          );
        }
      })}

      {/** "Add Subsection" UI */}
      {showNameInput ? (
        <div className="w-full p-4 mb-4 border-2 border-dashed border-gray-300 rounded-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addNewSubsection({
                id: (Math.random() * 100_000).toString(),
                type: "SUBSECTION",
                description: newSubsectionSubTitle,
                items: [],
                timeRange: timerange,
                title: newSubsectionSubTitle,
              });
              setTimerange("");
              setNewSubsectionName("");
              setNewSubsectionSubTitle("");
            }}
          >
            <input
              type="text"
              value={newSubsectionName}
              onChange={(e) => setNewSubsectionName(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
              placeholder="New section name"
            />
            <input
              type="text"
              value={newSubsectionSubTitle}
              onChange={(e) => setNewSubsectionSubTitle(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
              placeholder="New section subtitle"
            />
            <input
              type="text"
              value={timerange}
              onChange={(e) => setTimerange(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
              placeholder="New section timerange"
            />
            <div className="flex space-x-2">
              <button
                type="submit"
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
          </form>
        </div>
      ) : (
        <button
          onClick={() => setShowNameInput(true)}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
        >
          + Add Subsection
        </button>
      )}
      {showGBulletInput ? (
        <div>
          <input
            type="text"
            value={newGBulletPointName}
            onChange={(e) => setNewGBulletPointName(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            placeholder="New bullet point"
          />
          <button
            onClick={() => {
              newBulletPoint(newGBulletPointName);
              setNewGBulletPointName("");
            }}
          >
            Add
          </button>
        </div>
      ) : (
        <button
          onClick={() => setGBulletInput(true)}
          className="mt-2 flex items-center text-sm text-blue-500 hover:text-blue-600"
        >
          <Plus size={16} className="mr-1" /> Add Bullet Point
        </button>
      )}
    </div>
  );
};

export default Editor;
