import { useAtomValue } from "jotai";
import { activeAtom, itemMapAtom } from "./state";
import { IdItemType, SectionType } from "./types";
import Subsection from "./subsection";
import BulletPoint from "./bulletpoint";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"
import { useCallback } from "react";
import { createPortal } from "react-dom";
import { DragOverlay } from "@dnd-kit/core";

type SectionProp = {
  section: SectionType;
};

export const Section = ({ section }: SectionProp) => {
  const itemMap = useAtomValue(itemMapAtom);
  const activeId = useAtomValue(activeAtom)

  const ItemView = useCallback(({ itemId, parentContainerId }: { itemId: IdItemType, parentContainerId: string }) => {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
      id: itemId,
      data: {
        type: "ITEM",
        parentContainerId
      }
    })
    const style = {
      transition, transform: CSS.Transform.toString(transform)
    }

    if (isDragging) {
      return <div className="h-[120px] bg-gray-50"
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

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: section.id,
    data: {
      type: "SECTION"
    }
  })
  const style = {
    transition: transition,
    transform: CSS.Transform.toString(transform)
  }

  if (isDragging) {
    return <div
      className={`w-full mb-6 bg-gray-200`}
      ref={setNodeRef}
      style={style}
    >
      <div className="min-h-[120px]" />
    </div>

  }

  return (
    <div
      className={`w-full mb-6`}
      ref={setNodeRef}
      style={style}
    >
      {/* Section Name */}
      <h3
        className="text-lg font-medium text-gray-800 cursor-move mb-2"
        {...attributes}
        {...listeners}
      >
        {section.displayName}
      </h3>

      {/* Divider Line */}
      <div className="h-px bg-gray-200 mb-4" />

      {/* Droppable Area */}
      <div className="min-h-[120px]">
        <div>
          {section.items.length === 0 && (
            <div className="h-32 border border-dashed border-gray-200 rounded bg-gray-50 flex items-center justify-center">
              <span className="text-gray-400">Drop items here</span>
            </div>
          )}
          <SortableContext items={section.items} strategy={verticalListSortingStrategy}>
            {section.items.map((itemId) => <ItemView parentContainerId={section.id} itemId={itemId} />)}
          </SortableContext>
          {
            createPortal(
              <DragOverlay>
                {activeId && activeId.type == "ITEM" && <ItemView itemId={activeId.id as string} />}
              </DragOverlay>,
              document.body
            )
          }
        </div>
      </div>
    </div>
  );
};
