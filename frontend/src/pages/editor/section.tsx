import React, { useMemo } from "react";
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
  // Convert the transform to a CSS-friendly string

  return (
    /**
     * The parent <div> is the draggable container of this section.
     * We attach the 'setNodeRef' so @dnd-kit knows which element is being moved.
     */
    <div
      style={{
        border: "dashed 1px",
        display: "flex",
        flexDirection: "column",
        minHeight: "200px",
      }}
    >
      {/**
         * The "span" below serves as a "handle" for dragging the entire section.
         * We spread {...attributes} and {...listeners} here so a user can click anywhere on this
         * span to drag the section. If you prefer a dedicated handle icon, you can put these
         * props on a smaller element/icon instead.
         */}
      <span
        style={{
          color: "black",
          textAlign: "center",
          flexGrow: 0,
          cursor: "move",
          display: "block",
          marginBottom: 8,
        }}
      >
        {section.displayName}
      </span>

      {/**
         * SortableContext for the items inside this section.
         * This means each item in 'section.items' can be dragged & reordered within this context.
         */}
      <div style={{ width: "100%", flexGrow: 1, margin: 0 }}>
        {section.items.map(itemId => (
          /**
           * We render each item as a <Component />.
           * The itemMap has all the data (title, data, timeRange, etc.).
           * key={index} is acceptable if the order changes,
           * but typically you'd want key={itemId} for consistency (if itemId is unique).
           */
          <Component
            key={itemId}
            item={itemMap[itemId]}
          />
        ))}
      </div>
    </div>
  );
};
