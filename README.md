# ArogyaMitra - AI-Powered Digital Health Partner

<p align="center">
  <img src="src/app/icon.png" alt="ArogyaMitra Logo" width="100" />
</p>

## Overview

ArogyaMitra (meaning "Health Friend" in Hindi) is a comprehensive healthcare web application that leverages artificial intelligence to assist doctors and medical professionals in their daily workflow. The app is built with modern technologies including Next.js, Firebase, Genkit (Google's AI development framework), and Tailwind CSS.

## 🚀 Key Features

### 1. **User Authentication**
- Secure login and signup system powered by Firebase Authentication
- Protected routes for healthcare professionals only

### 2. **Dashboard**
- Overview of key activities and patient data
- Risk summary cards showing health alerts
- Patient vitals monitoring
- Quick access to pending tasks (radiology reports, transcripts to process)

### 3. **AI-Powered Core Features**

#### 🔬 Radiology Report Analysis
- Analyzes free-text radiology reports
- Extracts structured medical findings with severity levels (mild, moderate, severe, critical)
- Identifies anatomical locations of findings
- Flags critical follow-up recommendations, especially for incidental findings

#### 📝 Clinical Note Generation
- Transcribes and summarizes doctor-patient conversations
- Automatically generates structured clinical notes including:
  - **Subjective**: Chief Complaint, HPI, ROS
  - **Objective**: Physical Exam findings, diagnostic results
  - **Assessment**: Diagnosis, Differential Diagnoses
  - **Plan**: Treatment plan, follow-up, medications

#### ⚠️ Health Risk Alerts
- AI-powered risk detection from patient data
- Early warning system for potential health issues

#### 🏥 Diagnostics Assistant
- AI-assisted diagnostic support for physicians

### 4. **Communication Hub**
- Platform for managing patient communications
- Integration with conversation transcripts

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| Frontend | Next.js 14 (React), TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Backend/Database | Firebase (Firestore, Authentication) |
| AI Engine | Genkit (Google's AI flow framework) |
| Icons | Lucide React |

## 📋 Prerequisites

- Node.js 18.x or later
- npm or yarn
- Firebase project with:
  - Firebase Authentication enabled
  - Cloud Firestore enabled

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-health-detectiom-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firebase Authentication (Email/Password)
   - Enable Cloud Firestore
   - Copy your Firebase config to `src/firebase/config.ts`

4. **Configure environment variables**
   ```env
   # Add your Firebase configuration in src/firebase/config.ts
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── ai/                          # AI flows and Genkit configuration
│   └── flows/
│       ├── ai-clinical-note-generation-flow.ts
│       ├── ai-diagnostic-insight.ts
│       ├── ai-health-risk-alerts.ts
│       └── ai-radiology-report-analysis.ts
├── app/                         # Next.js App Router pages
│   ├── dashboard/               # Protected dashboard routes
│   ├── login/                   # Login page
│   └── signup/                  # Signup page
├── components/                  # React components
│   ├── auth/                    # Authentication components
│   ├── dashboard/               # Dashboard components
│   ├── diagnostics/             # Diagnostics features
│   ├── radiology/              # Radiology features
│   ├── risk-alerts/            # Risk alerts features
│   └── ui/                     # shadcn/ui components
├── firebase/                    # Firebase configuration and hooks
└── hooks/                       # Custom React hooks
```

## 👥 Target Users

- Doctors and physicians
- Healthcare professionals
- Medical administrators

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Made with ❤️ for better healthcare
</p>

