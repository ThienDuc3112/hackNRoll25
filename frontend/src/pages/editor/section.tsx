import { SectionType } from "./types";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ItemView } from "./ItemView";

type SectionProp = {
  section: SectionType;
};

export const Section = ({ section }: SectionProp) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    data: {
      type: "SECTION",
    },
  });
  const style = {
    transition: transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div className={`w-full mb-6 bg-gray-200`} ref={setNodeRef} style={style}>
        <div className="min-h-[120px]" />
      </div>
    );
  }

  return (
    <div className={`w-full mb-6`} ref={setNodeRef} style={style}>
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
      <div className="min-h-[20px]">
        <div>
          {section.items.length === 0 && (
            <div className="h-20 border border-dashed border-gray-200 rounded bg-gray-50 flex items-center justify-center">
              <span className="text-gray-400">Drop items here</span>
            </div>
          )}
          <SortableContext
            items={section.items}
            strategy={verticalListSortingStrategy}
          >
            {section.items.map((itemId) => (
              <ItemView
                key={itemId}
                parentContainerId={section.id}
                itemId={itemId}
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
};
