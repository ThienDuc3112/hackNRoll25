import React, { useMemo } from "react";
import { useSortable, SortableContext } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAtomValue } from "jotai";
import { itemMapAtom } from "./state";
import { Component } from "./component";
import { SectionType } from "./types";

type SectionProp = {
  section: SectionType;
};

export const Section = ({ section }: SectionProp) => {
  const itemMap = useAtomValue(itemMapAtom);

  const itemIds = useMemo(() => {
    return section.items.map((itemId) => `item-${itemId}`);
  }, [section]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id: `section-${section.id}`,
    data: {
      type: "section",
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`w-full mb-6 ${isDragging ? 'opacity-70' : 'opacity-100'}`}
    >
      {/* Section Name */}
      <h3 
        {...attributes}
        {...listeners}
        className="text-lg font-medium text-gray-800 cursor-move mb-2"
      >
        {section.displayName}
      </h3>

      {/* Divider Line */}
      <div className="h-px bg-gray-200 mb-4" />

      {/* Droppable Area */}
      <div className="">
        <SortableContext items={itemIds}>
          <div className="space-y-3 border">
            {section.items.map(itemId => (
              <Component
                key={itemId}
                item={itemMap[itemId]}
              />
            ))}
            
            {section.items.length === 0 && (
              <div className="h-10 border border-dashed border-gray-200 rounded bg-gray-50 flex items-center justify-center">
                <span className="text-gray-400">Drop items here</span>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};