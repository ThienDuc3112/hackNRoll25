// MenuItem.tsx
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { SubsectionType, PointType } from "./types";
import Subsection from "./subsection";
import BulletPoint from "./bulletpoint";

type MenuItemProps = {
  id: string; // the item ID from itemMap, e.g. "test", "education"
  item: SubsectionType | PointType;
};

export function MenuItem({ id, item }: MenuItemProps) {
  // We'll use "menu-<id>" as the drag source
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `menu-${id}`,
      data: {
        fromMenu: true,   // so we know it's from the menu
        itemId: id,       // the underlying item ID
      },
    });

  const style: React.CSSProperties = {
    transform: transform
      ? CSS.Translate.toString(transform)
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 mb-2 bg-white shadow"
    >
      {/* Render the item just like before */}
      {item.type === "SUBSECTION" ? (
        <Subsection
          // Subsection wants an `id` like "menu-xxx"
          id={`menu-${id}`}
          subSection={item}
          isDropped={false}
          onRemove={() => { }}
        />
      ) : (
        <BulletPoint title={(item as PointType).data} />
      )}
    </div>
  );
}
