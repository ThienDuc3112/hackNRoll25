import { ItemType } from "./types";

type ComponentProp = {
  item: ItemType,
};

export const Component = (props: ComponentProp) => {

  return (
    <div
      style={{
        border: "solid 1px",
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
