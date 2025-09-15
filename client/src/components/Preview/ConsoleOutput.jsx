// eslint-disable-next-line no-unused-vars
import { useEffect, useState } from 'react';

const ConsoleOutput = ({ logs }) => {
  const [expanded, setExpanded] = useState(false);

  if (!logs || logs.length === 0) {
    return (
      <div className="bg-gray-900 text-green-400 p-3 text-sm font-mono">
        <div className="flex items-center justify-between">
          <span>Console</span>
          <span className="text-gray-500">No messages</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-green-400 p-3 text-sm font-mono">
      <div 
        className="flex items-center justify-between cursor-pointer mb-2"
        onClick={() => setExpanded(!expanded)}
      >
        <span>Console ({logs.length} messages)</span>
        <span className="text-gray-500">{expanded ? '▲' : '▼'}</span>
      </div>
      
      {expanded && (
        <div className="max-h-40 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="console-line border-t border-gray-700 pt-1 mt-1">
              <span className="text-blue-400">›</span> {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsoleOutput;