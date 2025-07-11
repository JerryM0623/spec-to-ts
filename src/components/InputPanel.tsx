import React from 'react';

interface InputPanelProps {
  spec: string;
  onSpecChange: (value: string) => void;
  onGenerate: () => void;
  url: string;
  onUrlChange: (value: string) => void;
  onFetch: () => void;
  isLoading: boolean;
  fetchError: string;
}

const InputPanel: React.FC<InputPanelProps> = ({
  spec,
  onSpecChange,
  onGenerate,
  url,
  onUrlChange,
  onFetch,
  isLoading,
  fetchError,
}) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">
        OpenAPI 转 TypeScript Interface 生成器
      </h1>

      {/* URL Fetch Section */}
      <div>
        <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-1">
          从链接中获取
        </label>
        <div className="flex space-x-2">
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://petstore.swagger.io/v2/swagger.json"
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            onClick={onFetch}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:bg-indigo-300"
          >
            {isLoading ? '获取中...' : '获取'}
          </button>
        </div>
        {fetchError && <p className="text-red-500 text-sm mt-1">{fetchError}</p>}
      </div>

      {/* Separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-2 text-sm text-gray-500">或</span>
        </div>
      </div>

      {/* Paste Text Area Section */}
      <div className="flex flex-col flex-grow">
        <label htmlFor="spec-textarea" className="block text-sm font-medium text-gray-700 mb-1">
          粘贴你的文本
        </label>
        <textarea
          id="spec-textarea"
          value={spec}
          onChange={(e) => onSpecChange(e.target.value)}
          placeholder="Paste your OpenAPI (v2/v3) spec here (JSON or YAML)"
          className="flex-grow p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
        <button
          onClick={onGenerate}
          className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          生成
        </button>
      </div>
    </div>
  );
};

export default InputPanel;
