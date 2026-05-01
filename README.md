# 🏛️ CivicPath: Election Command Center

**CivicPath** is a premium, AI-driven election intelligence platform designed to empower citizens with real-time, verified information. Built with a stunning "Cosmos" glassmorphic UI, it provides a centralized dashboard for global and local election tracking, interactive civic education, and a voice-enabled AI assistant.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

### 🚀 [Live Demo: CivicPath Command Center](https://election-assistant-161727220049.us-central1.run.app)

---

## 🌟 Key Features

### 📊 Real-Time Dashboard
- **Live Global Stats**: Track active national elections and voter registration counts in real-time.
- **Election Timeline**: Interactive schedule of upcoming 2026 major elections (Germany, Brazil, USA, India).
- **Breaking News Ticker**: Dynamic headlines curated from global frequencies.

### 🎙️ Smart Voice Assistant
- **Web-Aware Intelligence**: Uses Tavily for real-time web search.
- **Multilingual Support**: Interaction available in English, Spanish, French, and Hindi.
- **Total Resiliency**: Automatically falls back to internal AI knowledge (NVIDIA NIM) if search tools are unavailable.

### 🧠 AI Quiz & Civic Matchmaker
- **Instant Load Quiz**: Background pre-fetching and local caching for zero-latency civic testing.
- **Values Matchmaker**: AI-driven analysis of user policy alignments based on core values.

### 📰 Live Civic News
- **Verified Sources**: Fetches real-time updates from international and local news outlets.
- **Voice-Enabled Reading**: Listen to breaking news with the "Read Aloud" feature.

---

## 🛠️ Technology Stack & Google Ecosystem Adoption

- **Frontend**: React 18, Vite
- **Styling**: Vanilla CSS with Premium Glassmorphism
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Google Services Integration**:
  - **Google Gemini Pro**: Core intelligence and resilient search simulation.
  - **Google Cloud Run & Build**: Scalable production hosting and automated CI/CD.
  - **Firebase Firestore & Analytics**: Real-time civic engagement via the **Community Priority Poll**.
  - **Google Web Speech API**: Native voice interaction for accessibility.

---

## 🛡️ Resiliency, Security & Accessibility

CivicPath is engineered for 100% dynamic operations and total accessibility:
- **AI Search Backup**: High-fidelity search simulation ensures zero-downtime news and data.
- **Enhanced Accessibility**: Full **ARIA role implementation** and screen-reader optimizations for the "Cosmos" UI.
- **Security Hardening**: Secure environment variable management and input sanitization for all AI interactions.

---

## 🧪 Automated Testing

We maintain a high standard of code quality through automated testing:
- **Unit Testing**: Powered by **Vitest** and **JSDOM**.
- **Resiliency Testing**: Automated tests for `searchService` verify that AI fallbacks correctly trigger during API failures (e.g., Error 432).
- **Execution**: Run `npm test` to verify the system's integrity.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/dawalmalik0405-spec/election_assistant.git
   cd election_assistant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add your API keys:
   ```env
   VITE_TAVILY_API_KEY=your_tavily_key
   VITE_GEMINI_API_KEY=your_gemini_key
   VITE_NVIDIA_NIM_API_KEY=your_nvidia_nim_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🛡️ Resiliency & Fail-Safe Logic

CivicPath is designed for 100% uptime:
- **AI Search Backup**: If the search quota (Tavily 432) is exceeded, the system automatically triggers a high-fidelity "AI Search Simulator" to keep data dynamic.
- **Mount Protection**: Prevents memory leaks and race conditions in React hooks.
- **Caching Layer**: Uses local storage to provide "instant-on" performance for returning users.

---

## 🗺️ Roadmap
- [ ] Integration with official ECI APIs for real-time seat counts.
- [ ] Offline-first support using PWA technology.
- [ ] Advanced voter registration tool integration.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for Civic Awareness by the CivicPath Team.**
