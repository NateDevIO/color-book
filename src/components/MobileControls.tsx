import { useState } from 'react';
import { Brush, PaintBucket, Eraser, Undo, Download, ChevronUp, ChevronDown } from 'lucide-react';

interface MobileControlsProps {
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
    '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181',
    '#F7D794', '#778BEB', '#cf6a87', '#596275', '#000000',
];

export function MobileControls({ tool, setTool, color, setColor, brushSize, setBrushSize, onUndo, onSave }: MobileControlsProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'var(--panel-bg)',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
            borderRadius: '16px 16px 0 0',
            zIndex: 100,
            transition: 'all 0.3s ease'
        }}>
            {/* Main toolbar row - always visible */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                gap: '8px'
            }}>
                {/* Tools */}
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        onClick={() => setTool('brush')}
                        style={{
                            padding: '10px',
                            borderRadius: '10px',
                            backgroundColor: tool === 'brush' ? 'var(--primary)' : '#f0f0f0',
                            color: tool === 'brush' ? 'white' : '#555'
                        }}
                    >
                        <Brush size={20} />
                    </button>
                    <button
                        onClick={() => setTool('bucket')}
                        style={{
                            padding: '10px',
                            borderRadius: '10px',
                            backgroundColor: tool === 'bucket' ? 'var(--primary)' : '#f0f0f0',
                            color: tool === 'bucket' ? 'white' : '#555'
                        }}
                    >
                        <PaintBucket size={20} />
                    </button>
                    <button
                        onClick={() => setTool('eraser')}
                        style={{
                            padding: '10px',
                            borderRadius: '10px',
                            backgroundColor: tool === 'eraser' ? 'var(--primary)' : '#f0f0f0',
                            color: tool === 'eraser' ? 'white' : '#555'
                        }}
                    >
                        <Eraser size={20} />
                    </button>
                </div>

                {/* Current color indicator + expand button */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        borderRadius: '20px',
                        backgroundColor: '#f0f0f0',
                        color: '#555'
                    }}
                >
                    <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        border: '2px solid #ddd'
                    }} />
                    {expanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </button>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        onClick={onUndo}
                        style={{
                            padding: '10px',
                            borderRadius: '10px',
                            backgroundColor: '#FFD93D',
                            color: '#555'
                        }}
                    >
                        <Undo size={20} />
                    </button>
                    <button
                        onClick={onSave}
                        style={{
                            padding: '10px',
                            borderRadius: '10px',
                            backgroundColor: '#6BCB77',
                            color: 'white'
                        }}
                    >
                        <Download size={20} />
                    </button>
                </div>
            </div>

            {/* Expandable section */}
            <div style={{
                maxHeight: expanded ? '150px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease',
                borderTop: expanded ? '1px solid #eee' : 'none'
            }}>
                <div style={{ padding: '12px' }}>
                    {/* Colors */}
                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        marginBottom: '12px'
                    }}>
                        {COLORS.map(c => (
                            <button
                                key={c}
                                onClick={() => {
                                    setColor(c);
                                    if (tool === 'eraser') setTool('brush');
                                }}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: c,
                                    border: c === color && tool !== 'eraser' ? '3px solid #fff' : '2px solid transparent',
                                    boxShadow: c === color && tool !== 'eraser' ? '0 0 0 2px var(--primary)' : 'none'
                                }}
                            />
                        ))}
                    </div>

                    {/* Brush size */}
                    {(tool === 'brush' || tool === 'eraser') && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.85rem', color: '#666', minWidth: '35px' }}>Size</span>
                            <input
                                type="range"
                                min="5"
                                max="50"
                                value={brushSize}
                                onChange={(e) => setBrushSize(Number(e.target.value))}
                                style={{ flex: 1, accentColor: 'var(--primary)' }}
                            />
                            <span style={{ fontSize: '0.85rem', color: '#666', minWidth: '25px' }}>{brushSize}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
