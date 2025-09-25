import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Portal = ({ children, containerId = "modal-root" }) => {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    let modalContainer = document.getElementById(containerId);

    if (!modalContainer) {
      modalContainer = document.createElement("div");
      modalContainer.id = containerId;
      modalContainer.style.position = "fixed";
      modalContainer.style.top = "0";
      modalContainer.style.left = "0";
      modalContainer.style.width = "100%";
      modalContainer.style.height = "100%";
      modalContainer.style.pointerEvents = "none";
      modalContainer.style.zIndex = "9999";
      document.body.appendChild(modalContainer);
    }

    setContainer(modalContainer);

    return () => {
      if (modalContainer && modalContainer.children.length === 0) {
        document.body.removeChild(modalContainer);
      }
    };
  }, [containerId]);

  if (!container) return null;

  return createPortal(children, container);
};

export default Portal;
