import { useState } from 'react';
import { generateInterfaces } from './lib/converter';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';

function App() {
  const [spec, setSpec] = useState('');
  const [generatedCode, setGeneratedCode] = useState('// Your generated code will appear here...');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const handleGenerate = () => {
    const result = generateInterfaces(spec);
    setGeneratedCode(result);
  };

  const handleFetch = async () => {
    if (!url) {
      setFetchError('Please enter a URL.');
      return;
    }
    setIsLoading(true);
    setFetchError('');
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      setSpec(text);
    } catch (e) {
      if (e instanceof Error) {
        setFetchError(`Failed to fetch spec: ${e.message}. Check the URL and CORS policy of the server.`);
      } else {
        setFetchError('An unknown error occurred during fetch.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <div className="w-1/2 p-4">
        <InputPanel
          spec={spec}
          onSpecChange={setSpec}
          onGenerate={handleGenerate}
          url={url}
          onUrlChange={setUrl}
          onFetch={handleFetch}
          isLoading={isLoading}
          fetchError={fetchError}
        />
      </div>
      <div className="w-1/2 p-4 border-l border-gray-300">
        <OutputPanel code={generatedCode} />
      </div>
    </div>
  );
}

export default App;
