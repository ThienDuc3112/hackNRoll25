import { useState } from "react";
import { X, Plus } from "lucide-react";
import { PointType, SubsectionType } from "./types";
import { useAtomValue } from "jotai";
import { itemMapAtom, useEditorAtom } from "./state";
import BulletPoint from "./bulletpoint";

const Subsection = ({
  subSection,
  allowEdit = true,
}: {
  subSection: SubsectionType;
  allowEdit?: boolean;
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const itemMap = useAtomValue(itemMapAtom);
  const [showBulletInput, setBulletInput] = useState(false);
  const { newBulletPoint, addPointToSubSection, deleteSubSection } =
    useEditorAtom();
  const [newBulletPointName, setNewBulletPointName] = useState("");

  return (
    <div className="w-full p-4 mb-4 rounded-lg bg-white shadow-md cursor-move">
  {/* Subsection Header */}
  <div className="mb-3 border-b pb-3">
    <div className="flex justify-between items-center">
      <h3 className="font-semibold text-lg">{subSection.title}</h3>
      <p className="text-sm text-gray-500 mr-4">{subSection.timeRange}</p>
      {allowEdit && (
        <button
          onClick={() => setShowConfirm(true)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X size={16} />
        </button>
      )}
    </div>
    <p className="text-gray-700 mt-2">{subSection.description}</p>
  </div>

  {/* Bullet Points */}
  <div className="ml-1">
    {subSection.items.map((point, i) => (
      <BulletPoint key={i} point={itemMap[point] as PointType} />
    ))}
  </div>

  {/* Add Bullet Point Input */}
  {showBulletInput ? (
    <div className="mt-4">
      <input
        type="text"
        value={newBulletPointName}
        onChange={(e) => setNewBulletPointName(e.target.value)}
        className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="New bullet point"
      />
      <button
        onClick={() => {
          const pointId = newBulletPoint(newBulletPointName);
          addPointToSubSection(pointId, subSection.id);
          setNewBulletPointName("");
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add
      </button>
    </div>
  ) : (
    allowEdit && (
      <button
        onClick={() => setBulletInput(true)}
        className="mt-2 flex items-center text-sm text-blue-500 hover:text-blue-600"
      >
        <Plus size={16} className="mr-1" /> Add Bullet Point
      </button>
    )
  )}

  {/* Confirmation Modal */}
  {showConfirm && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
        <h3 className="font-semibold mb-2">Delete Subsection</h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete this subsection?
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
            onClick={() => setShowConfirm(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded"
            onClick={() => {
              setShowConfirm(false);
              deleteSubSection(subSection.id);
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
