/**
 * DoodleDream - Interactive Coloring Book
 * Coded by Nate
 */

import { useState, useRef } from 'react';
import { Controls } from './components/Controls';
import { MobileControls } from './components/MobileControls';
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

  const canvasRef = useRef<CanvasRef>(null);

  const handleGenerate = async (topic: string, complexity: string) => {
    setIsLoading(true);
    try {
      const url = await generateImage(topic, complexity);
      setBgImage(url);
    } catch (e) {
      console.error(e);
      const message = e instanceof Error ? e.message : 'Unknown error';
      alert(`Failed to generate image: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem',
      gap: '1rem',
      position: 'relative'
    }}>
      <header className="app-header" style={{
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--primary)', lineHeight: 1 }}>
            ☁️ DoodleDream
          </h1>
          <span style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic', marginLeft: '4px' }}>
            Color your imagination
          </span>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Generator onGenerate={handleGenerate} isLoading={isLoading} />
        </div>
      </header>

      <main className="app-main" style={{
        flex: 1,
        display: 'flex',
        gap: '1rem',
        overflow: 'hidden',
        minHeight: 0
      }}>
        {/* Desktop controls - hidden on mobile */}
        <div className="desktop-controls">
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
        </div>

        <div className="canvas-container" style={{
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

      {/* Mobile controls - hidden on desktop */}
      <div className="mobile-controls">
        <MobileControls
          tool={tool}
          setTool={setTool}
          color={color}
          setColor={setColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          onUndo={() => canvasRef.current?.undo()}
          onSave={() => canvasRef.current?.save()}
        />
      </div>

      <footer className="app-footer" style={{
        position: 'absolute',
        bottom: '4px',
        right: '8px',
        fontSize: '0.7rem',
        color: '#aaa'
      }}>
        Coded by Nate
      </footer>
    </div>
  );
}

export default App;
