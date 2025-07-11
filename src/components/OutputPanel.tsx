import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface OutputPanelProps {
  code: string;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ code }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('Copied to clipboard!');
  };

  const codeStyle = {
    ...vscDarkPlus,
    'code[class*="language-"]': {
      ...vscDarkPlus['code[class*="language-"]'],
      fontSize: '16px',
    },
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      fontSize: '16px',
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Generated Code</h2>
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-colors duration-200"
        >
          复制
        </button>
      </div>
      <div className="flex-grow overflow-auto rounded-md">
        <SyntaxHighlighter
          language="typescript"
          style={codeStyle}
          showLineNumbers
          customStyle={{ margin: 0, height: '100%', width: '100%' }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default OutputPanel;
