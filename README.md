# Horalix Halo

**Invisible AI Meeting Assistant** with offline-first architecture

Horalix Halo is a premium, Cluely-style meeting assistant built with Electron, React, and TypeScript. It provides real-time transcription, AI-powered insights, and a stealth overlay interface—all while supporting both online and offline workflows.

---

## ✨ Key Features

### Invisible First
- **Halo Dot**: Minimalistic 12px floating dot that appears during meetings
- **Stealth Overlay**: Expands on hover to show AI actions
- **Global Hotkeys**: Control everything without switching windows
- **System Tray Integration**: Lives quietly in your system tray

### Local First
- **Offline Mode**: Works without internet using local AI models
- **Local Storage**: All data stored in SQLite locally
- **Privacy First**: No data sent to cloud unless you configure it
- **Free-Tier Friendly**: Designed to work with free and open-source AI

### Free vs Pro
- **Free Tier**: 50 meetings/month, 300 ASR minutes/month, 100 AI requests/day
- **Pro Tier**: Unlimited everything + calendar integration + advanced features

### AI Powered
- **Live Transcription**: Real-time speech-to-text during meetings
- **Smart Suggestions**: "What should I say?" AI coaching
- **Auto Summaries**: Structured summaries with decisions, risks, and action items
- **Multiple Providers**: Support for local LLMs, OpenAI, Anthropic, DeepSeek

---

## 🏗️ Architecture

### Tech Stack
- **Desktop**: Electron 28
- **Frontend**: React 18 + TypeScript + Vite
- **State**: Zustand + React Query
- **Styling**: Tailwind CSS
- **Database**: SQLite (better-sqlite3)
- **Testing**: Vitest

### Layers
1. **UI Layer**: React components and pages
2. **Services Layer**: IPC clients and hooks
3. **Electron Main**: Window management, DB, orchestration
4. **Domain Layer**: Models, repositories, business logic
5. **Integration Layer**: ASR providers, LLM providers, APIs

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Create distributable
npm run dist
```

### First Run

1. **Onboarding**: Choose your use case (Sales, Internal, Support, etc.)
2. **Configure Providers**:
   - For **offline**: Use "Dummy" ASR + "Local HTTP" LLM (or run local models)
   - For **online**: Add API keys for Deepgram, OpenAI, Anthropic, etc.
3. **Start Meeting**: Click "Start Meeting" in Live view

---

## ⚙️ Configuration

### ASR (Automatic Speech Recognition)

#### Dummy (Testing)
- No configuration needed
- Emits fake transcript for testing
- **Use for**: Development and testing

#### Local Whisper
- Run your own Whisper server locally
- Set `localWhisperUrl` in settings (e.g., `http://localhost:9000`)
- **Use for**: Offline, free transcription

