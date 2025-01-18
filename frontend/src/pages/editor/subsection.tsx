import { useState } from "react";
import { X, Plus } from "lucide-react";
import { PointType, SubsectionType } from "./types";
import { useAtomValue } from "jotai";
import { itemMapAtom, useEditorAtom } from "./state";
import BulletPoint from "./bulletpoint";

const Subsection = ({ subSection }: { subSection: SubsectionType }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const itemMap = useAtomValue(itemMapAtom);

  const {newBulletPoint} = useEditorAtom()

  return (
    <div
      className={"w-full p-4 mb-4 rounded-lg bg-white shadow-md cursor-move"}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">{subSection.title}</h3>
        <button
          onClick={() => setShowConfirm(true)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X size={16} />
        </button>
      </div>

      <div>
        {subSection.items.map((point, i) => (
          <BulletPoint point={itemMap[point] as PointType} />
        ))}
      </div>

      <button onClick={() => {
        
      }} className="mt-2 flex items-center text-sm text-blue-500 hover:text-blue-600">
        <Plus size={16} className="mr-1" /> Add Bullet Point
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="font-semibold mb-2">Delete Subsection</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this subsection?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white hover:bg-red-600 rounded"
                onClick={() => {
                  setShowConfirm(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subsection;