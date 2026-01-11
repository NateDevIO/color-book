# DoodleDream - Interactive AI Coloring Book 🎨

Welcome to DoodleDream! This application lets you embrace your creativity by coloring fun, pre-made characters or generating brand new coloring pages using AI.

## ✨ Features

- **AI-Powered Image Generation** - Create custom coloring pages from text prompts using DALL-E 3
- **10 Pre-made Templates** - Quick-start with dinosaur, unicorn, robot, butterfly, car, flower, spaceship, castle, dragon, and cat designs
- **Drawing Tools** - Brush with adjustable size, fill bucket, and eraser
- **Vibrant Color Palette** - Wide selection of colors to bring your artwork to life
- **Undo Support** - Easily correct mistakes with one-click undo
- **Save & Download** - Export your finished masterpiece as a PNG image
- **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Lucide React** - Icon library
- **HTML5 Canvas** - Drawing and rendering

### Backend
- **Node.js** - Runtime environment
- **Express** - Web server framework
- **OpenAI API** - DALL-E 3 for AI image generation

### Deployment
- **Firebase Hosting** - Static site hosting
- **Firebase Cloud Functions** - Serverless API proxy

## 🚀 How to Use

### 1. Choose Your Canvas
You have two ways to start coloring:

*   **Quick Start (Instant)**: Click one of the icons in the top bar to load a preset coloring page immediately.
    *   🦕 Dinosaur
    *   🦄 Unicorn
    *   🤖 Robot
    *   🦋 Butterfly
    *   🚗 Car
    *   🌸 Flower
    *   🚀 Spaceship
    *   🏰 Castle
    *   🐉 Dragon
    *   🐱 Cat

*   **Create Your Own (AI Powered)**: Type anything you can imagine into the search box (e.g., "a surfing penguin") and click **Create!**
    *   *Note: Custom AI images take about 10 seconds to generate.*

### 2. Color Your Masterpiece
Once your image is loaded, use the tools on the left to bring it to life:
*   🖌️ **Brush**: Freehand drawing. Use the slider to adjust the size.
*   🪣 **Fill Bucket**: Click any area to fill it with color instantly.
*   ✏️ **Eraser**: Correct mistakes or remove color.
*   **Color Palette**: Select from the vibrant colors provided.
*   ↩️ **Undo**: Made a mistake? Press Undo to go back.

### 3. Save & Share
When you are finished, click the **Save** button to download your artwork as a PNG image to your computer.

## 🛠️ Installation & Setup (For Developers)

If you are running this project locally, follow these steps:

### Prerequisites
*   Node.js 18+
*   OpenAI API Key (for custom generations)

### Setup

1.  **Install Dependencies**
    ```bash
    # Install frontend deps
    npm install
    
    # Install backend deps
    cd server
    npm install
    ```

2.  **Configure API Key**
    Create a `.env` file in the `server/` directory:
    ```
    OPENAI_API_KEY=your_key_here
    ```

3.  **Run the App**
    You need two terminals:

    *   **Terminal 1 (Backend)**:
        ```bash
        cd server
        npm start
        ```
    
    *   **Terminal 2 (Frontend)**:
        ```bash
        npm run dev
        ```

4.  Open `http://localhost:5173` in your browser.

## 📄 License
MIT
