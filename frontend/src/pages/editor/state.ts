import { atom, useAtom } from "jotai"
import { EditorStateType, ItemType } from "./types"
import { arrayMove } from "@dnd-kit/sortable"

export const editorAtom = atom<EditorStateType>({
  menu: ["test", "education"],
  sections: [
    {
      id: "default",
      displayName: "Default Section",
      items: ["skill"]
    },
  ],
  itemMap: {
    test: {
      type: "SUBSECTION",
      id: "test",
      title: "Test subsection",
      items: ["test2"],
      description: "This is a test subsection",
      timeRange: "beginning of time - now"
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
} as EditorStateType)

export const itemMapAtom = atom<Record<string, ItemType>>((get) => get(editorAtom).itemMap)

export const useEditorAtom = () => {
  const [editorState, setEditorState] = useAtom(editorAtom)

  const move = (itemId: string, sectionId: string, targetIndex: number) => {
    console.log(`move ${itemId} to ${sectionId}[${targetIndex}]`)
    setEditorState(prev => {
      if (!prev.itemMap[itemId]) return prev;
      //console.log("prev", prev)

      const newState = {
        itemMap: prev.itemMap,
        sections: [...prev.sections],
        menu: prev.menu.filter(val => val !== itemId)
      }

      newState.sections = newState.sections.map(section => {
        const newSection = { ...section }
        newSection.items = newSection.items.filter(val => val !== itemId)
        if (newSection.id === sectionId) {
          newSection.items.splice(targetIndex, 0, itemId)
        }
        return newSection
      })

      return newState
    })
  }

  const moveSection = (activeSectionId: string, targetIndex: number) => {
    const { sections } = editorState
    const newSections = arrayMove(sections, sections.findIndex(val => val.id === activeSectionId), targetIndex)
    setEditorState(prev => ({
      ...prev,
      sections: newSections
    }))
  }

  const newSection = (id: string, name: string) => {
    setEditorState(prev => ({
      ...prev, sections: [
        ...prev.sections,
        {
          id: id,
          displayName: name,
          items: []
        }
      ]
    }))
  }

  return { editorState, move, moveSection, newSection }
}

