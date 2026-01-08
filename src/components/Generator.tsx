import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Settings } from './Settings';

interface GeneratorProps {
    onGenerate: (prompt: string, topic: string) => void;
    isLoading: boolean;
    apiKey: string;
    setApiKey: (key: string) => void;
}

export function Generator({ onGenerate, isLoading, apiKey, setApiKey }: GeneratorProps) {
    const [topic, setTopic] = useState('');
    const [age, setAge] = useState<'little' | 'big' | 'expert'>('little');

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;

        let complexity = '';
        switch (age) {
            case 'little': complexity = 'very simple, few details, large areas'; break;
            case 'big': complexity = 'moderate details, fun characters'; break;
            case 'expert': complexity = 'intricate details, complex patterns'; break;
        }

        const prompt = `Simple black and white line art coloring book page of ${topic}, thick outlines, no shading, white background, child-friendly, ${complexity}`;

        onGenerate(prompt, topic);
    };

    return (
        <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            padding: '0.5rem',
            backgroundColor: 'white',
            borderRadius: 'var(--border-radius)',
            flexWrap: 'wrap'
        }}>
            <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '200px', flexDirection: 'column', alignItems: 'flex-start' }}>
                <input
                    type="text"
                    placeholder="What do you want to color? (e.g. Bluey, Dinosaurs)"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '2px solid #ddd',
                        fontSize: '1rem',
                        outline: 'none'
                    }}
                />
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                        { label: 'Dinosaur', icon: '🦕' },
                        { label: 'Unicorn', icon: '🦄' },
                        { label: 'Robot', icon: '🤖' },
                        { label: 'Butterfly', icon: '🦋' },
                        { label: 'Car', icon: '🚗' },
                        { label: 'Flower', icon: '🌸' }
                    ].map(item => (
                        <button
                            key={item.label}
                            onClick={() => setTopic(item.label)}
                            title={item.label}
                            style={{
                                padding: '8px',
                                fontSize: '1.5rem',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                border: '1px solid #ddd',
                                minWidth: '44px',
                                minHeight: '44px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {item.icon}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select
                    value={age}
                    onChange={(e) => setAge(e.target.value as any)}
                    disabled={isLoading}
                    style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: '2px solid #ddd',
                        backgroundColor: 'white',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}
                >
                    <option value="little">Little Kid (4-5)</option>
                    <option value="big">Big Kid (6-7)</option>
                    <option value="expert">Expert (8+)</option>
                </select>

                <button
                    onClick={handleGenerate}
                    disabled={!topic.trim() || isLoading}
                    style={{
                        padding: '12px 24px',
                        borderRadius: '8px',
                        backgroundColor: isLoading ? '#ccc' : 'var(--secondary)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: isLoading ? 'none' : '0 4px 0 #3db1a9',
                        transform: isLoading ? 'translateY(4px)' : 'none',
                        transition: 'all 0.1s'
                    }}
                >
                    <Wand2 size={20} />
                    {isLoading ? 'Creating...' : 'Create!'}
                </button>
                <Settings apiKey={apiKey} setApiKey={setApiKey} />
            </div>
        </div>
    );
}
