import { useState } from "react";
import { X, Plus, Edit2 } from "lucide-react";
import { PointType, SubsectionType } from "./types";
import { useAtomValue } from "jotai";
import { itemMapAtom } from "./state";

const Field = ({
  id,
  label,
  content,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newLabel, setNewLabel] = useState(label);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        {isEditing ? (
          <div className="flex gap-2">
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="text-sm p-1 border rounded"
              autoFocus
            />
            <button className="text-sm text-blue-500">
              Save
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Edit2 size={14} />
            </button>
          </div>
        )}
        <button
          onClick={() => setShowConfirm(true)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X size={14} />
        </button>
      </div>
      <textarea
        value={content}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={2}
      />

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="font-semibold mb-2">Delete Field</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this field?
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

const Subsection = ({
  id,
  isDropped = false,
  onRemove,
  subSection
}: {
  id: string,
  isDropped: boolean,
  onRemove: (str: string) => void,
  subSection: SubsectionType,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const itemMap = useAtomValue(itemMapAtom)

  return (
    <div
      className={`w-full p-4 mb-4 rounded-lg ${!isDropped ? "bg-white shadow-md cursor-move" : "bg-white shadow-md"
        }`}
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
          <Field
            key={i}
            id={`menu-${point}`}
            label={""}
            content={(itemMap[point] as PointType).data}
          />
        ))}
      </div>

      <button
        className="mt-2 flex items-center text-sm text-blue-500 hover:text-blue-600"
      >
        <Plus size={16} className="mr-1" /> Add Field
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="font-semibold mb-2">Delete Component</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this component?
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
                  //onRemove();
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
