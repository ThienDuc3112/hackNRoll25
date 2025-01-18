import { DndContext, DragEndEvent, UniqueIdentifier, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { atom, useAtom } from 'jotai';
import { ReactNode, useState } from 'react';

type idItem = string

type Point = {
  id: idItem,
  type: "POINT",
  data: string
}

type Subsection = {
  id: idItem,
  type: "SUBSECTION",
  title: string,
  timeRange: string,
  description: string,
  children: Point[]
}

type Item = Point | Subsection

type Section = {
  id: string,
  displayName: string,
  items: idItem[]
}

type EditorState = {
  menu: idItem[]
  sections: Record<string, Section>,
  itemMap: Record<string, Item>
}

const editorAtom = atom({
  menu: ["test", "skill", "education"],
  sections: {},
  itemMap: {
    test: {
      type: "POINT",
      data: "Test point 1",
      id: "test"
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

const filterSection = (sections: Record<string, Section>, itemId: idItem): Record<string, Section> => {
  const newSections = { ...sections }
  for (const sectionKey in newSections) {
    newSections[sectionKey] = { ...newSections[sectionKey] }
    newSections[sectionKey].items = newSections[sectionKey].items.filter(val => val !== itemId)
  }
  return newSections
}

const useEditorAtom = () => {
  const [editorState, setEditorState] = useAtom(editorAtom)

  const move = (itemId: string, sectionId: string) => {
    setEditorState(prev => {
      if (!prev.itemMap[itemId]) return prev;

      const newState = {
        itemMap: prev.itemMap,
        sections: filterSection(prev.sections, itemId),
        menu: prev.menu.filter(val => val !== itemId)
      }

      if (sectionId === "") {
        newState.menu.push(itemId)
      } else if (!prev.sections[sectionId]) {
        // Handled later
        return prev
      } else {
        newState.sections[sectionId].items.push(itemId)
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


const Editor = () => {
  const [newSectionName, setNewSectionName] = useState<string>("")
  const { editorState, move, newSection } = useEditorAtom()

  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over) return;
    const overId = e.over.id as unknown as string
    const activeId = e.active.id as unknown as string
    move(activeId, overId)
  }

  const ItemIdListToView = (props: { items: idItem[] }) => {
    return <>
      {props.items.map((id, i) => {
        const item = editorState.itemMap[id]
        if (!item) return null;
        if (item.type === "POINT") return <Component id={item.id} key={i}><p>{item.data}</p></Component>
        else return <Component id={item.id} key={i}><p>{item.title}</p></Component>
      })}
    </>
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      <DndContext
        onDragStart={() => {
          //setActive(e.active.id)
          console.log(editorState)
        }}
        onDragEnd={onDragEnd}
      >
        <div style={{
          display: "grid",
          gridTemplateColumns: "400px 1fr"
        }}>
          <div>
            {/* Sidebar */}
            <p style={{ textAlign: "center" }}>Points</p>
            <ItemIdListToView items={editorState.menu} />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: "column",
              height: "100%",
              width: "100%"
            }}
          >
            {Object.keys(editorState.sections).map((sectionKey, i) => {
              const section = editorState.sections[sectionKey]
              return <Section key={i} id={section.id} title={section.displayName}>
                <ItemIdListToView items={section.items} />
              </Section>
            })}
            <span style={{ backgroundColor: "aqua" }}>
              <input style={{ border: "solid 1px" }} value={newSectionName} onChange={(e) => { setNewSectionName(e.target.value) }} />
              <button onClick={() => {
                if (newSectionName == "") return;
                newSection(newSectionName, newSectionName)
                setNewSectionName("")
              }
              }>Add section</button>
            </span>
          </div>
        </div>
      </DndContext>
    </div >
  );
};

type SectionProp = {
  id: UniqueIdentifier;
  title: string;
  children?: ReactNode
};

const Section = (props: SectionProp) => {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id
  });
  return (
    <div
      ref={setNodeRef}
      style={{
        minWidth: 50,
        padding: 8,
        width: "100%",
      }}
    >
      <div style={{
        border: "dashed 1px",
        display: "flex",
        flexDirection: "column",
        minHeight: "200px",
        backgroundColor: isOver ? 'green' : 'grey',
      }}>
        <span style={{ color: "white", textAlign: "center" }}>{props.title}</span>
        <div style={{ width: "100%", height: "100%", margin: 0 }}>
          {props.children}
        </div>
      </div>
    </div>
  );
};

type ComponentProp = {
  id: UniqueIdentifier;
  children?: ReactNode
};

const Component = (props: ComponentProp) => {
  const { attributes, listeners, transform, setNodeRef, active } = useDraggable(
    {
      id: props.id,
      attributes: {
        tabIndex: 0
      }
    }
  );
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        border: "solid 1px",
        transform: CSS.Translate.toString(transform),
        backgroundColor: active && active.id == props.id ? 'blue' : undefined,
        width: "fit-content",
        height: "fit-content"
      }}
    >
      {props.children}
    </div>
  );
};

//const SubSection: FC = (props: { data: Subsection }) => {
//  return <></>
//}

export default Editor;
