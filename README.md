# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# brain-ware 



🏥 MedSync — AI-Powered Hospital Workflow Intelligence Platform
1️⃣ Project Title
MedSync — Real-Time Hospital Workflow Coordination & Risk Intelligence Platform

2️⃣ Description
MedSync is a web-based hospital workflow intelligence platform designed to improve coordination between hospital departments and reduce operational delays in patient care.
In many hospitals, departments like registration, doctors, laboratory, pharmacy, and billing operate independently. This creates communication gaps and makes it difficult to track patient progress in real time.
MedSync connects all departments through a centralized task-based system that:
tracks the complete patient journey
detects delays across departments
calculates real-time operational risk
prioritizes patients based on urgency
generates AI-driven workflow insights
The platform transforms fragmented hospital operations into a unified, intelligent coordination system.

3️⃣ Tech Stack Used
Frontend
React / Next.js
Tailwind CSS
Core System Logic
Task-based workflow engine
Weighted risk scoring algorithm
Real-time delay tracking
AI Integration
GPT-5.2 (via Emergent LLM integration)
Structured prompt-based analysis
Data Layer
Structured in-memory dataset (prototype)
Designed for PostgreSQL / Supabase scaling

4️⃣ How to Run the Project
Clone repository:
git clone https://github.com/your-username/medsync.git
cd medsync
Install dependencies:

npm install
Run development server:

npm run dev
Open in browser:
http://localhost:3000

5️⃣ Dependencies
Main packages used:
react
next
tailwindcss
lucide-react
emergent-llm-sdk
Install all dependencies:
npm install

6️⃣ Important Instructions
This project is a working prototype for demonstration.
Login system is demo-based (not secure authentication).
Data is stored in memory (no persistent database yet).
AI responses are generated using structured workflow metrics.
Demo login credentials:
doctor / 1234
lab / 1234
pharmacy / 1234
admin / 1234

7️⃣ Demo Video of MVP
Add your project demo video link here:
https://your-demo-video-link.com
Example demo includes:
patient registration
department workflow updates
risk score recalculation
patient timeline tracking
AI insight generation

8️⃣ Demo Images of MVP
Add screenshots of the system interface.
Example folder structure:
/screenshots
   ├── command-center.png
   ├── patient-timeline.png
   ├── department-workflow.png
   ├── risk-scoring.png
   └── ai-insights.png
These images should demonstrate:
command center dashboard
department task panels
patient timeline view
risk score visualization
AI operational insights

