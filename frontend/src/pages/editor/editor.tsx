import {
  DndContext,
  DragEndEvent,
  UniqueIdentifier,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { atom, useAtom } from "jotai";
import { ReactNode, useState } from "react";
import Button from "./button";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import Mydocument from "./mydocument";
import { X, Plus, Edit2, Download } from "lucide-react";
import { Textarea } from "./textarea";

////////////////////////////////////////////////////////////////////////
type idItem = string;

type Point = {
  id: idItem;
  type: "POINT";
  data: string;
};

type Subsection = {
  id: idItem;
  type: "SUBSECTION";
  title: string;
  timeRange: string;
  description: string;
  children: Point[];
};

type Item = Point | Subsection;

type Section = {
  id: string;
  displayName: string;
  items: idItem[];
};

type EditorState = {
  menu: idItem[];
  sections: Record<string, Section>;
  itemMap: Record<string, Item>;
};

const editorAtom = atom({
  menu: ["test", "skill", "education"],
  sections: {},
  itemMap: {
    test: {
      type: "POINT",
      data: "Test point 1",
      id: "test",
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
  },
} as EditorState);

const filterSection = (
  sections: Record<string, Section>,
  itemId: idItem
): Record<string, Section> => {
  const newSections = { ...sections };
  for (const sectionKey in newSections) {
    newSections[sectionKey] = { ...newSections[sectionKey] };
    newSections[sectionKey].items = newSections[sectionKey].items.filter(
      (val) => val !== itemId
    );
  }
  return newSections;
};

const useEditorAtom = () => {
  const [editorState, setEditorState] = useAtom(editorAtom);

  const move = (itemId: string, sectionId: string) => {
    setEditorState((prev) => {
      if (!prev.itemMap[itemId]) return prev;

      const newState = {
        itemMap: prev.itemMap,
        sections: filterSection(prev.sections, itemId),
        menu: prev.menu.filter((val) => val !== itemId),
      };

      if (sectionId === "") {
        newState.menu.push(itemId);
      } else if (!prev.sections[sectionId]) {
        // Handled later
        return prev;
      } else {
        newState.sections[sectionId].items.push(itemId);
      }

      return newState;
    });
  };

  const newSection = (id: string, name: string) => {
    setEditorState((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [name]: {
          id: id,
          displayName: name,
          items: [],
        },
      },
    }));
  };

  return { editorState, move, newSection };
};

type SectionProp = {
  id: UniqueIdentifier;
  title: string;
  children?: ReactNode;
};

const Section = (props: SectionProp) => {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
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
      <div
        style={{
          border: "dashed 1px",
          display: "flex",
          flexDirection: "column",
          minHeight: "200px",
          backgroundColor: isOver ? "green" : "grey",
        }}
      >
        <span style={{ color: "white", textAlign: "center" }}>
          {props.title}
        </span>
        <div style={{ width: "100%", height: "100%", margin: 0 }}>
          {props.children}
        </div>
      </div>
    </div>
  );
};

type ComponentProp = {
  id: UniqueIdentifier;
  children?: ReactNode;
};

const ExportHandler = ({ name }) => {
  const [showPreview, setShowPreview] = useState(false);

  if (showPreview) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg shadow-lg w-full h-full max-w-4xl mx-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">PDF Preview</h3>
            <button
              onClick={() => setShowPreview(false)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1">
            <PDFViewer width="100%" height="100%">
              <Mydocument name={name} />
            </PDFViewer>
          </div>
          <div className="mt-4 flex justify-end">
            <PDFDownloadLink
              document={<Mydocument name={name} />}
              fileName="resume.pdf"
            >
              {/* {({ loading }) => (
                <Button variant="primary" disabled={loading}>
                  <Download size={16} />
                  {loading ? "Preparing..." : "Download PDF"}
                </Button>
              )} */}
            </PDFDownloadLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button onClick={() => setShowPreview(true)} variant="primary">
      <Download size={16} />
      Export
    </Button>
  );
};

// const Component = (props: ComponentProp) => {
//   const { attributes, listeners, transform, setNodeRef, active } = useDraggable(
//     {
//       id: props.id,
//       attributes: {
//         tabIndex: 0,
//       },
//     }
//   );
//   return (
//     <div
//       ref={setNodeRef}
//       {...listeners}
//       {...attributes}
//       style={{
//         border: "solid 1px",
//         transform: CSS.Translate.toString(transform),
//         backgroundColor: active && active.id == props.id ? "blue" : undefined,
//         width: "fit-content",
//         height: "fit-content",
//       }}
//     >
//       {props.children}
//     </div>
//   );
// };

