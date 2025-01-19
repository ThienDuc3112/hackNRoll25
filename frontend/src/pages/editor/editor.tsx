import React, { useState } from "react";
import { activeAtom, useEditorAtom } from "./state";
import { MenuBar } from "./MenuBar";
import { ResumeView } from "./ResumeView";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { useAtom } from "jotai";
import { createPortal } from "react-dom";
import { Section } from "./section";
import { ItemView } from "./ItemView";
import { MenuItemView } from "./MenuItemView";

const Editor = () => {
  // Divider state for left & right panes
  const [dividerPosition, setDividerPosition] = useState(40);
  // Access your editor state & actions
  const { editorState, move, newSection, moveSection, filterItem, moveMenuItem } = useEditorAtom();

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

  const [activeId, setActive] = useAtom(activeAtom)

  const onDragStart = (e: DragStartEvent) => {
    setActive({
      type: e.active.data.current!.type,
      id: e.active.id
    })
  }

  const onDragOver = (e: DragOverEvent) => {
    console.log("onDragOver called", e.over, e.active)

    if (!e.over || !e.over.data.current) {
      return;
    }

    if (e.active.data.current?.type === "ITEM") {
      // Drag over section
      if (e.over.data.current.type === "SECTION") {
        // 1.1 Over Section
        move(e.active.id as string, e.over.id as string, 0)

      } else if (e.over.data.current.type === "ITEM") {
        // 1.2 Over Item
        move(
          e.active.id as string,
          e.over.data.current.parentContainerId,
          e.over.data.current.sortable.index
        )
      }
    } else if (e.active.data.current?.type === "MENU_ITEM") {
      const activeId = (e.active.id as string).substring(5)
      if (e.over.data.current.type === "SECTION") {
        // 3.1 Over Section
        move(activeId, e.over.id as string, 0)
      } else if (e.over.data.current.type === "ITEM") {
        // 3.2 Over Item
        move(
          activeId,
          e.over.data.current.parentContainerId,
          e.over.data.current.sortable.index
        )
      } else {
        filterItem(activeId)
      }
    }
  }

  const onDragEnd = (e: DragEndEvent) => {
    console.log("OnDragEnd called", e.active, e.over)
    setActive(() => null)

    if (e.active.data.current?.type === "SECTION") {
      // 1, Section dragging
      if (!e.over || !e.over.data.current || e.over.data.current.type !== "SECTION") {
        return;
      }
      let targetIndex = e.over.data.current!.sortable.index
      moveSection(e.active.id as string, targetIndex)

    } else if (e.active.data.current?.type === "ITEM") {
      // 2, Item Dragging
      if (!e.over || !e.over.data.current) {
        return;
      }
      if (e.over.data.current.type === "SECTION") {
        // 2.1 Over Section
        move(e.active.id as string, e.over.id as string, 0)

      } else if (e.over.data.current.type === "ITEM") {
        // 2.2 Over Item
        move(
          e.active.id as string,
          e.over.data.current.parentContainerId,
          e.over.data.current.sortable.index
        )

      } else if (e.over.data.current.type === "MENU_ITEM") {
        // 2.3 Over Menu-Item
        filterItem(e.active.id as string)
      } else {
        console.log("WARNING: OVER ITEM DON'T HAVE TYPE")
      }
      console.log(e.over)

    } else if (e.active.data.current?.type === "MENU_ITEM") {
      // 3, Menu Item Dragging
      if (!e.over || !e.over.data.current) {
        return;
      }
      const activeId = (e.active.id as string).substring(5)
      if (e.over.data.current.type === "SECTION") {
        // 3.1 Over Section
        move(activeId, e.over.id as string, 0)
      } else if (e.over.data.current.type === "ITEM") {
        // 3.2 Over Item
        move(
          activeId,
          e.over.data.current.parentContainerId,
          e.over.data.current.sortable.index
        )

      } else if (e.over.data.current.type === "MENU_ITEM") {
        moveMenuItem(
          activeId,
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
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="fixed inset-0 flex w-full overflow-hidden">
        {/** ==================== LEFT SIDEBAR ==================== */}
        <MenuBar
          dividerPosition={dividerPosition}
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
      {
        createPortal(
          <DragOverlay>
            {activeId && activeId.type === "SECTION" && <Section section={(() => {
              return editorState.sections.find(val => val.id === activeId.id)
            })()!} />}
            {activeId && activeId.type === "ITEM" && <ItemView parentContainerId="" itemId={activeId.id as string} />}
            {activeId && activeId.type === "MENU_ITEM" && <MenuItemView onDelete={(_) => { }} itemId={(activeId.id as string).substring(5)} />}
          </DragOverlay>,
          document.body
        )
      }
    </DndContext>
  );
};


export default Editor;
