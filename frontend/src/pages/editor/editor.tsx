import React, { useState } from "react";
import { activeAtom, useEditorAtom } from "./state";
import { MenuBar } from "./MenuBar";
import { ResumeView } from "./ResumeView";
import { DndContext, DragCancelEvent, DragEndEvent, DragMoveEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { useSetAtom } from "jotai";

const Editor = () => {
  // Divider state for left & right panes
  const [dividerPosition, setDividerPosition] = useState(50);
  // Access your editor state & actions
  const { editorState, move, newSection, moveSection } = useEditorAtom();

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

  const setActive = useSetAtom(activeAtom)

  const onDragStart = (e: DragStartEvent) => {
    console.log(e)
    setActive({
      type: e.active.data.current!.type,
      id: e.active.id
    })
  }

  const onDragMove = (e: DragMoveEvent) => {

  }

  const onDragEnd = (e: DragEndEvent) => {
    console.log("OnDragEnd called")
    setActive(() => null)
    if (e.active.data.current?.type === "SECTION") {
      if (!e.over || !e.over.data.current) {
        return;
      }
      let targetIndex = e.over.data.current!.sortable.index
      moveSection(e.active.id as string, targetIndex)
    } else if (e.active.data.current?.type === "ITEM") {
      if (!e.over || !e.over.data.current) {
        return;
      }
      if (e.over.data.current.type === "SECTION") {
        move(e.active.id as string, e.over.id as string, 0)
      } else if (e.over.data.current.type === "ITEM") {
        move(
          e.active.id as string,
          e.over.data.current.parentContainerId,
          e.over.data.current.sortable.index
        )
      } else {
        console.log("WARNING: OVER ITEM DON'T HAVE TYPE")
      }
      console.log(e.over)
    } else {
      console.log("WARNING: ACTIVE ITEM DON'T HAVE TYPE")
    }
  }

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


export default Editor;
