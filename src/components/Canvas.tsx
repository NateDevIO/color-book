import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { floodFill } from '../utils/floodFill';

interface CanvasProps {
    tool: 'brush' | 'bucket' | 'eraser';
    color: string;
    brushSize: number;
    initialImage?: string; // URL to background image
}

export interface CanvasRef {
    undo: () => void;
    clear: () => void;
    save: () => void;
}

const Canvas = forwardRef<CanvasRef, CanvasProps>(({ tool, color, brushSize, initialImage }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [history, setHistory] = useState<ImageData[]>([]);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Handle high DPI displays
        // const dpr = window.devicePixelRatio || 1;
        // We'll set the internal resolution to match display size * dpr
        // But for now, let's keep it simple and just rely on CSS sizing 
        // and setting width/height attributes to match clientWidth/Height once

        // Actually, to avoid clearing on resize, we should probably set a fixed internal size
        // or handle resize explicitly. For this MVP, we'll fit to container on mount.
        const rect = canvas.parentElement?.getBoundingClientRect();
        if (rect) {
            canvas.width = rect.width;
            canvas.height = rect.height;
        }

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height); // White background

        contextRef.current = ctx;
        saveState(); // Save initial blank state
    }, []);

    // Load image if provided
    useEffect(() => {
        if (!initialImage || !contextRef.current || !canvasRef.current) return;

        const img = new Image();
        img.src = initialImage;
        img.crossOrigin = "anonymous"; // Important for editing
        img.onload = () => {
            const ctx = contextRef.current!;
            const canvas = canvasRef.current!;
            // Center and fit image
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;

            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            saveState();
        };
    }, [initialImage]);

    const saveState = () => {
        if (!canvasRef.current || !contextRef.current) return;
        const imageData = contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        setHistory(prev => [...prev.slice(-10), imageData]); // Keep last 10 states
    };

    useImperativeHandle(ref, () => ({
        undo: () => {
            if (history.length <= 1 || !contextRef.current) return;
            const newHistory = [...history];
            newHistory.pop(); // Remove current state
            const prevState = newHistory[newHistory.length - 1];
            contextRef.current.putImageData(prevState, 0, 0);
            setHistory(newHistory);
        },
        clear: () => {
            if (!contextRef.current || !canvasRef.current) return;
            contextRef.current.fillStyle = 'white';
            contextRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            saveState();
        },
        save: () => {
            if (!canvasRef.current) return;
            const link = document.createElement('a');
            link.download = 'my-masterpiece.png';
            link.href = canvasRef.current.toDataURL();
            link.click();
        }
    }));

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        if (!canvas || !ctx) return;

        // Get coordinates
        // Get coordinates
        const rect = canvas.getBoundingClientRect();

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        // Account for any CSS scaling if logic width != display width
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = Math.floor((clientX - rect.left) * scaleX);
        const y = Math.floor((clientY - rect.top) * scaleY);

        if (tool === 'bucket') {
            floodFill(ctx, x, y, color);
            saveState();
            return;
        }

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = tool === 'eraser' ? 'white' : color;
        ctx.lineWidth = brushSize;
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        if (!canvas || !ctx) return;

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            e.preventDefault(); // Prevent scrolling
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        if (contextRef.current) {
            contextRef.current.closePath();
        }
        setIsDrawing(false);
        saveState();
    };

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{
                width: '100%',
                height: '100%',
                touchAction: 'none',
                borderRadius: 'inherit',
                cursor: tool === 'bucket' ? 'crosshair' : 'round'
            }}
        />
    );
});

export default Canvas;
