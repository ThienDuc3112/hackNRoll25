export type IdItemType = string

export type PointType = {
  id: IdItemType,
  type: "POINT",
  data: string
}

export type SubsectionType = {
  id: IdItemType,
  type: "SUBSECTION",
  title: string,
  timeRange: string,
  description: string,
  children: PointType[]
}

export type ItemType = PointType | SubsectionType

export type SectionType = {
  id: string,
  displayName: string,
  items: IdItemType[]
}

export type EditorStateType = {
  menu: IdItemType[]
  sections: Record<string, SectionType>,
  itemMap: Record<string, ItemType>
}

