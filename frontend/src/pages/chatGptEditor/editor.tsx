import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
//import { v4 as uuid } from "uuid";
const uuid = () => {
  return (Math.random() * 100000).toString()
}

/** -----------------------------
 *  Types
 * -----------------------------
 */
type BulletPoint = {
  id: string;
  type: "bullet";
  content: string;
};

type Subsection = {
  id: string;
  type: "subsection";
  title: string;
  timeRange: string;
  subtitle: string;
  bullets: string[];
};

type Item = BulletPoint | Subsection;

type Section = {
  id: string;
  title: string;
  items: Item[];
};

/** -----------------------------
 *  Helpers to render items
 * -----------------------------
 */
function RenderItem({ item }: { item: Item }) {
  if (item.type === "bullet") {
    return (
      <div className="px-2 py-1 bg-white border rounded shadow-sm">
        • {item.content}
      </div>
    );
  }

  // Subsection
  return (
    <div className="p-2 bg-white border rounded shadow-sm space-y-1">
      <div className="flex justify-between font-semibold">
        <span>{item.title}</span>
        <span>{item.timeRange}</span>
      </div>
      <div className="text-sm text-gray-700 italic">{item.subtitle}</div>
      <ul className="list-disc list-inside text-gray-800 mt-1">
        {item.bullets.map((b, idx) => (
          <li key={idx}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

/** -----------------------------
 *  SortableItem
 *  - For items inside each section that can be reordered
 * -----------------------------
 */
function SortableItem({ item }: { item: Item }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <RenderItem item={item} />
    </div>
  );
}

/** -----------------------------
 *  DraggableItemFromMenu
 *  - For items in the menu (left side),
 *    which we can drag to the resume
 * -----------------------------
 */
function DraggableItemFromMenu({ item }: { item: Item }) {
  // We'll treat menu items differently by storing "fromMenu" in the data
  // so we know to clone them on drop
  return (
    <div
      className="cursor-pointer p-2 bg-white border rounded shadow-sm"
      // We'll rely on the sensor-based approach in the DndContext, so
      // no separate `useDraggable` here. @dnd-kit will pick up the item data
      // onDragStart via the sensor. (Alternatively, we could do `useDraggable`.)
      draggable
      onDragStart={(e) => {
        // Some older browsers need dataTransfer set, but with @dnd-kit it’s optional.
        e.dataTransfer.setData("text/plain", item.id);
      }}
    >
      <RenderItem item={item} />
    </div>
  );
}

/** -----------------------------
 *  SectionView
 *  - Renders a section with SortableContext
 * -----------------------------
 */
function SectionView({ section }: { section: Section }) {
  return (
    <div className="border p-2 mb-4 bg-gray-50 rounded">
      <h2 className="font-bold mb-2">{section.title}</h2>

      {/* Wrap items in SortableContext for reordering */}
      <SortableContext
        items={section.items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {section.items.map((item) => (
          <SortableItem key={item.id} item={item} />
        ))}
      </SortableContext>
    </div>
  );
}

/** -----------------------------
 *  Main App
 * -----------------------------
 */
export default function App() {
  /** -----------------------------
   *  State
   * -----------------------------
   */
  const [menuItems] = useState<Item[]>([
    {
      id: "menu-bullet-1",
      type: "bullet",
      content: "Sample bullet point",
    },
    {
      id: "menu-subsection-1",
      type: "subsection",
      title: "Subsection Title",
      timeRange: "2022 - 2023",
      subtitle: "Some subtitle",
      bullets: ["Bullet A", "Bullet B"],
    },
  ]);

  const [sections, setSections] = useState<Section[]>([
    {
      id: "section-1",
      title: "Experience",
      items: [],
    },
    {
      id: "section-2",
      title: "Education",
      items: [],
    },
  ]);

  // For showing a drag preview (overlay).
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  // Keep track of which section the dragged item originated from, if any:
  const [sourceSectionId, setSourceSectionId] = useState<string | null>(null);

  /** -----------------------------
   *  DndContext sensors
   * -----------------------------
   */
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  /** -----------------------------
   *  Handlers
   * -----------------------------
   */

  // Add a new empty section
  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      {
        id: uuid(),
        title: "New Section",
        items: [],
      },
    ]);
  };

  /**
   * onDragStart
   * - Identify which item is being dragged.
   */
  function handleDragStart(event: DragStartEvent) {
    // event.active holds info about the dragged item
    const activeId = event.active.id;
    // If activeId starts with "menu-", it's from the menu, or we can store more meta
    let foundItem: Item | null = null;

    // Check if it's from the menu:
    const menuItem = menuItems.find((m) => m.id === activeId);
    if (menuItem) {
      foundItem = menuItem;
      setSourceSectionId(null); // It's from the menu
    } else {
      // Otherwise, find it in sections
      for (const sec of sections) {
        const it = sec.items.find((i) => i.id === activeId);
        if (it) {
          foundItem = it;
          setSourceSectionId(sec.id);
          break;
        }
      }
    }

    if (foundItem) {
      setActiveItem(foundItem);
    }
  }

  /**
   * onDragEnd
   * - Determine where the item is dropped and handle adding/reordering.
   */
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) {
      // Dropped outside of any droppable region
      setActiveItem(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id; // This could be a section or an item in the section

    // If the overId is exactly a section id, we want to drop at the bottom of that section
    // Or if it's an item id, we want to insert before/after that item.
    // With @dnd-kit/sortable, typically `over.id` is the item’s ID in the list.
    // We'll use the section's array to reorder. We'll find which section's SortableContext
    // you dropped into.

    let newSections = [...sections];

    // 1. Identify which section the "over" item belongs to
    let targetSectionId: string | null = null;
    let targetItemIndex = -1;

    // Find the item with overId or see if overId is a section
    for (const sec of newSections) {
      // If the overId matches the section ID, we place the item at the end
      if (sec.id === overId) {
        targetSectionId = sec.id;
        targetItemIndex = sec.items.length; // place at end
        break;
      }

      // Otherwise, find if there's an item with ID = overId
      const idx = sec.items.findIndex((i) => i.id === overId);
      if (idx !== -1) {
        targetSectionId = sec.id;
        targetItemIndex = idx;
        break;
      }
    }

    if (!targetSectionId) {
      // If we can't find a matching section or item, do nothing
      setActiveItem(null);
      return;
    }

    const isFromMenu = (activeId as string).startsWith("menu-");
    let draggedItem = activeItem;

    // 2. If the item is from the menu, clone & assign new ID
    if (isFromMenu && draggedItem) {
      draggedItem = {
        ...draggedItem,
        id: uuid(),
      };
    }

    // 3. If item is from a section, remove it from that section
    if (!isFromMenu && draggedItem && sourceSectionId) {
      newSections = newSections.map((sec) => {
        if (sec.id === sourceSectionId) {
          return {
            ...sec,
            items: sec.items.filter((it) => it.id !== activeId),
          };
        }
        return sec;
      });
    }

    // 4. Insert/append the item into the target section’s items
    if (draggedItem) {
      // Find the target section
      const secIndex = newSections.findIndex((s) => s.id === targetSectionId);
      if (secIndex !== -1) {
        const targetSec = newSections[secIndex];
        // Insert at targetItemIndex
        const updatedItems = [
          ...targetSec.items.slice(0, targetItemIndex),
          draggedItem,
          ...targetSec.items.slice(targetItemIndex),
        ];
        // Because we are using SortableContext, if we dropped an item inside the same section,
        // we might want to reorder with arrayMove. Let's see:

        // But we already removed from old location & reinserted. That effectively reorders it.

        newSections[secIndex] = {
          ...targetSec,
          items: updatedItems,
        };
      }
    }

    // 5. Update sections
    setSections(newSections);

    // 6. Reset state
    setActiveItem(null);
    setSourceSectionId(null);
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Menu */}
      <div className="w-1/4 p-4 space-y-4 bg-white shadow">
        <h1 className="text-xl font-bold mb-2">Menu</h1>
        <p className="text-sm text-gray-600">Drag these into resume sections:</p>
        <div className="space-y-2">
          {menuItems.map((item) => (
            <DraggableItemFromMenu key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Main Resume Editor */}
      <div className="flex-1 p-4">
        <button
          onClick={handleAddSection}
          className="mb-4 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Section
        </button>

        {/**
         * Wrap the entire right side in a DndContext
         * so we can handle reordering + dropping items from the menu.
         */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Each section is its own SortableContext in SectionView */}
          {sections.map((section) => (
            <SectionView key={section.id} section={section} />
          ))}
        </DndContext>
      </div>
    </div>
  );
}
