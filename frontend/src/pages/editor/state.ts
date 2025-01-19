import { atom, useAtom } from "jotai";
import { EditorStateType, ItemType, PointType, SubsectionType } from "./types";
import { arrayMove } from "@dnd-kit/sortable";
import { UniqueIdentifier } from "@dnd-kit/core";

const initialItemMap: Record<string, ItemType> = {
  "subsection-education": {
    type: "SUBSECTION",
    id: "education-subsection",
    title: "NATIONAL UNIVERSITY OF SINGAPORE",
    items: ["point-gpa", "point-internshipAvailability", "point-awards"],
    description: "Bachelor of Engineering in Computer Engineering",
    timeRange: "Aug 2023 - May 2027",
  },
  "point-gpa": {
    type: "POINT",
    id: "point-gpa",
    data: "GPA: 4.78"
  },
  "point-internshipAvailability": {
    id: "point-internshipAvailability",
    type: "POINT",
    data: "Internship availability: May 2025 - August 2025"
  },
  "point-awards": {
    id: "point-awards",
    type: "POINT",
    data: "Awarded Top Student certificate in Data structures and Algorithms, Programming Methodology "
  },
  "subsection-webForum": {
    id: "subsection-webForum",
    type: "SUBSECTION",
    title: "Web Forum Application",
    timeRange: "Dec 2023 - Jan 2024",
    description: "Feature rich CRUD application, with React.js, Ruby on rails, and SQLite3.",
    items: ["point-forum-1", "point-forum-2"]
  },
  "point-forum-1": {
    id: "point-forum-1",
    type: "POINT",
    data: "Constructed a web forum application using React, TypeScript, Material-UI, and Vite for frontend, creating an intuitive and visually appealing user interface."
  },
  "point-forum-2": {
    id: "point-forum-2",
    type: "POINT",
    data: "Implemented a secure Ruby on Rails backend with JWT for authentication and Bcrypt for password hashing, ensuring robust user credential protection."
  },
  "subsection-blog": {
    id: "subsection-blog",
    type: "SUBSECTION",
    title: "Full-Stack Blogging Website",
    timeRange: "Aug 2023 - Dec 2023",
    description: "Created a full stack website using Next.js, Express.js and MongoDB.",
    items: ["point-blog-1", "point-blog-2"]
  },
  "point-blog-1": {
    id: "point-blog-1",
    type: "POINT",
    data: "Developed a full-stack blogging website, with CRUD operations, and responsive design with MongoDB, Express.js, and Next.js."
  },
  "point-blog-2": {
    id: "point-blog-2",
    type: "POINT",
    data: "Implemented user authentication and authorization using JWT and bcrypt, allow user to leave comments and write post if authorized."
  },
  "subsection-chatbot": {
    id: "subsection-chatbot",
    type: "SUBSECTION",
    title: "Discord Chat Bot",
    timeRange: "Nov 2021 - May 2022",
    description: "Creation of a Discord Chat Bot with TypeScript and MongoDB.",
    items: ["point-chatbot-1", "point-chatbot-2", "point-chatbot-3"]
  },
  "point-chatbot-1": {
    id: "point-chatbot-1",
    type: "POINT",
    data: "Employ features such as message logging, user commands, and data storage."
  },
  "point-chatbot-2": {
    id: "point-chatbot-2",
    type: "POINT",
    data: "Develop music streaming through Discord's voice chat functionality with ffmpeg and ytdl packages."
  },
  "point-chatbot-3": {
    id: "point-chatbot-3",
    type: "POINT",
    data: "Ensured scalability and maintainability through employing object oriented code design."
  },
  "subsection-mesn": {
    id: "subsection-mesn",
    type: "SUBSECTION",
    title: "NUS Tropical Marine Science Institute",
    timeRange: "May 2024 - Present",
    description: "Full stack engineer",
    items: ["point-mesn-1", "point-mesn-2"]
  },
  "point-mesn-1": {
    id: "point-mesn-1",
    type: "POINT",
    data: "Constructed and implemented new frontend screens to manage event logs and sensor scheduling, improving system usability and monitoring capabilities"
  },
  "point-mesn-2": {
    id: "point-mesn-2",
    type: "POINT",
    data: "Designed a testing suite for the frontend and backend, reducing bug reports by 50%"
  },
}

export const editorAtom = atom<EditorStateType>({
  menu: Object.keys(initialItemMap),
  sections: [
    {
      id: "section-education",
      displayName: "Education",
      items: [],
    },
    {
      id: "section-projects",
      displayName: "Projects",
      items: [],
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

  const updatePoint = (pointId: string, newVal: string) => {
    setEditorState(prev => {
      const point = prev.itemMap[pointId]
      if (!point || point.type == "SUBSECTION") return prev;
      const newState = {
        ...prev,
        itemMap: { ...prev.itemMap }
      }
      newState.itemMap[pointId] = { ...point, data: newVal }
      return newState
    })
  }

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
    deleteItem,
    updatePoint
  };
};

export const activeAtom = atom<{
  type: "SECTION" | "ITEM" | "MENU_ITEM"
  id: UniqueIdentifier
} | null>(null)
