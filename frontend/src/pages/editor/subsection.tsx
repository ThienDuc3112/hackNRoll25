import React, { useState } from "react";
import { X, Plus, Edit2 } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const Field = ({
  id,
  label,
  content,
  onRemove,
  onUpdateLabel,
  onUpdateContent,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newLabel, setNewLabel] = useState(label);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = () => {
    onUpdateLabel(newLabel);
    setIsEditing(false);
  };

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
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
                if (e.key === "Escape") setIsEditing(false);
              }}
            />
            <button onClick={handleSubmit} className="text-sm text-blue-500">
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
        onChange={(e) => onUpdateContent(e.target.value)}
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
                  onRemove();
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
  name,
  isDropped = false,
  onRemove,
  fields: initialFields,
  onFieldsUpdate,
}) => {
  const [fields, setFields] = useState(
    initialFields || [{ id: 1, label: "Field 1", content: "" }]
  );
  const [fieldCounter, setFieldCounter] = useState(2);
  const [showConfirm, setShowConfirm] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    data: {
      type: 'subsection',
      name,
      fields,
    },
    disabled: isDropped,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    touchAction: 'none',
  };

  const addField = () => {
    const newFields = [
      ...fields,
      { id: fieldCounter, label: `Field ${fieldCounter}`, content: "" },
    ];
    updateFields(newFields);
    setFieldCounter(fieldCounter + 1);
  };

  const updateFields = (newFields) => {
    setFields(newFields);
    if (onFieldsUpdate) {
      onFieldsUpdate(newFields);
    }
  };

  const updateFieldContent = (fieldId, content) => {
    updateFields(
      fields.map((field) =>
        field.id === fieldId ? { ...field, content } : field
      )
    );
  };

  const removeField = (fieldId) => {
    updateFields(fields.filter((field) => field.id !== fieldId));
  };

  const updateFieldLabel = (fieldId, newLabel) => {
    updateFields(
      fields.map((field) =>
        field.id === fieldId ? { ...field, label: newLabel } : field
      )
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`w-full p-4 mb-4 rounded-lg ${
        !isDropped ? "bg-white shadow-md cursor-move" : "bg-white shadow-md"
      } ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">{name}</h3>
        <button
          onClick={() => setShowConfirm(true)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X size={16} />
        </button>
      </div>

      <div>
        {fields.map((field) => (
          <Field
            key={field.id}
            id={field.id}
            label={field.label}
            content={field.content}
            onRemove={() => removeField(field.id)}
            onUpdateLabel={(newLabel) => updateFieldLabel(field.id, newLabel)}
            onUpdateContent={(content) => updateFieldContent(field.id, content)}
          />
        ))}
      </div>

      <button
        onClick={addField}
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
                  onRemove();
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