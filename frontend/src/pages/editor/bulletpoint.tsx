import { PointType } from "./types";

const BulletPoint = ({ point }: { point: PointType }) => {
  return (
    <div>
      <ul style={{ listStyleType: "disc", paddingLeft: "5px" }}>
        <li>{point.data}</li>
      </ul>
    </div>
  );
};

export default BulletPoint;
