import { useAtomValue } from "jotai";
import { itemMapAtom } from "./state";
import { SectionType } from "./types";
import Subsection from "./subsection";
import BulletPoint from "./bulletpoint";

type SectionProp = {
  section: SectionType;
};

export const Section = ({ section }: SectionProp) => {
  const itemMap = useAtomValue(itemMapAtom);

  return (
    <div
      className={`w-full mb-6`}
    >
      {/* Section Name */}
      <h3
        className="text-lg font-medium text-gray-800 cursor-move mb-2"
      >
        {section.displayName}
      </h3>

      {/* Divider Line */}
      <div className="h-px bg-gray-200 mb-4" />

      {/* Droppable Area */}
      <div className="min-h-[120px]">
        <div>
          {/*             
            {section.items.map((itemId) => (
              <Component key={itemId} item={itemMap[itemId]} />
            ))}

            {section.items.length === 0 && (
              <div className="h-32 border border-dashed border-gray-200 rounded bg-gray-50 flex items-center justify-center">
                <span className="text-gray-400">Drop items here</span>
              </div>
            )} */}
          {section.items.map((itemId) => {
            const item = itemMap[itemId];
            if (item.type == "SUBSECTION") {
              return <Subsection key={item.id} allowEdit={false} subSection={item} />;
            } else {
              return <BulletPoint key={item.id} point={item} />;
            }
          })}
        </div>
      </div>
    </div>
  );
};
