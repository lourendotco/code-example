import { useState, Children, cloneElement, isValidElement } from "react";

export default function Toggable({ action, children }) {
  const [visible, setVisible] = useState(false);

  const clonedChildren = Children.map(children, (child) => {
    if (isValidElement(child)) {
      if (child.type === "div") {
        return child;
      }
      return cloneElement(child, { setVisible });
    }
    return child;
  });
  return (
    <div>
      <div style={{ display: visible ? "" : "none" }}>
        {clonedChildren}
        <button
          className="px-4 py-2 font-semibold text-sm bg-lime-200 text-lime-900 rounded-md shadow-sm m-1"
          onClick={() => setVisible(false)}
        >
          hide
        </button>
      </div>
      <div style={{ display: visible ? "none" : "" }}>
        <button
          className="px-4 py-2 font-semibold text-sm bg-lime-200 text-lime-900 rounded-md	shadow-sm m-1"
          onClick={() => setVisible(true)}
        >
          {action}
        </button>
      </div>
    </div>
  );
}
