import React, { useState } from "react";
import { useEditorAtom } from "./state";
import { MenuBar } from "./MenuBar";
import { ResumeView } from "./ResumeView";
import { DndContext, DragEndEvent, DragMoveEvent, DragStartEvent } from "@dnd-kit/core";

const Editor = () => {
  // Divider state for left & right panes
  const [dividerPosition, setDividerPosition] = useState(50);
  // Access your editor state & actions
  const { editorState, newSection } = useEditorAtom();

  /** Draggable divider logic */
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const handleMouseMove = (event: MouseEvent) => {
      const newDividerPosition = (event.clientX / window.innerWidth) * 100;
      setDividerPosition(Math.max(10, Math.min(newDividerPosition, 90)));
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
    >
      <div className="fixed inset-0 flex w-full overflow-hidden">
        {/** ==================== LEFT SIDEBAR ==================== */}
        <MenuBar
          dividerPosition={dividerPosition}
          itemMap={editorState.itemMap}
          menu={editorState.menu}
        />

        {/** ==================== DRAGGABLE DIVIDER ==================== */}
        <div
          className="w-1 h-full bg-gray-400 cursor-col-resize hover:bg-gray-500"
          onMouseDown={handleMouseDown}
        />

        {/** ==================== RIGHT SIDE (Resume Document) ==================== */}
        <ResumeView
          newSection={newSection}
          dividerPosition={dividerPosition}
          sections={editorState.sections}
        />
      </div>
    </DndContext>
  );
};

const onDragStart = (e: DragStartEvent) => {
  console.log(e)
}

const onDragMove = (e: DragMoveEvent) => {

}

const onDragEnd = (e: DragEndEvent) => {

}

export default Editor;
