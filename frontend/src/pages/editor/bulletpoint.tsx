import React from "react";

const BulletPoint = ({ title }) => {
  return (
    <div>
      <ul style={{ listStyleType: "disc", paddingLeft: "5px" }}>
        <li>{title}</li>
      </ul>
    </div>
  );
};

export default BulletPoint;
