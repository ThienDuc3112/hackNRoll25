import { useCallback, useMemo, useState } from "react";
import { IdItemType, SectionType, UserMetaDataItem } from "./types";
import { ContactInfo, ExportHandler } from "./helpers";
import Button from "./button";
import { Plus } from "lucide-react";
import { Section } from "./section";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useAtomValue } from "jotai";
import { activeAtom, itemMapAtom } from "./state";
import { DragOverlay } from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { CSS } from "@dnd-kit/utilities"
import Subsection from "./subsection";
import BulletPoint from "./bulletpoint";

type ResumeViewProps = {
  dividerPosition: number;
  newSection: (id: string, name: string) => void;
  sections: SectionType[];
};

export const ResumeView = ({
  sections,
  dividerPosition,
  newSection,
}: ResumeViewProps) => {
  const activeId = useAtomValue(activeAtom)
  const itemMap = useAtomValue(itemMapAtom)
  console.log(activeId)

  const ItemView = useCallback(({ itemId, parentContainerId }: { itemId: IdItemType, parentContainerId: string }) => {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
      id: itemId,
      data: {
        type: "ITEM",
        parentContainerId
      }
    })
    const style = {
      transition: transition,
      transform: CSS.Transform.toString(transform)
    }

    if (isDragging) {
      return <div className="h-[50px] bg-gray-50"
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{ ...style, opacity: 1 }}
      />
    }

    const item = itemMap[itemId];
    return <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {
        item.type === "SUBSECTION" ?
          <Subsection key={item.id} allowEdit={false} subSection={item} />
          :
          <BulletPoint key={item.id} point={item} />
      }
    </div>
  }, [])

  // Resume header fields
  const [name, setName] = useState("");

  // For adding brand-new sections
  const [newSectionName, setNewSectionName] = useState<string>("");

  const sectionIds = useMemo(() => sections.map(sex => sex.id), [sections])

  /** Contact info handlers */
  const [metadatas, setMetadatas] = useState<UserMetaDataItem[]>([]);
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
                <div key={field.id}>
                  {index > 0 && <span>-</span>}
                  <ContactInfo
                    value={field.value}
                    onChange={(value: string) =>
                      updateMetadatas(field.id, value)
                    }
                    onRemove={() => removeMetadatas(field.id)}
                  />
                </div>
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
          <SortableContext strategy={verticalListSortingStrategy} items={sectionIds} >
            {sections.map((section) => (
              <Section key={section.id} section={section} />
            ))}
          </SortableContext>
          {
            createPortal(
              <DragOverlay>
                {activeId && activeId.type === "SECTION" && <Section section={(() => {
                  return sections.find(val => val.id === activeId.id)
                })()!} />}
                {activeId && activeId.type === "ITEM" && <ItemView parentContainerId="" itemId={activeId.id as string} />}
              </DragOverlay>,
              document.body
            )
          }
        </div>
      </div>
    </div>
  );
};
