# Horalix Halo - Complete Setup Guide

This guide will walk you through setting up Horalix Halo from scratch and configuring it for real use.

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

---

## 🚀 Step 1: Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd horalixhalo

# Install dependencies
npm install

# This will install all required packages including:
# - Electron for desktop app
# - React for UI
# - SQLite for local database
# - WebSocket (ws) for real-time transcription
# - HTTP clients for AI providers
```

**Expected output:** You should see npm install successfully all packages without errors.

---

## 🎯 Step 2: Choose Your Configuration

Horalix Halo works in **two modes**:

### Option A: Free/Local Mode (No API Keys Required)
- Uses dummy transcription for testing
- Uses local LLM server (if you run one)
- **Best for:** Testing, development, privacy-focused users

### Option B: Production Mode (API Keys Required)
- Real speech-to-text transcription
- Real AI-powered summaries and insights
- **Best for:** Actual meeting use

**We'll cover both setups below.**

---

## 🆓 Option A: Free/Local Setup (No API Keys)

### 1. Run the App

```bash
npm run dev
```

The app will:
- Launch Electron
- Create a SQLite database in your user data folder
- Open the main window
- Show onboarding wizard

### 2. Complete Onboarding

1. **Welcome Screen** - Click "Continue"
2. **Choose Use Case** - Select your primary use (e.g., "Sales & Demos")
3. **Provider Setup**:
   - **Transcription (ASR)**: Select "Dummy (Testing)"
   - **AI Brain (LLM)**: Select "Local HTTP Server"
   - Leave API keys blank for now
4. **Plan Choice** - Keep "Free" selected
5. **Finish** - Click "Start Using Horalix Halo"

### 3. Test with Dummy Data

1. Click **"Live"** in the sidebar
2. Enter a meeting title (e.g., "Test Meeting")
3. Click **"Start Meeting"**
4. You'll see fake transcript appear every 5 seconds
5. This confirms the app is working!

### 4. (Optional) Setup Local LLM

If you want AI features without API keys:

**Option 1: Using Ollama (Recommended)**
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model
ollama pull llama2

# Start Ollama server (runs on http://localhost:11434)
ollama serve
```

**Option 2: Using llama.cpp**
```bash
# Clone llama.cpp
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp

# Build
make

# Run server
./server -m models/llama-2-7b.gguf --host 0.0.0.0 --port 8080
```

**Configure in Horalix Halo:**
1. Go to **Settings** → **AI Providers**
2. Under "AI Brain (LLM)":
   - Select "Local HTTP Server"
   - Base URL: `http://localhost:11434` (Ollama) or `http://localhost:8080` (llama.cpp)
   - Model Name: `llama2` (or your model name)
3. Click the **Test** button to verify connection
4. Now AI actions will work offline!

---

## 💎 Option B: Production Setup (With Real APIs)

This setup gives you professional-grade transcription and AI.

### 1. Get API Keys

You'll need keys for:
1. **Speech Recognition (Choose ONE)**:
   - Deepgram (recommended - $0.0043/min)
   - OpenAI Whisper ($0.006/min)
   - Local Whisper server (free, self-hosted)

2. **AI Brain (Choose ONE)**:
   - DeepSeek (recommended - very cheap)
   - OpenAI GPT-4 (highest quality)
   - Anthropic Claude (advanced reasoning)

### 2. Setup Deepgram (Recommended for Transcription)

**Why Deepgram?**
- Real-time streaming transcription
- High accuracy
- Affordable ($0.0043/minute)
- Speaker diarization

**Get API Key:**

