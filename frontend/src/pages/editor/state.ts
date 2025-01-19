import { atom, useAtom } from "jotai";
import { EditorStateType, ItemType, PointType, SubsectionType } from "./types";
import { arrayMove } from "@dnd-kit/sortable";
import { UniqueIdentifier } from "@dnd-kit/core";

const initialItemMap: Record<string, ItemType> = {
  test: {
    type: "SUBSECTION",
    id: "test",
    title: "Test subsection",
    items: ["education"],
    description: "This is a test subsection",
    timeRange: "beginning of time - now",
  },
  project: {
    type: "SUBSECTION",
    id: "project",
    title: "Resume Builder",
    items: [],
    description: "This very website",
    timeRange: "now - now",
  },
  test2: {
    type: "POINT",
    data: "Test point 2",
    id: "test2",
  },
  skill: {
    type: "POINT",
    data: "Skill: CSS, JS, HTML, Golang",
    id: "skill",
  },
  education: {
    type: "POINT",
    data: "Bachelor of Engineering in Computer Enginnering (with Honours*)",
    id: "education",
  },
}

export const editorAtom = atom<EditorStateType>({
  menu: Object.keys(initialItemMap),
  sections: [
    {
      id: "default",
      displayName: "Default Section",
      items: ["test", "skill", "test2"],
    },
    {
      id: "project-section",
      displayName: "Projects",
      items: ["project"],
    },
  ],
  itemMap: initialItemMap,
} as EditorStateType);

export const itemMapAtom = atom<Record<string, ItemType>>(
  (get) => get(editorAtom).itemMap
);

export const useEditorAtom = () => {
  const [editorState, setEditorState] = useAtom(editorAtom);

  const move = (itemId: string, sectionId: string, targetIndex: number) => {
    //console.log(`move ${itemId} to ${sectionId}[${targetIndex}]`);
    setEditorState((prev) => {
      if (!prev.itemMap[itemId]) return prev;
      //console.log("prev", prev)

      const newState = {
        itemMap: prev.itemMap,
        sections: [...prev.sections],
        //menu: prev.menu.filter((val) => val !== itemId),
        menu: [...prev.menu]
      };

      newState.sections = newState.sections.map((section) => {
        const newSection = { ...section };
        newSection.items = newSection.items.filter((val) => val !== itemId);
        if (newSection.id === sectionId) {
          newSection.items.splice(targetIndex, 0, itemId);
        }
        return newSection;
      });

      return newState;
    });
  };

  const moveSection = (activeSectionId: string, targetIndex: number) => {
    const { sections } = editorState;
    const newSections = arrayMove(
      sections,
      sections.findIndex((val) => val.id === activeSectionId),
      targetIndex
    );
    setEditorState((prev) => ({
      ...prev,
      sections: newSections,
    }));
  };

  const newSection = (id: string, name: string) => {
    setEditorState((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: id,
          displayName: name,
          items: [],
        },
      ],
    }));
  };

  const newBulletPoint = (data: string): string => {
    const newId = Math.random().toString();
    setEditorState((prev) => {
      const newPoint: PointType = {
        id: newId,
        data,
        type: "POINT",
      };
      const newState: EditorStateType = {
        ...prev,
        itemMap: {
          ...prev.itemMap,
          [newId]: newPoint,
        },
        menu: [...prev.menu, newId],
      };
      return newState;
    });
    return newId;
  };

  const newSubSection = (subsection: SubsectionType) => {
    const newId = Math.random().toString();
    setEditorState((prev) => {
      const newState: EditorStateType = {
        ...prev,
        itemMap: {
          ...prev.itemMap,
          [newId]: {
            ...subsection,
            id: newId,
          },
        },
        menu: [...prev.menu, newId],
      };

      return newState;
    });
  };

  const addPointToSubSection = (pointId: string, subSectionId: string) => {
    setEditorState((prev) => {
      const subSection = prev.itemMap[subSectionId];
      const point = prev.itemMap[pointId];
      if (
        subSection == undefined ||
        point == undefined ||
        subSection.type != "SUBSECTION" ||
        point.type != "POINT"
      ) {
        return prev;
      }
      const newState = { ...prev };
      const newSubSection = { ...subSection };
      newSubSection.items = [...newSubSection.items, point.id];
      newState.itemMap[newSubSection.id] = newSubSection;
      return newState;
    });
  };

  const filterItem = (itemId: string) => {
    setEditorState(prev => ({
      ...prev,
      sections: prev.sections.map(section => ({ ...section, items: section.items.filter(val => val !== itemId) }))
    }))
  }

  const moveMenuItem = (activeMItem: string, targetIndex: number) => {
    setEditorState(prev => {
      const index = prev.menu.findIndex(val => val === activeMItem)
      if (index >= 0) {
        return { ...prev, menu: arrayMove(prev.menu, index, targetIndex) }
      } else {
        return prev
      }
    })
  }

  const deleteItem = (itemId: string) => {
    setEditorState(prev => {
      const newState = {
        menu: prev.menu.filter(val => val !== itemId),
        sections: prev.sections.map(section => ({ ...section, items: section.items.filter(val => val !== itemId) })),
        itemMap: { ...prev.itemMap }
      }
      delete newState.itemMap[itemId]
      return newState
    })
  }

  return {
    editorState,
    move,
    moveSection,
    moveMenuItem,
    newBulletPoint,
    newSubSection,
    addPointToSubSection,
    newSection,
    filterItem,
    deleteItem
  };
};

export const activeAtom = atom<{
  type: "SECTION" | "ITEM" | "MENU_ITEM"
  id: UniqueIdentifier
} | null>(null)
