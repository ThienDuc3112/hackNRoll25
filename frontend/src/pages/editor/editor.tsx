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
import { X, Download } from "lucide-react";
import { Textarea } from "./textarea";
import Subsection from "./subsection";
// import { Section } from "./section";
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

const Section = ({ id, title, children }: SectionProp) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} className="min-w-[50px] w-full p-2">
      <div
        className={`border border-dashed flex flex-col min-h-[200px] ${
          isOver ? "bg-green-500/20" : "bg-gray-100"
        }`}
      >
        <span className="text-center p-2 font-medium">{title}</span>
        <div className="w-full h-full m-0">{children}</div>
      </div>
    </div>
  );
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

const Editor = () => {
  const [dividerPosition, setDividerPosition] = useState(50);
  const [newSectionName, setNewSectionName] = useState<string>("");
  const { editorState, move, newSection } = useEditorAtom();
  const [subsections, setSubsections] = useState([
    "Subsection 1",
    "Subsection 2",
    "Subsection 3",
  ]);
  const [newSubsectionName, setNewSubsectionName] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [droppedSubsections, setDroppedSubsections] = useState<any[]>([]);
  const [showNameInput, setShowNameInput] = useState(false);
  const [name, setName] = useState("");

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

  const onDragEnd = (e: DragEndEvent) => {
    const { over, active } = e;
    if (!over || !active.data.current) return;

    if (active.data.current.type === "subsection") {
      handleDrop(active.data.current.name, active.data.current.fields);
      return;
    }

    const overId = over.id as string;
    const activeId = active.id as string;
    const overData = over.data.current;

    if (!overData) {
      move(activeId, overId, 0);
    } else {
      const index = overData.items ? overData.items.length : 0;
      move(activeId, overId, index);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDrop = (subsectionName: string, fields: any[]) => {
    const isAlreadyDropped = droppedSubsections.some(
      (subsec) => subsec.name === subsectionName
    );

    if (!isAlreadyDropped) {
      setDroppedSubsections([
        ...droppedSubsections,
        {
          id: Date.now(),
          name: subsectionName,
          fields: fields.map((field) => ({
            ...field,
            content: field.content || "",
          })),
        },
      ]);
    }
  };

  const removeSubsection = (name) => {
    setSubsections(subsections.filter((subsec) => subsec !== name));
  };

  const removeDroppedSubsection = (subsectionId) => {
    setDroppedSubsections(
      droppedSubsections.filter((subsec) => subsec.id !== subsectionId)
    );
  };

  const addNewSubsection = () => {
    if (newSubsectionName.trim()) {
      setSubsections([...subsections, newSubsectionName.trim()]);
      setNewSubsectionName("");
      setShowNameInput(false);
    }
  };

  const updateDroppedSubsectionFields = (subsectionId, newFields) => {
    setDroppedSubsections(
      droppedSubsections.map((subsec) =>
        subsec.id === subsectionId ? { ...subsec, fields: newFields } : subsec
      )
    );
  };

  return (
    <DndContext
      onDragStart={() => {
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
          {subsections.map((name) => (
            <Subsection
              key={name}
              name={name}
              onRemove={() => removeSubsection(name)}
            />
          ))}
          {showNameInput ? (
            <div className="w-full p-4 mb-4 border-2 border-dashed border-gray-300 rounded-lg">
              <input
                type="text"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                className="w-full p-2 mb-2 border rounded"
                placeholder="New section name"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newSectionName.trim()) {
                    newSection(newSectionName, newSectionName);
                    setNewSectionName("");
                  }
                }}
              />
              <div className="flex space-x-2">
                <button
                  onClick={addNewSubsection}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowNameInput(false);
                    setNewSubsectionName("");
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
              + Add Subsection
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
          <div className="flex items-center gap-4 p-2 bg-white border-b">
            <ExportHandler name={name} subsections={droppedSubsections} />
            {/* <Button onClick={() => console.log("Button 2")} variant="secondary">
              Button 2
            </Button>
            <Button onClick={() => console.log("Button 3")} variant="outline">
              Button 3
            </Button> */}
          </div>

          {/* Main Content */}
          <div className=" scroll-m-0 flex-1 p-2 flex items-center justify-center">
            <div
              className="relative h-full"
              style={{ aspectRatio: "1/1.4142" }}
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
                    <div className="flex flex-wrap items-center justify-center gap-4 text-gray-600"></div>
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
          {/* <span style={{ backgroundColor: "aqua" }}> */}
          <input
            type="text"
            value={newSectionName}
            onChange={(e) => {
              setNewSectionName(e.target.value);
            }}
            className="w-full p-2 mb-2 border rounded"
            placeholder="Section name"
          />
          <Button
            onClick={() => {
              if (newSectionName == "") return;
              newSection(newSectionName, newSectionName);
              setNewSectionName("");
            }}
          >
            Add section
          </Button>
          {/* </span> */}
        </div>
      </div>
    </DndContext>
  );
};

/////////////////////////////////////////////

export default Editor;
