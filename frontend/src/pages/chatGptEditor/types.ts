// types.ts
export type BulletPoint = {
  id: string;
  type: "bullet";
  content: string;
};

export type Subsection = {
  id: string;
  type: "subsection";
  title: string;
  timeRange: string;
  subtitle: string;
  bullets: string[]; // We could store bullet text or bullet objects
};

export type Item = BulletPoint | Subsection;

export type Section = {
  id: string;
  title: string;
  items: Item[];
};
