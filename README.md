# NodeSphere

An AI-powered visual thinking and mind-mapping web application built with React, TypeScript, and Vite.

## Features

- **Interactive Canvas**: Create, drag, and connect idea nodes with zoom and pan support
- **AI-Powered Expansion**: Automatically generate related sub-ideas for selected nodes
- **Mind Map Summarization**: Generate clear textual overviews of your entire mind map
- **Local-First**: Automatic saving to localStorage, works offline
- **Customizable Nodes**: Edit node text, notes, and colors
- **Export/Import**: Save and load mind maps as JSON files
- **Light/Dark Mode**: Toggle between themes
- **Clean UI**: Modern, responsive design without external UI libraries

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Visualization**: React Flow (@xyflow/react)
- **Storage**: localStorage + IndexedDB (for AI caching)
- **Styling**: CSS Variables for theming

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sarangchaudhari635-oss/NodeSphere
cd nodesphere
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to Vercel or any static hosting service.

## Usage

1. **Start with a Central Idea**: The app begins with a central node labeled "Central Idea"
2. **Add Nodes**: Use the "Add Node" button in the toolbar
3. **Connect Ideas**: Drag from one node's edge to another to create connections
4. **Edit Nodes**: Click on any node to select it, then use the inspector panel to edit text, notes, and color
5. **AI Expansion**: Select a node and click "Expand with AI" to generate related sub-ideas
6. **Summarize**: Click "Generate Summary" to create an overview of your entire mind map
7. **Save/Load**: Use Export to save your mind map as JSON, Import to load previously saved maps

## AI Integration

The app currently uses mocked AI responses for offline functionality. To enable real AI features:

### Option 1: Gemini API (Frontend-Only)

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Open `src/utils/aiclient.ts`
3. Replace `'YOUR_GEMINI_API_KEY_HERE'` with your actual API key
4. Change `const USE_GEMINI_API = false;` to `const USE_GEMINI_API = true;`

**⚠️ Security Warning:** The API key will be exposed in client-side code. For production use, consider using a backend proxy.

**Note:** When using Gemini API directly from the frontend, you may encounter CORS issues. If this happens, you'll need to either:
- Use a backend proxy service
- Set up your deployment platform to handle CORS
- Use a different AI service that allows frontend requests

### Option 2: Backend Proxy (Recommended for Production)

For production deployments, create a backend service to proxy AI requests:

1. Create a backend API endpoint that accepts AI requests
2. Store the API key securely on the server
3. Update the AI functions in `src/utils/aiclient.ts` to call your backend instead of the AI service directly

### Option 3: Chrome Built-in AI

For Chrome extensions, you can use Chrome's built-in AI APIs (when available):

1. Set `const USE_BUILTIN_AI = true;` in `src/utils/aiclient.ts`
2. Replace the pseudocode with actual `chrome.ai` API calls
3. Requires Chrome extension context

## Deployment

This is a frontend-only application that can be deployed to any static hosting service:

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The `dist/` folder contains all necessary files for deployment to:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static web server

## Architecture

- **Local Storage**: Mind maps are automatically saved to localStorage
- **AI Caching**: AI responses are cached in IndexedDB for performance
- **Responsive Design**: Works on desktop and mobile devices
- **TypeScript**: Full type safety throughout the application

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
