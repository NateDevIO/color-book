import { Brush, PaintBucket, Eraser, Undo, Download } from 'lucide-react';

interface ControlsProps {
    tool: 'brush' | 'bucket' | 'eraser';
    setTool: (t: 'brush' | 'bucket' | 'eraser') => void;
    color: string;
    setColor: (c: string) => void;
    brushSize: number;
    setBrushSize: (s: number) => void;
    onUndo: () => void;
    onSave: () => void;
}

const COLORS = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal/Safe Green
    '#FFE66D', // Yellow
    '#95E1D3', // Light Green
    '#F38181', // Pink
    '#F7D794', // Light Orange
    '#778BEB', // Blue
    '#cf6a87', // Purple-ish
    '#596275', // Dark Grey
    '#000000', // Black
];

export function Controls({ tool, setTool, color, setColor, brushSize, setBrushSize, onUndo, onSave }: ControlsProps) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: 'var(--panel-bg)',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--shadow)',
            width: '240px',
            overflowY: 'auto'
        }}>

            {/* Tools */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button
                    onClick={() => setTool('brush')}
                    style={{
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: tool === 'brush' ? 'var(--primary)' : '#f0f0f0',
                        color: tool === 'brush' ? 'white' : '#555',
                        transition: 'all 0.2s'
                    }}
                    title="Brush"
                >
                    <Brush size={24} />
                </button>
                <button
                    onClick={() => setTool('bucket')}
                    style={{
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: tool === 'bucket' ? 'var(--primary)' : '#f0f0f0',
                        color: tool === 'bucket' ? 'white' : '#555',
                        transition: 'all 0.2s'
                    }}
                    title="Fill Bucket"
                >
                    <PaintBucket size={24} />
                </button>
                <button
                    onClick={() => setTool('eraser')}
                    style={{
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: tool === 'eraser' ? 'var(--primary)' : '#f0f0f0',
                        color: tool === 'eraser' ? 'white' : '#555',
                        transition: 'all 0.2s'
                    }}
                    title="Eraser"
                >
                    <Eraser size={24} />
                </button>
            </div>

            {/* Brush Size */}
            {(tool === 'brush' || tool === 'eraser') && (
                <div style={{ padding: '0 0.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                        Size
                    </label>
                    <input
                        type="range"
                        min="5"
                        max="50"
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--primary)' }}
                    />
                </div>
            )}

            {/* Colors */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                {COLORS.map(c => (
                    <button
                        key={c}
                        onClick={() => {
                            setColor(c);
                            if (tool === 'eraser') setTool('brush'); // Auto switch back to brush
                        }}
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: c,
                            border: c === color && tool !== 'eraser' ? '4px solid #ddd' : '2px solid transparent',
                            cursor: 'pointer',
                            boxShadow: c === color && tool !== 'eraser' ? '0 0 0 2px var(--primary)' : 'none',
                            transition: 'transform 0.1s'
                        }}
                    />
                ))}
            </div>

            {/* Actions */}
            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                <button
                    onClick={onUndo}
                    style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: '#FFD93D',
                        color: '#555',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <Undo size={20} /> Undo
                </button>
                <button
                    onClick={onSave}
                    style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: '#6BCB77',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <Download size={20} /> Save
                </button>
            </div>

        </div>
    );
}
