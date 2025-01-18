import { SectionType as SectionType } from "./types";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Component } from "./component";
import { useAtomValue } from "jotai";
import { itemMapAtom } from "./state";

type SectionProp = {
  section: SectionType;
};

export const Section = (props: SectionProp) => {
  const itemMap = useAtomValue(itemMapAtom);
  return (
    <SortableContext items={props.section.items} strategy={verticalListSortingStrategy} id={props.section.id}>
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
            {props.section.displayName}
          </span>
          <div
            style={{ width: "100%", height: "100%", flexGrow: 1, margin: 0 }}
          >
            {props.section.items.map((item, i) => (
              <Component
                item={itemMap[item]}
                key={i}
                index={i}
                containerId={props.section.id}
              />
            ))}
          </div>
        </div>
      </div>
    </SortableContext>
  );
};
