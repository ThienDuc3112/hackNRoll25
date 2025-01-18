import { SectionType as SectionType } from "./types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Component } from "./component";
import { useAtomValue } from "jotai";
import { itemMapAtom } from "./state";
import { useMemo } from "react";
import { CSS } from "@dnd-kit/utilities"

type SectionProp = {
  section: SectionType;
};

export const Section = ({ section }: SectionProp) => {
  const itemMap = useAtomValue(itemMapAtom);
  const itemIds = useMemo(() => section.items.map(val => `item-${val}`), [section])

  const { setNodeRef, attributes, listeners, transition, transform, isDragging } = useSortable({
    id: `section-${section.id}`,
    data: {
      type: "section",
    },
  })

  const style = {
    transition: transition,
    transform: CSS.Transform.toString(transform),
    minWidth: 50,
    padding: 8,
    width: "100%",
  }

  //if (isDragging) {
  //  return <div ref={setNodeRef} style={style}>
  //    <div
  //      style={{
  //        border: "dashed 1px",
  //        display: "flex",
  //        flexDirection: "column",
  //        minHeight: "200px",
  //        backgroundColor: "black"
  //      }}
  //    />
  //  </div>
  //}

  return (
    <div ref={setNodeRef} style={style} >
      <div
        style={{
          border: "dashed 1px",
          display: "flex",
          flexDirection: "column",
          minHeight: "200px",
        }}
      >
        <span {...attributes} {...listeners} style={{ color: "black", textAlign: "center", flexGrow: 0 }}>
          {section.displayName}
        </span>
        <div
          style={{ width: "100%", height: "100%", flexGrow: 1, margin: 0 }}
        >
          <SortableContext items={itemIds} id={section.id}>
            {
              section.items.map((item, i) => (
                <Component
                  item={itemMap[item]}
                  key={i}
                />
              ))
            }
          </SortableContext>
        </div>
      </div>
    </div>
  );
};
