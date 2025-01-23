import { useMemo, useState } from "react";
import { IdItemType, SubsectionType } from "./types";
import { itemMapAtom, useEditorAtom } from "./state";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { MenuItemView } from "./MenuItemView";
import { useAtomValue } from "jotai";

type MenuBarProps = {
  dividerPosition: number;
  menu: IdItemType[];
};

export const MenuBar = ({ dividerPosition, menu }: MenuBarProps) => {
  // For adding new subsections from the menu
  const itemMap = useAtomValue(itemMapAtom);
  const [option, setOption] = useState<"all" | "sub" | "point">("all");
  const filteredMenu = useMemo(() => {
    if (option == "sub") {
      return menu.filter((itemId) => itemMap[itemId]?.type === "SUBSECTION");
    } else if (option == "point") {
      return menu.filter((itemId) => itemMap[itemId]?.type === "POINT");
    } else {
      return menu;
    }
  }, [menu, option]);
  const [showNameInput, setShowNameInput] = useState(false);
  const [newSubsectionName, setNewSubsectionName] = useState("");
  const [newSubsectionSubTitle, setNewSubsectionSubTitle] = useState("");
  const [timerange, setTimerange] = useState("");

  const [showGBulletInput, setGBulletInput] = useState(false);
  const { newBulletPoint, newSubSection, deleteItem } = useEditorAtom();
  const [newGBulletPointName, setNewGBulletPointName] = useState("");

  const items = useMemo(
    () => filteredMenu.map((val) => `MENU-${val}`),
    [filteredMenu],
  );

  const addNewSubsection = (subSection: SubsectionType) => {
    newSubSection(subSection);
  };

  return (
    <div
      className="flex h-full flex-col bg-gray-200 p-4 overflow-y-auto"
      style={{ width: `${dividerPosition}%` }}
    >
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
          Filter Components
        </h3>

        <div className="flex justify-between items-center gap-2">
          <button
            onClick={() => setOption("all")}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              option === "all"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setOption("point")}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              option === "point"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Points
          </button>

          <button
            onClick={() => setOption("sub")}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              option === "sub"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Sections
          </button>
        </div>
      </div>
      {/** Render the items from the menu */}
      <SortableContext strategy={verticalListSortingStrategy} items={items}>
        {filteredMenu.map((itemId) => (
          <MenuItemView itemId={itemId} key={itemId} onDelete={deleteItem} />
        ))}
      </SortableContext>

      {/** "Add Subsection" UI */}
      {showNameInput ? (
        <div className="w-full p-4 mb-4 border-2 border-dashed border-gray-300 rounded-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addNewSubsection({
                id: (Math.random() * 100_000).toString(),
                type: "SUBSECTION",
                description: newSubsectionSubTitle,
                items: [],
                timeRange: timerange,
                title: newSubsectionSubTitle,
              });
              setTimerange("");
              setNewSubsectionName("");
              setNewSubsectionSubTitle("");
            }}
          >
            <input
              type="text"
              value={newSubsectionName}
              onChange={(e) => setNewSubsectionName(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
              placeholder="New section name"
            />
            <input
              type="text"
              value={newSubsectionSubTitle}
              onChange={(e) => setNewSubsectionSubTitle(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
              placeholder="New section subtitle"
            />
            <input
              type="text"
              value={timerange}
              onChange={(e) => setTimerange(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
              placeholder="New section timerange"
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowNameInput(false);
                  setNewSubsectionName("");
                }}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setShowNameInput(true)}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
        >
          + Add Subsection
        </button>
      )}
      {showGBulletInput ? (
        <div>
          <input
            type="text"
            value={newGBulletPointName}
            onChange={(e) => setNewGBulletPointName(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            placeholder="New bullet point"
          />
          <button
            onClick={() => {
              newBulletPoint(newGBulletPointName);
              setNewGBulletPointName("");
              setGBulletInput(false);
            }}
          >
            Add
          </button>
          <button
            onClick={() => {
              setNewGBulletPointName("");
              setGBulletInput(false);
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setGBulletInput(true)}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
        >
          + Add Bullet Point
        </button>
      )}
    </div>
  );
};
