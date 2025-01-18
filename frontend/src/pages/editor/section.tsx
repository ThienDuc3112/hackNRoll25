import { SectionType as SectionType } from "./types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Component } from "./component";
import { useAtomValue } from "jotai";
import { itemMapAtom } from "./state";
import { useMemo } from "react";

type SectionProp = {
  section: SectionType;
};

export const Section = ({ section }: SectionProp) => {
  const itemMap = useAtomValue(itemMapAtom);
  const itemIds = useMemo(() => section.items, [section])

  const { setNodeRef, attributes, listeners } = useSortable({
    id: section.id,
    data: {
      type: "section",
    },
    disabled: true
  })

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} >
      <div
        style={{
          minWidth: 50,
          padding: 8,
          width: "100%",
        }}
      >
        <div
          style={{
            border: "dashed 1px",
            display: "flex",
            flexDirection: "column",
            minHeight: "200px",
          }}
        >
          <span style={{ color: "black", textAlign: "center", flexGrow: 0 }}>
            {section.displayName}
          </span>
          <div
            style={{ width: "100%", height: "100%", flexGrow: 1, margin: 0 }}
          >
            <SortableContext items={itemIds} id={section.id}>
              {section.items.map((item, i) => (
                <Component
                  item={itemMap[item]}
                  key={i}
                  data={{
                    sortable: {
                      containerId: section.id,
                      index: i,
                    },
                  }}
                />
              ))}
            </SortableContext>
          </div>
        </div>
      </div>
    </div>
  );
};
