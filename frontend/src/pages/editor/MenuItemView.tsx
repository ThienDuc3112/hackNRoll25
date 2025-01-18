import { useSortable } from "@dnd-kit/sortable";
import { IdItemType } from "./types";
import { CSS } from "@dnd-kit/utilities"
import { useAtomValue } from "jotai";
import { itemMapAtom } from "./state";
import Subsection from "./subsection";
import BulletPoint from "./bulletpoint";

export const MenuItemView = ({ itemId }: { itemId: IdItemType }) => {
  const itemMap = useAtomValue(itemMapAtom)

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: `MENU-${itemId}`,
    data: {
      type: "MENU_ITEM",
    }
  })
  const style = {
    transition: transition,
    transform: CSS.Transform.toString(transform)
  }

  if (isDragging) {
    return <div className="h-[50px] bg-gray-50"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ ...style, opacity: 1 }}
    />
  }

  const item = itemMap[itemId];
  return <div
    ref={setNodeRef}
    style={style}
    {...attributes}
    {...listeners}
  >
    {
      item.type === "SUBSECTION" ?
        <Subsection key={item.id} allowEdit={true} subSection={item} />
        :
        <BulletPoint key={item.id} point={item} />
    }
  </div>
}
