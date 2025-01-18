import { atom, useAtom } from "jotai"
import { EditorState, IdItem, Item, Section } from "./types"

export const editorAtom = atom<EditorState>({
  menu: ["test", "skill", "education"],
  sections: {
    "default": {
      id: "default",
      displayName: "Default Section",
      items: ["test2"]
    }
  },
  itemMap: {
    test: {
      type: "POINT",
      data: "Test point 1",
      id: "test"
    },
    "test2": {
      type: "POINT",
      data: "Test point 2",
      id: "test2"
    },
    skill: {
      type: "POINT",
      data: "Skill: CSS, JS, HTML, Golang",
      id: "skill"
    },
    education: {
      type: "POINT",
      data: "Bachelor of Engineering in Computer Enginnering (with Honours*)",
      id: "education"
    },
  }
} as EditorState)

export const itemMapAtom = atom<Record<string, Item>>((get) => get(editorAtom).itemMap)

const filterSection = (sections: Record<string, Section>, itemId: IdItem): Record<string, Section> => {
  const newSections = { ...sections }
  for (const sectionKey in newSections) {
    newSections[sectionKey] = { ...newSections[sectionKey] }
    newSections[sectionKey].items = newSections[sectionKey].items.filter(val => val !== itemId)
  }
  return newSections
}

export const useEditorAtom = () => {
  const [editorState, setEditorState] = useAtom(editorAtom)

  const move = (itemId: string, sectionId: string, targetIndex: number) => {
    console.log(`move ${itemId} to ${sectionId}[${targetIndex}]`)
    setEditorState(prev => {
      if (!prev.itemMap[itemId]) return prev;
      console.log("prev", prev)

      const newState = {
        itemMap: prev.itemMap,
        sections: filterSection(prev.sections, itemId),
        menu: prev.menu.filter(val => val !== itemId)
      }

      if (sectionId === "") {
        console.log("move to menu")
        const updatedMenu = [...newState.menu]
        updatedMenu.splice(targetIndex, 0, itemId)
        newState.menu = updatedMenu
      } else if (newState.sections[sectionId] === undefined) {
        console.log("unhandled", newState.sections, sectionId)
        // Handled later
        return prev
      } else {
        console.log("move to section")
        const updatedItems = [...newState.sections[sectionId].items]
        updatedItems.splice(targetIndex, 0, itemId)
        newState.sections[sectionId].items = updatedItems
      }

      return newState
    })
  }

  const newSection = (id: string, name: string) => {
    setEditorState(prev => ({
      ...prev, sections: {
        ...prev.sections,
        [name]: {
          id: id,
          displayName: name,
          items: []
        }
      }
    }))
  }

  return { editorState, move, newSection }
}

