import {
  DndContext,
  DragEndEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import Button from "./button";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import Mydocument from "./mydocument";
import { X, Download } from "lucide-react";
import { useEditorAtom } from "./state";
import { Section } from "./section"


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
                section={section}
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
