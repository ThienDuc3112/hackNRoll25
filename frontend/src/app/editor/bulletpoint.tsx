"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { PointType } from "./types";
import { useEditorAtom } from "./state";

type BulletPointProps = {
  point: PointType;
  onDelete?: (id: string) => void;
  allowEdit?: boolean;
};

const BulletPoint = ({
  point,
  onDelete,
  allowEdit = false,
}: BulletPointProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editting, setEditting] = useState(false);
  const [value, setValue] = useState(point.data);
  const { updatePoint } = useEditorAtom();
  if (point === undefined) return null;

  return (
    <div
      onMouseEnter={() => {
        if (!editting) setShowEdit(true);
      }}
      onMouseLeave={() => setShowEdit(false)}
      className="relative"
    >
      {/* Bullet Point Header */}
      <div className="flex justify-between items-center">
        <div className="flex-1 flex items-start">
          {editting ? (
            <form
              onSubmit={() => {
                updatePoint(point.id, value);
                setEditting(false);
              }}
            >
              <input
                className="w-52"
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </form>
          ) : (
            <>
              <span className="text-gray-800 mr-2">•</span>
              <span className="text-gray-800">{point.data}</span>
            </>
          )}
        </div>
        {allowEdit && (
          <button
            onClick={() => setShowConfirm(true)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={16} />
          </button>
        )}
      </div>
      {allowEdit && showEdit && (
        <div className="absolute top-[-30px] left-0 h-[20px]">
          <button
            onClick={() => {
              setShowEdit(false);
              setEditting(true);
            }}
            className="border rounded-md bg-blue-500 px-2 py-1 text-white"
          >
            Edit
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="font-semibold mb-2">Delete Bullet Point</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this bullet point?
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
                  if (onDelete) {
                    onDelete(point.id);
                  }
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

export default BulletPoint;
