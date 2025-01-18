import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { useMemo, useState } from "react";
import Button from "./button";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import Mydocument from "./mydocument";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { X, Download, Plus } from "lucide-react";
import { Textarea } from "./textarea";
import Subsection from "./subsection";
import { useEditorAtom } from "./state";
import { Section } from "./section";
import BulletPoint from "./bulletpoint";
import React from "react";

////////////////////////////////////////////////////////////////////////
const ContactInfo = ({ value, onChange, onRemove }) => {
  const [placeholder, setPlaceholder] = useState("Enter contact info");

  return (
    <div className="relative group">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={() => setPlaceholder("Enter contact info")}
        onBlur={() => !value && setPlaceholder("Click to edit")}
        placeholder={placeholder}
        className="text-sm text-center border-b border-gray-200 focus:outline-none focus:border-gray-400"
      />
      {value && (
        <button
          onClick={onRemove}
          className="absolute -right-6 top-1/2 -translate-y-1/2 hidden group-hover:block p-1 hover:bg-gray-100 rounded"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
const ExportHandler = ({ name, metadatas }) => {
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
              <Mydocument name={name} metadatas={metadatas} />
            </PDFViewer>
          </div>
          <div className="mt-4 flex justify-end">
            <PDFDownloadLink
              document={<Mydocument name={name} metadatas={metadatas} />}
              fileName="resume.pdf"
            >
              {/** @ts-expect-error PDF is dumb */}
              {({ loading }) => (
                <Button variant="primary" disabled={loading}>
                  <Download size={16} />
                  {loading ? "Preparing..." : "Download PDF"}
                </Button>
              )}
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

type UserMetaDataItem = {
  id: number;
  value: string;
  isUrl?: boolean;
  url?: string;
};

const Editor = () => {
  const [dividerPosition, setDividerPosition] = useState(50);
  const [newSectionName, setNewSectionName] = useState<string>("");
  const { editorState, move, newSection } = useEditorAtom();
  const sectionIds = useMemo(() => editorState.sections.map(val => `section-${val.id}`), [editorState])

  const [activeSection, setActiveSection] = useState<string | null>(null);

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
  const [metadatas, setMetadatas] = useState<UserMetaDataItem[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>("");

  const parts = useMemo(() => ["right", "vertical", "left"], [])

  const addMetadatas = () => {
    setMetadatas([...metadatas, { id: Date.now(), value: "" }]);
  };

  const removeMetadatas = (id: number) => {
    setMetadatas(metadatas.filter((field) => field.id !== id));
  };

  const updateMetadatas = (id: number, value: string) => {
    setMetadatas(
      metadatas.map((field) => (field.id === id ? { ...field, value } : field))
    );
  };

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
    setActiveId(null)
    const { over, active } = e;
    if (!over || !active.data.current) return;
    console.log(e)

    //if (active.data.current.type === "subsection") {
    //  handleDrop(active.data.current.name, active.data.current.fields);
    //  return;
    //}

    const overId = over.id as string;
    const activeId = active.id as string;
    const overData = over.data.current;
    const activeData = active.data.current;


    if (!overData) {
      move(activeId, overId, 0);
    } else if (activeData.type === "item" && overData.type === "section") {
      const activeComponentId = activeId.substring(5)
      const overSectionId = overId.substring(8)
      move(activeComponentId, overSectionId, activeData.sortable.index)
    } else {
      console.log("Haven't handled")
      console.log("active type:", activeData.type, "\nover type:", overData.type)

      //const index = overData.items ? overData.items.length : 0;
      //move(activeId, overId, index);
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

  const removeSubsection = (name: string) => {
    setSubsections(subsections.filter((subsec) => subsec !== name));
  };

  const removeDroppedSubsection = (subsectionId: any) => {
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

  const updateDroppedSubsectionFields = (subsectionId: string, newFields) => {
    setDroppedSubsections(
      droppedSubsections.map((subsec) =>
        subsec.id === subsectionId ? { ...subsec, fields: newFields } : subsec
      )
    );
  };

  return (
    <div className="fixed inset-0 flex w-full overflow-hidden">
      <DndContext
        onDragStart={(e) => {
          if (e.active.data.current?.type === "component") {
            setActiveId(e.active.id)
          }
        }}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={parts}>
          {/* Sidebar */}
          {/* Left */}
          <div
            className="flex h-full flex-col bg-gray-200 p-4 overflow-y-auto"
            style={{ width: `${dividerPosition}%` }}
          >
            {
              editorState.menu.map((itemId, i) => {
                const item = editorState.itemMap[itemId]
                if (item.type == "SUBSECTION") {
                  return <Subsection key={i} onRemove={(_: string) => { }} id={`menu-${item.id}`} subSection={item} isDropped={false} />
                } else {
                  return <p>Bullet point</p>
                }
              })
            }
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
            className="flex overflow-y-auto flex-col h-full bg-gray-100"
            style={{ width: `${100 - dividerPosition}%` }}
          >
            {/* Control Bar */}
            <div className="flex items-center gap-4 p-2 bg-white border-b">
              {/* <ExportHandler name={name} subsections={droppedSubsections} /> */}
              <ExportHandler name={name} metadatas={metadatas} />
              {/* <Button onClick={() => console.log("Button 2")} variant="secondary">
              Button 2
            </Button>
            <Button onClick={() => console.log("Button 3")} variant="outline">
              Button 3
            </Button> */}
              <input
                type="text"
                value={newSectionName}
                onChange={(e) => {
                  setNewSectionName(e.target.value);
                }}
                className="w-full p-2 rounded"
                placeholder="Add section name"
              />
              <Button
                onClick={() => {
                  if (newSectionName == "") return;
                  newSection(newSectionName, newSectionName);
                  setNewSectionName("");
                }}
              >
                Add
              </Button>
            </div>

            {/* Main Content */}
            <div className=" scroll-m-0 flex-1 p-2 flex items-center justify-center">
              <div
                className="relative h-full"
                style={{ aspectRatio: "1/1.4142" }}
              >
                <div className="h-full inset-0 bg-white rounded shadow-lg p-8 overflow-y-auto">
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                      <input
                        type="text"
                        placeholder="YOUR NAME"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-3xl font-bold text-center w-full  border-gray-200 focus:outline-none "
                      />
                      {/* <input
                        type="text"
                        placeholder="email"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="w-full text-center border-gray-200 focus:outline-none "
                      /> */}
                      <div className="flex flex-wrap items-center justify-center gap-4 text-gray-600">
                        {metadatas.map((field, index) => (
                          <React.Fragment key={field.id}>
                            {index > 0 && <span>-</span>}
                            <ContactInfo
                              value={field.value}
                              onChange={(value) =>
                                updateMetadatas(field.id, value)
                              }
                              onRemove={() => removeMetadatas(field.id)}
                            />
                          </React.Fragment>
                        ))}
                        {metadatas.length < 5 && (
                          <button
                            onClick={addMetadatas}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <Plus size={12} />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-4 text-gray-600"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <SortableContext strategy={verticalListSortingStrategy} items={sectionIds}>
              {editorState.sections.map((section, i) => {
                return (
                  <Section
                    key={i}
                    section={section}
                  />
                );
              })}
            </SortableContext>
            {
              //<DragOverlay>
              //  {activeSection && <Section section={editorState.sections[activeSection]} />}
              //</DragOverlay>
            }

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
        </SortableContext>
      </DndContext>
    </div>
  );
};

/////////////////////////////////////////////

export default Editor;