const Editor = () => {
  const [dividerPosition, setDividerPosition] = useState(50);
  const [newSectionName, setNewSectionName] = useState<string>("");
  const { editorState, move, newSection } = useEditorAtom();
  const [components, setComponents] = useState([
    "Education",
    "Experience",
    "Skills",
  ]);
  const [newComponentName, setNewComponentName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [name, setName] = useState("");

  const handleMouseDown = () => {
    const handleMouseMove = (event: { clientX: number }) => {
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
  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over) return;
    const { over, active } = e;
    if (!active.data.current) {
      console.log("active:", active, "\nover:", over);
      console.log("SOMETHING HAPPEN WTF");
      return;
    }
    if (!over.data.current) {
      move(active.id as string, over.id as string, 0);
      return;
    }
  };

  // const removeComponent = (name) => {
  //   setComponents(components.filter((comp) => comp !== name));
  // };

  const addNewComponent = () => {
    if (newComponentName.trim()) {
      setComponents([...components, newComponentName.trim()]);
      setNewComponentName("");
      setShowNameInput(false);
    }
  };
  return (
    <DndContext
      onDragStart={() => {
        //setActive(e.active.id)
        console.log(editorState);
      }}
      onDragEnd={onDragEnd}
    >
      <div className="fixed inset-0 flex w-full overflow-hidden">
        {" "}
        {/* Sidebar */}
        {/* Left */}
        <div
          className="flex h-full flex-col bg-gray-200 p-4 overflow-y-auto"
          style={{ width: `${dividerPosition}%` }}
        >
          {showNameInput ? (
            <div className="w-full p-4 mb-4 border-2 border-dashed border-gray-300 rounded-lg">
              <input
                type="text"
                value={newComponentName}
                onChange={(e) => setNewComponentName(e.target.value)}
                className="w-full p-2 mb-2 border rounded"
                placeholder="Component name"
              />
              <div className="flex space-x-2">
                <button
                  onClick={addNewComponent}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowNameInput(false);
                    setNewComponentName("");
                  }}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowNameInput(true)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
            >
              + Add Component
            </button>
          )}
        </div>
        {/* vertical bar */}
        <div
          className="w-1 h-full bg-gray-400 cursor-col-resize hover:bg-gray-500"
          onMouseDown={handleMouseDown}
        ></div>
        {/* Right side */}
        <div
          className="flex flex-col h-full bg-gray-100"
          style={{ width: `${100 - dividerPosition}%` }}
        >
          {/* Control Bar */}
          <div className="flex items-center gap-4 p-4 bg-white border-b">
            <ExportHandler name={name} />
            {/* <Button onClick={() => console.log("Button 2")} variant="secondary">
              Button 2
            </Button>
            <Button onClick={() => console.log("Button 3")} variant="outline">
              Button 3
            </Button> */}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 flex items-center justify-center">
            <div
              className="relative w-[595px] "
              style={{ aspectRatio: "1/1.2" }}
            >
              <div className="absolute inset-0 bg-white rounded shadow-lg p-8 overflow-y-auto">
                <div className="space-y-8">
                  {/* Header */}
                  <div className="text-center space-y-4">
                    <input
                      type="text"
                      placeholder="YOUR NAME"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-4xl font-bold text-center w-full border-b-2 border-gray-200 focus:outline-none focus:border-gray-400"
                    />
                    <div className="flex flex-wrap items-center justify-center gap-4 text-gray-600">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {Object.keys(editorState.sections).map((sectionKey, i) => {
            const section = editorState.sections[sectionKey];
            return (
              <Section
                key={i}
                id={section.id}
                title={section.displayName}
              ></Section>
            );
          })}
          <span style={{ backgroundColor: "aqua" }}>
            <input
              style={{ border: "solid 1px" }}
              value={newSectionName}
              onChange={(e) => {
                setNewSectionName(e.target.value);
              }}
            />
            <button
              onClick={() => {
                if (newSectionName == "") return;
                newSection(newSectionName, newSectionName);
                setNewSectionName("");
              }}
            >
              Add section
            </button>
          </span>
        </div>
      </div>
    </DndContext>
  );
};

/////////////////////////////////////////////

export default Editor;
