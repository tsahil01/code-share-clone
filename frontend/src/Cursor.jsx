// Cursor.js
import React, { useEffect } from 'react';

const Cursor = ({ id, line }) => {
  useEffect(() => {
    const elementId = 'cursor-' + id;
    let element = document.getElementById(elementId);

    if (!element) {
      element = document.createElement('div');
      element.id = elementId;
      element.className = 'cursor';
      document.body.appendChild(element); // Append to body or another container as needed
    }

    element.style.left = line[0].x + 'px';
    element.style.top = line[0].y + 'px';

    return () => {
      // Cleanup logic if needed
    };
  }, [id, line]);

  return null;
};

export default Cursor;
