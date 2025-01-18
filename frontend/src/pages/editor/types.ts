export type IdItem = string

export type Point = {
  id: IdItem,
  type: "POINT",
  data: string
}

export type Subsection = {
  id: IdItem,
  type: "SUBSECTION",
  title: string,
  timeRange: string,
  description: string,
  children: Point[]
}

export type Item = Point | Subsection

export type Section = {
  id: string,
  displayName: string,
  items: IdItem[]
}

export type EditorState = {
  menu: IdItem[]
  sections: Record<string, Section>,
  itemMap: Record<string, Item>
}

