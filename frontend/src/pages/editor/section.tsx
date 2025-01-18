import { Section as SectionType } from "./types";
import { SortableContext } from "@dnd-kit/sortable";
import { Component } from "./component";
import { useAtomValue } from "jotai";
import { itemMapAtom } from "./state";

//type SectionProp = {
//  id: UniqueIdentifier;
//  title: string;
//  children?: ReactNode
//};
//
//export const Section = (props: SectionProp) => {
//  const { isOver, setNodeRef } = useDroppable({
//    id: props.id
//  });
//  return (
//    <div
//      ref={setNodeRef}
//      style={{
//        minWidth: 50,
//        padding: 8,
//        width: "100%",
//      }}
//    >
//      <div style={{
//        border: "dashed 1px",
//        display: "flex",
//        flexDirection: "column",
//        minHeight: "200px",
//        backgroundColor: isOver ? 'green' : 'grey',
//      }}>
//        <span style={{ color: "white", textAlign: "center" }}>{props.title}</span>
//        <div style={{ width: "100%", height: "100%", margin: 0 }}>
//          {props.children}
//        </div>
//      </div>
//    </div>
//  );
//};

type SectionProp = {
  section: SectionType
};

export const Section = (props: SectionProp) => {
  const itemMap = useAtomValue(itemMapAtom)
  return (
    <SortableContext items={props.section.items} id={props.section.id}>
      <div
        style={{
          minWidth: 50,
          padding: 8,
          width: "100%",
        }}
      >
        <div style={{
          border: "dashed 1px",
          display: "flex",
          flexDirection: "column",
          minHeight: "200px",
        }}>
          <span style={{ color: "black", textAlign: "center", flexGrow: 0 }}>{props.section.displayName}</span>
          <div style={{ width: "100%", height: "100%", flexGrow: 1, margin: 0 }}>
            {props.section.items.map((item, i) => (
              <Component item={itemMap[item]} key={i} data={{
                sortable: {
                  containerId: props.section.id,
                  index: i
                }
              }} />
            ))}
          </div>
        </div>
      </div>
    </SortableContext>
  );
};