#### Deepgram
- Get API key from [deepgram.com](https://deepgram.com)
- Add key in Settings > AI Providers
- **Use for**: High-quality online transcription

#### OpenAI Whisper
- Use OpenAI's Whisper API
- Requires OpenAI API key
- **Use for**: Premium online transcription

### LLM (AI Brain)

#### Local HTTP Server
- Run any OpenAI-compatible LLM locally (e.g., llama.cpp, Ollama)
- Set `localLlmBaseUrl` and `localLlmModelName`
- **Use for**: Free, offline AI without usage limits

#### DeepSeek
- Get API key from [deepseek.com](https://platform.deepseek.com)
- Affordable pricing
- **Use for**: Cost-effective online AI

#### OpenAI (GPT-4)
- Requires OpenAI API key
- Uses GPT-4 or GPT-3.5-turbo
- **Use for**: Premium AI quality

#### Anthropic (Claude)
- Requires Anthropic API key
- Uses Claude models
- **Use for**: Advanced reasoning and analysis

---

## 🎮 Usage

### Live Meeting

1. Click **"Live"** in sidebar
2. Enter meeting title
3. Click **"Start Meeting"**
4. Speak! Transcription appears in real-time
5. Add notes in the "Context" panel
6. Click **"Stop Meeting"** when done

### Invisible Overlay

- Press `Ctrl+Alt+H` (or `Cmd+Opt+H` on Mac) to toggle overlay
- Click Halo Dot to expand toolbar
- Use AI actions:
  - **Say** (`Ctrl+Alt+S`): Get reply suggestions
  - **Follow-up** (`Ctrl+Alt+F`): Generate follow-up questions
  - **Recap** (`Ctrl+Alt+R`): Get live recap
  - **Actions** (`Ctrl+Alt+A`): Extract action items

### Meetings History

- View all past meetings in **"Meetings"**
- Search by title, date, or content
- Click meeting to see full details, transcript, and action items

### Settings

- **General**: Theme, language, auto-start
- **AI Providers**: Configure ASR and LLM providers
- **Data & Privacy**: Data retention, export, clear data
- **Advanced**: LLM temperature, max tokens, etc.

### Account

- View current plan (Free or Pro)
- See usage metrics
- Enter activation code to upgrade to Pro

---

## 🔒 Security

Production builds include:

- ✅ DevTools disabled
- ✅ Context menu disabled
- ✅ F12 and Ctrl+Shift+I blocked
- ✅ Default menu removed
- ✅ `contextIsolation: true`
- ✅ `nodeIntegration: false`
- ✅ Typed IPC bridge via preload

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui
```

---

## 📦 Building & Distribution

### Development Build
```bash
npm run build
npm run build:electron
npm start
```

### Production Distributables
```bash
# All platforms
npm run dist

# macOS only
npm run dist:mac

# Windows only
npm run dist:win

# Linux only
npm run dist:linux
```

Outputs will be in the `release/` directory.

---

## 🗺️ Project Structure

```
horalixhalo/
├── electron/                  # Electron main process
│   ├── main.ts               # Entry point
│   ├── preload.ts            # IPC bridge
│   ├── db/                   # Database & migrations
│   ├── ipc/                  # IPC handlers
│   ├── services/             # ASR, LLM, storage
│   ├── tray/                 # Tray icon & menu
│   ├── windows/              # Window management
│   ├── security/             # Security guards
│   └── utils/                # Utilities
├── src/                      # React frontend
│   ├── components/           # UI components
│   ├── config/               # App configuration
│   ├── hooks/                # React hooks
│   ├── layout/               # Layout components
│   ├── models/               # TypeScript models
│   ├── pages/                # Page components
│   ├── services/             # Frontend services
│   ├── store/                # Zustand stores
│   └── types/                # Type declarations
├── tests/                    # Test files
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 💡 Free vs Pro Comparison

| Feature | Free | Pro |
|---------|------|-----|
| **Meetings/month** | 50 | ∞ |
| **ASR minutes/month** | 300 | ∞ |
| **AI requests/day** | 100 | ∞ |
| **Local AI** | ✅ Unlimited | ✅ Unlimited |
| **Basic overlay tools** | ✅ | ✅ |
| **Calendar integration** | ❌ | ✅ |
| **Advanced AI prompts** | ❌ | ✅ |
| **Risk analysis** | Limited | ✅ |
| **Conversation coach** | ❌ | ✅ |
| **Advanced search** | ❌ | ✅ |

---

## 🎯 Personas & Use Cases

### Startup Founder / Sales
- Live coaching during investor pitches
- Auto-generate follow-ups after sales calls
- Extract action items and close deals faster

### Internal Team Lead
- Capture standup notes automatically
- Track decisions and risks across meetings
- Never miss action items

### Consultant / Freelancer
- Keep organized notes for multiple clients
- Searchable meeting history
- Professional summaries to share

---

## 🐛 Troubleshooting

### No transcription appearing
- Check ASR provider is configured in Settings
- For Dummy provider, transcripts appear every 5 seconds
- For online providers, verify API key is correct

### AI responses not working
- Check LLM provider configuration
- Verify API key or local server URL
- Check usage limits in Account page

### Overlay not appearing
- Press `Ctrl+Alt+H` to toggle
- Check that overlay window isn't hidden behind other windows

### Build errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Ensure Node.js version is 18+

---

## 🤝 Contributing

This is a private/proprietary application. Contributions are managed internally.

---

## 📄 License

Proprietary. All rights reserved.

---

## 🙏 Acknowledgments

- Inspired by Cluely's meeting assistant concept
- Built with Electron, React, and the amazing open-source ecosystem
- Designed for privacy, speed, and offline-first workflows

---

**Horalix Halo** — Your invisible meeting companion.
