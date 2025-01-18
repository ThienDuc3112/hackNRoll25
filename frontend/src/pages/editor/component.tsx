import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ItemType } from "./types";
import { useEffect } from "react";

type ComponentProp = {
  item: ItemType,
};

export const Component = (props: ComponentProp) => {
  const { attributes, listeners, transform, setNodeRef, active, transition } = useSortable(
    {
      id: props.item.id,
      disabled: false,
      data: {
        type: "container"
      }
    }
  );
  useEffect(() => {
    console.log(transform)
  }, [transform])
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        border: "solid 1px",
        transform: CSS.Translate.toString(transform),
        transition: transition,
        backgroundColor: active && active.id == props.item.id ? 'blue' : undefined,
      }}
    >
      {props.item.type === "POINT" ?
        <p>{props.item.data}</p>
        :
        <p>{props.item.title}</p>
      }
    </div>
  );
};
