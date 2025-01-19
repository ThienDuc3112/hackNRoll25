import { useMemo, useState } from "react";
import { IdItemType, SubsectionType } from "./types";
import { useEditorAtom } from "./state";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { MenuItemView } from "./MenuItemView";

type MenuBarProps = {
  dividerPosition: number;
  menu: IdItemType[];
};

export const MenuBar = ({ dividerPosition, menu }: MenuBarProps) => {
  // For adding new subsections from the menu
  const [showNameInput, setShowNameInput] = useState(false);
  const [newSubsectionName, setNewSubsectionName] = useState("");
  const [newSubsectionSubTitle, setNewSubsectionSubTitle] = useState("");
  const [timerange, setTimerange] = useState("");

  const [showGBulletInput, setGBulletInput] = useState(false);
  const { newBulletPoint, newSubSection, deleteItem } = useEditorAtom();
  const [newGBulletPointName, setNewGBulletPointName] = useState("");

  const items = useMemo(() => menu.map(val => `MENU-${val}`), [menu])

  const addNewSubsection = (subSection: SubsectionType) => {
    newSubSection(subSection);
  };

  return (
    <div
      className="flex h-full flex-col bg-gray-200 p-4 overflow-y-auto"
      style={{ width: `${dividerPosition}%` }}
    >
      {/** Render the items from the menu */}
      <SortableContext strategy={verticalListSortingStrategy} items={items}>
        {menu.map((itemId) => <MenuItemView itemId={itemId} key={itemId} onDelete={deleteItem} />)}
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
              setGBulletInput(false)
            }}
          >
            Add
          </button>
          <button
            onClick={() => {
              setNewGBulletPointName("");
              setGBulletInput(false)
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
