import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';

import { io } from 'socket.io-client';

const socket = io('https://code-share.webpubsub.azure.com', {
  path: '/clients/socketio/hubs/Hub',
});

const Monaco = function () {
  const [value, setValue] = useState();
  const [cursorPositions, setCursorPositions] = useState({});
  const [cursorColors, setCursorColors] = useState({});

  useEffect(() => {
    socket.on('user-connected', (code) => {
      console.log(code);
      setValue(code);
    });

    socket.on('coding', (e) => {
      setValue(e);
    });

    socket.on('cursorPositionUpdated', ({ socketId, position }) => {
      // Update the cursor positions for all connected users
      setCursorPositions((prevPositions) => ({
        ...prevPositions,
        [socketId]: position,
      }));

      setCursorColors((prevColors) => {
        const newColors = { ...prevColors };
        if (!newColors[socketId]) {
          // Assign a new color if it doesn't exist
          newColors[socketId] = getRandomColor();
        }
        return newColors;
      });


    });

    return () => {
      socket.disconnect();
    };
  }, []);


  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleMouseMove = (e) => {
    const { clientX: x, clientY: y } = e;

    // Emit the cursor position to the server
    socket.emit('updateCursorPosition', { x, y });
  };



  return (
    <div style={{ position: 'relative', height: '100vh', overflow: "hidden" }} onMouseMove={handleMouseMove} className=''>
      {Object.entries(cursorPositions).map(([socketId, position]) => (
        <div
        key={socketId}
        className={`absolute w-5 h-5 rounded-xl z-10`}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          backgroundColor: cursorColors[socketId],
        }}
      ></div>
      ))}

      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
        <h1 className="text-2xl md:text-4xl p-4 font-bold mb-8">🚀 Live Coding! ✨</h1>
        <div className="w-4/5 p-2 bg-opacity-70 bg-black rounded-lg shadow-lg overflow-hidden">
          <Editor
          className=''
            height="80vh"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={value}
            onChange={(e) => {
              const newValue = e;
              setValue(newValue);
              socket.emit('code', newValue);
            }}
            defaultValue="// Write your code here"
            loading={<h3>Loading Code..</h3>}
            options={{
              automaticLayout: true,
              glyphMargin: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Monaco;
