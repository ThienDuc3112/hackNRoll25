import { useSortable } from "@dnd-kit/sortable";
import { IdItemType } from "./types";
import { CSS } from "@dnd-kit/utilities";
import { useAtomValue } from "jotai";
import { itemMapAtom } from "./state";
import Subsection from "./subsection";
import BulletPoint from "./bulletpoint";
import { GripVertical } from "lucide-react";

export const MenuItemView = ({
  itemId,
  onDelete,
}: {
  itemId: IdItemType;
  onDelete: (itemId: string) => void;
}) => {
  const itemMap = useAtomValue(itemMapAtom);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `MENU-${itemId}`,
    data: {
      type: "MENU_ITEM",
    },
  });
  const style = {
    transition: transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        className="h-[50px] bg-gray-50"
        ref={setNodeRef}
        style={{ ...style, opacity: 1 }}
      />
    );
  }

  const item = itemMap[itemId];
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-row justify-start align-middle"
    >
      <div className="h-full pb-4">
        <div
          className="bg-gray-50 w-full h-full flex flex-col align-middle justify-center "
          {...attributes}
          {...listeners}
        >
          <GripVertical />
        </div>
      </div>
      {item.type === "SUBSECTION" ? (
        <Subsection
          key={item.id}
          subSection={item}
          allowEdit
          onDelete={onDelete}
        />
      ) : (
        <BulletPoint key={item.id} point={item} allowEdit onDelete={onDelete} />
      )}
    </div>
  );
};
