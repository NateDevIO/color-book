import { useState, useRef } from 'react';
import { Controls } from './components/Controls';
import Canvas, { type CanvasRef } from './components/Canvas';
import { Generator } from './components/Generator';
import { generateImage } from './services/imageGen';
import './index.css';

function App() {
  const [tool, setTool] = useState<'brush' | 'bucket' | 'eraser'>('brush');
  const [color, setColor] = useState('#FF6B6B');
  const [brushSize, setBrushSize] = useState(10);
  const [bgImage, setBgImage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const canvasRef = useRef<CanvasRef>(null);

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    try {
      const url = await generateImage(prompt, apiKey);
      setBgImage(url);
      // Optional: Clear canvas history when new image loaded?
      // For now, the Canvas component handles new image loading by clearing internally.
    } catch (e) {
      console.error(e);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem',
      gap: '1rem',
      position: 'relative' // For overlays if needed
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: 'var(--panel-bg)',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary)', flexShrink: 0 }}>
          🎨 Magic Coloring
        </h1>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Generator onGenerate={handleGenerate} isLoading={isLoading} apiKey={apiKey} setApiKey={setApiKey} />
        </div>
      </header>

      <main style={{
        flex: 1,
        display: 'flex',
        gap: '1rem',
        overflow: 'hidden',
        minHeight: 0 // Crucial for nested flex scrolling
      }}>
        <Controls
          tool={tool}
          setTool={setTool}
          color={color}
          setColor={setColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          onUndo={() => canvasRef.current?.undo()}
          onSave={() => canvasRef.current?.save()}
        />

        <div style={{
          flex: 1,
          backgroundColor: 'white',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--shadow)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <Canvas
            ref={canvasRef}
            tool={tool}
            color={color}
            brushSize={brushSize}
            initialImage={bgImage}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
