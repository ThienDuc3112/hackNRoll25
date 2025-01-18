import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useState } from 'react';
import { useEditorAtom } from './state';
import { Section } from './section';

const Editor = () => {
  const [newSectionName, setNewSectionName] = useState<string>("")
  const { editorState, move, newSection } = useEditorAtom()

  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over) return;
    const { over, active } = e
    if (!active.data.current) {
      console.log("active:", active, "\nover:", over)
      console.log("SOMETHING HAPPEN WTF");
      return
    }
    if (!over.data.current) {
      move(active.id as string, over.id as string, 0)
      return;
    }

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
            <Section section={{ displayName: "Menu", id: "", items: editorState.menu }} />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: "column",
              height: "100%",
              width: "100%"
            }}
          >
            {Object.keys(editorState.sections).map((sectionKey, i) => (<Section section={editorState.sections[sectionKey]} key={i} />))}
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
export default Editor;