1. Go to [deepgram.com](https://deepgram.com/)
2. Sign up for free account
3. Get $200 free credit
4. Navigate to: Console → API Keys
5. Click "Create New Key"
6. Copy the API key (starts with "Token ...")

**Configure in Horalix Halo:**

1. Run `npm run dev`
2. Complete onboarding (or go to Settings)
3. Settings → **AI Providers** → **Transcription (ASR)**
4. Select **"Deepgram"**
5. Paste your API key
6. Click **"Test"** to verify

### 3. Setup DeepSeek (Recommended for AI)

**Why DeepSeek?**
- Extremely affordable ($0.14 per million tokens)
- GPT-4 level quality
- Fast responses

**Get API Key:**

1. Go to [platform.deepseek.com](https://platform.deepseek.com/)
2. Sign up / log in
3. Navigate to: API Keys
4. Click "Create API Key"
5. Copy the key (starts with "sk-...")

**Configure in Horalix Halo:**

1. Settings → **AI Providers** → **AI Brain (LLM)**
2. Select **"DeepSeek"**
3. Paste your API key
4. Temperature: `0.7` (default is good)
5. Max Tokens: `2048` (default is good)
6. Click **"Test"** to verify

### 4. Alternative: OpenAI Setup

**Get API Key:**

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up / add payment method
3. Navigate to: API Keys
4. Click "Create new secret key"
5. Copy the key (starts with "sk-...")

**Configure in Horalix Halo:**

1. Settings → **AI Providers**
2. **Transcription**: Select "OpenAI Whisper", paste key
3. **AI Brain**: Select "OpenAI", paste same key
4. The app will use GPT-4-turbo for AI actions
5. Click **"Test"** on each to verify

### 5. Alternative: Anthropic Claude Setup

**Get API Key:**

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up / add payment method
3. Navigate to: API Keys
4. Create new key
5. Copy the key

**Configure in Horalix Halo:**

1. Settings → **AI Providers** → **AI Brain**
2. Select **"Anthropic (Claude)"**
3. Paste API key
4. Will use Claude 3 Sonnet (fast) by default
5. Click **"Test"** to verify

---

## 🎬 Step 3: Start Your First Real Meeting

Now that everything is configured:

### 1. Navigate to Live Meeting

1. Click **"Live"** in the sidebar
2. You'll see the Live Meeting page

### 2. Prepare the Meeting

1. **Meeting Title**: Enter a descriptive title (e.g., "Q1 Planning Call")
2. **Meeting Goal**: (Optional) Enter the meeting's purpose
3. **Notes**: (Optional) Add any prep notes
4. **In-person toggle**: Select "Online" or "In-person"

### 3. Start Recording

1. Click the big **"Start Meeting"** button
2. The status indicator will turn red and show "Listening"
3. Timer starts counting

### 4. Speak and Watch Transcription

- If using **Deepgram**: Transcription appears in real-time as you speak
- If using **OpenAI Whisper**: Transcription appears in 5-second chunks
- If using **Dummy**: Fake text appears every 5 seconds (for testing)

You'll see:
- Speaker labels ("You" vs "Other")
- Timestamps
- Partial transcripts (gray, updating)
- Final transcripts (black, locked in)

### 5. Use AI Features During the Meeting

**In the Right Panel ("AI Outputs" tab):**

Click any action button:
- **"Refresh Recap"** - Get live summary of conversation so far
- **"Extract Actions"** - Find action items mentioned
- **"Identify Risks"** - Spot concerns or blockers
- **"Next Steps"** - Get recommended follow-ups

Each action:
1. Sends recent transcript to your LLM
2. Uses structured prompts
3. Returns parsed JSON response
4. Displays in a card

**Using the Overlay (Advanced):**

1. Press **`Ctrl+Alt+H`** (Windows/Linux) or **`Cmd+Opt+H`** (Mac)
2. The invisible "Halo Dot" appears
3. Click it to expand the toolbar
4. Click any AI action:
   - **"Say"** (Ctrl+Alt+S) - Get reply suggestions
   - **"Follow-up"** (Ctrl+Alt+F) - Generate questions
   - **"Recap"** (Ctrl+Alt+R) - Quick summary
   - **"Actions"** (Ctrl+Alt+A) - Extract action items

Results appear in overlay cards you can copy.

### 6. Stop the Meeting

1. Click **"Stop Meeting"** button
2. Recording stops
3. Meeting is saved to database
4. Final summary is generated

### 7. Review Past Meetings

1. Click **"Meetings"** in sidebar
2. See all your meeting history
3. Click any meeting to see:
   - Full transcript
   - Executive summary
   - Detailed sections (Key Points, Decisions, Risks)
   - Action items (editable)
   - Follow-up questions

---

## ⚙️ Settings Explained

### General Tab
- **Theme**: Light / Dark / System
- **Language**: English (more coming soon)
- **Use Case Profile**: Affects AI prompt style
  - Sales: Focus on pain points, closing
  - Internal: Focus on alignment, clarity
  - Standup: Focus on brevity, blockers
  - Support: Focus on empathy, resolution
- **Auto-start on boot**: Launch app when computer starts

### AI Providers Tab

**Transcription (ASR)**
- **Dummy (Testing)**: Fake transcripts for development
- **Deepgram**: Real-time WebSocket streaming
- **OpenAI Whisper**: Chunked API calls every 5 seconds
- **Local Whisper**: Self-hosted Whisper server

**AI Brain (LLM)**
- **Local HTTP Server**: For offline/self-hosted LLMs
- **DeepSeek**: Cheap, GPT-4 quality
- **OpenAI**: GPT-4-turbo, highest quality
- **Anthropic (Claude)**: Advanced reasoning

**Primary vs Fallback**
- Primary: Your main LLM provider
- Fallback: Used if primary fails
- App auto-retries with exponential backoff

### Data & Privacy Tab
- **Data Retention**: How long to keep meetings
  - Forever (default)
  - 30 days
  - 90 days
  - 1 year
- **Clear All Data**: Deletes everything
- **Export Data**: (Coming soon) Export as JSON

### Advanced Tab
- **LLM Temperature**: 0-1 (0.7 is balanced)
  - Lower = more focused/deterministic
  - Higher = more creative/varied
- **Max Tokens**: Token limit per request
  - 2048 = ~1500 words
  - 4096 = ~3000 words
- **ASR Debounce**: Milliseconds between partial updates
- **Max Meeting Duration**: Safety limit (480 min = 8 hours)

---

## 💰 Understanding Free vs Pro

### Free Tier Limits
- **50 meetings per month**
- **300 ASR minutes per month** (5 hours)
- **100 AI requests per day**
- **Local AI unlimited** (if you self-host)
- **All core features** included

### What Counts as Usage?
- **Meeting**: Each time you click "Start Meeting"
- **ASR minute**: Each minute of transcription (not meeting time)
- **AI request**: Each time you click an AI action button

### When You Hit Limits
- App shows error: "Daily AI request limit reached (100 requests)"
- Can use UpgradeModal to see Pro benefits
- Can still use local providers (unlimited)
- Limits reset: Daily (midnight), Monthly (1st of month)

### Pro Tier (Coming Soon)
- **Unlimited everything**
- **Calendar integration** (Google Calendar)
- **Advanced AI features** (Fact-check, Conversation Coach)
- **Advanced search** (Semantic search across meetings)
- **Priority support**
- **$29/month** (estimated)

---

## 🐛 Troubleshooting

### "No transcription appearing"

**Check:**
1. Settings → AI Providers → Transcription is configured
2. API key is correct (test it)
3. You have internet connection (for online providers)
4. Check console logs (DevTools in dev mode)

**Fix:**
- Try "Dummy (Testing)" to verify app works
- Check API key has credits
- Verify API key permissions

### "AI responses not working"

**Check:**
1. Settings → AI Providers → AI Brain is configured
2. API key is correct (test it)
3. You haven't hit daily limit (check Account page)

**Fix:**
- Look at Account → Usage meters
- If at limit, wait until tomorrow or upgrade
- Try different provider
- Check provider's status page

### "Overlay not showing"

**Check:**
1. Press `Ctrl+Alt+H` to toggle
2. Check if hidden behind other windows
3. Try creating overlay from main window

**Fix:**
- Click "Open Overlay" button in Live page
- Restart app
- Check permissions (some OS restrict overlay windows)

### "Database errors"

**Check:**
- App has write permissions to user data folder
- SQLite is installed (comes with better-sqlite3)

**Fix:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "Build errors"

**Fix:**
```bash
# Clean and reinstall
rm -rf node_modules dist dist-electron package-lock.json
npm install
npm run build
```

---

## 🔒 Privacy & Security

### Data Storage
- **All data stored locally** in SQLite database
- **Location**: `~/Library/Application Support/Horalix Halo/` (Mac)
- **Location**: `~/.config/Horalix Halo/` (Linux)
- **Location**: `%APPDATA%/Horalix Halo/` (Windows)

### What's Sent to APIs
**To ASR providers (Deepgram, OpenAI Whisper):**
- Audio chunks from your microphone
- No other data

**To LLM providers (DeepSeek, OpenAI, Anthropic):**
- Transcript segments
- Meeting context (goal, notes, use case)
- No audio, no personal identifying info

**Never sent anywhere:**
- Your meetings list
- Past transcripts (unless you explicitly send them)
- Settings
- Usage data

### API Key Security
- Stored in encrypted SQLite database
- Never logged
- Never sent to anyone except the respective provider
- Electron's contextIsolation protects from XSS

### Production Security Features
- No DevTools in production builds
- No context menu (right-click disabled)
- No inspect element shortcuts
- Secure IPC communication
- No nodeIntegration in renderer

---

## 📝 Usage Examples

### Example 1: Sales Call

**Setup:**
```
Use Case: Sales & Demos
ASR: Deepgram
LLM: DeepSeek
```

**During Call:**
1. Start meeting
2. As prospect talks, use overlay "Say" action
3. Get real-time suggestions on what to say next
4. Click "Follow-up" to generate smart questions
5. At end, click "Actions" to extract next steps

**After Call:**
1. Review transcript in Meetings page
2. Copy executive summary to send to prospect
3. Copy action items to CRM
4. Mark action items as done in app

### Example 2: Team Standup

**Setup:**
```
Use Case: Standup
ASR: Local Whisper (privacy-focused)
LLM: Local HTTP (Ollama with llama2)
```

**During Standup:**
1. Let it run and transcribe
2. Use "Recap" action to get quick summary
3. Use "Actions" to extract blockers

**After Standup:**
1. Review decisions made
2. Export action items
3. Share summary with team

### Example 3: Customer Support

**Setup:**
```
Use Case: Customer Support
ASR: OpenAI Whisper
LLM: Anthropic Claude (for empathy)
```

**During Call:**
1. Customer describes issue
2. Use "Say" action for empathetic responses
3. Use "Next Steps" for resolution path
4. Use "Actions" to extract follow-up tasks

**After Call:**
1. Review transcript for quality assurance
2. Add to knowledge base
3. Track resolution time

---

## 🚀 Next Steps

Now that you're set up:

1. **Star the repo** if you find it useful!
2. **Configure your preferred providers**
3. **Run a test meeting** to verify everything works
4. **Customize Settings** to your workflow
5. **Set global hotkeys** you'll remember
6. **Try the overlay** during real meetings
7. **Review past meetings** to see AI summaries

---

## 📞 Need Help?

- **Documentation**: Check README.md
- **Issues**: Open an issue on GitHub
- **Feature Requests**: Open an issue with "Feature Request" label
- **Questions**: Discussions tab on GitHub

---

## 🎉 You're Ready!

Horalix Halo is now fully configured and ready to supercharge your meetings.

**Remember:**
- Free tier gives you 50 meetings/month to start
- Use local providers for unlimited offline use
- Configure API keys for production quality
- Press `Ctrl+Alt+H` for invisible overlay anytime

Happy meeting! 🎙️✨
