import { SubsectionType, PointType } from "./types";
import Subsection from "./subsection";
import BulletPoint from "./bulletpoint";

type MenuItemProps = {
  id: string; // the item ID from itemMap, e.g. "test", "education"
  item: SubsectionType | PointType;
};

export function MenuItem({ id, item }: MenuItemProps) {
  // We'll use "menu-<id>" as the drag source
  return (
    <div
      className="p-2 mb-2 bg-white shadow"
    >
      {/* Render the item just like before */}
      {item.type === "SUBSECTION" ? (
        <Subsection
          // Subsection wants an `id` like "menu-xxx"
          id={`menu-${id}`}
          subSection={item}
          isDropped={false}
          onRemove={() => { }}
        />
      ) : (
        <BulletPoint title={(item as PointType).data} />
      )}
    </div>
  );
}
