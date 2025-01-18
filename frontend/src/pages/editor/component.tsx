import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Item } from "./types";

type ComponentProp = {
  item: Item,
  data: {
    sortable: {
      containerId: string,
      index: number
    }
  }
};

export const Component = (props: ComponentProp) => {
  const { attributes, listeners, transform, setNodeRef, active, transition } = useSortable(
    {
      id: props.item.id,
      data: props.data
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
        width: "fit-content",
        height: "fit-content"
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
