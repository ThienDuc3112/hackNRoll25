import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ItemType } from "./types";

type ComponentProp = {
  item: ItemType,
};

export const Component = (props: ComponentProp) => {
  const { attributes, listeners, transform, setNodeRef, active, transition } = useSortable(
    {
      id: `item-${props.item.id}`,
      disabled: false,
      data: {
        type: "item"
      }
    }
  );

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
