# 📄 AI Resume Analyzer

An intelligent full-stack web application that uses Google's **Gemini AI** to analyze resumes against job descriptions. Upload a **PDF/DOCX** file or paste your resume text to receive an instant compatibility score, skill gap analysis, and actionable improvement suggestions.

![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs)
![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- 📄 **Dual Input Methods**
  - Paste resume text directly.
  - Upload PDF or DOCX resumes.

- 🤖 **AI-Powered Resume Analysis**
  - Resume match score (0–100)
  - Matched skills
  - Missing skills
  - Professional summary
  - Personalized improvement tips

- ⚡ **Real-Time Feedback**
  - Beautiful responsive UI
  - Animated score indicator
  - Skill badges
  - Instant analysis results

- 📑 **Smart File Parsing**
  - Automatic PDF and DOCX detection
  - Text extraction using `pdf-parse` and `mammoth`

- 🔐 **Secure Backend**
  - Helmet
  - CORS
  - Rate Limiting
  - Global Error Handling
  - Input Validation

---

# 🛠️ Tech Stack

## Frontend

- React 18
- Vite
- Tailwind CSS
- Fetch API

## Backend

- Node.js
- Express.js
- Google Gemini API
- Multer
- pdf-parse
- mammoth
- express-rate-limit
- Helmet
- CORS
- Morgan

---

# 🚀 Getting Started

## Prerequisites

- Node.js 18+
- npm or Yarn
- Google Gemini API Key

Get your API key from:

https://aistudio.google.com/

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Yusra230/ai-resume-analyzer.git
cd ai-resume-analyzer
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the **backend** folder.

```env
PORT=5000
GOOGLE_API_KEY=your_gemini_api_key_here
NODE_ENV=development

MAX_RESUME_CHARS=4000
MAX_JOB_DESC_CHARS=2000
RATE_LIMIT_MAX_REQUESTS=20
```

Start the backend server.

```bash
npm run dev
```

---

## Frontend Setup

Open another terminal.

```bash
cd frontend
npm install
npm run dev
```

Visit:

```
http://localhost:5173
```

---

# 📡 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/resume/analyze-json` | Accepts resume text (plain text or base64) and job description. Returns AI analysis JSON. |
| POST | `/api/v1/resume/analyze` | Legacy endpoint for multipart/form-data uploads using Multer. |

---

## Sample Request

```json
{
  "resumeText": "Experienced React developer with 5 years...",
  "jobDescription": "Looking for a full-stack engineer..."
}
```

---

## Sample Response

```json
{
  "status": "success",
  "data": {
    "matchScore": 78,
    "matchedSkills": [
      "React",
      "Node.js",
      "TypeScript"
    ],
    "missingSkills": [
      "Kubernetes",
      "GraphQL"
    ],
    "summary": "Strong candidate with solid frontend experience...",
    "improvementTips": [
      "Learn Kubernetes basics...",
      "Explore GraphQL..."
    ]
  }
}
```

---

# 📁 Project Structure

```text
ai-resume-analyzer/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# 🧠 How It Works

1. The frontend sends the resume text (or a base64-encoded uploaded file) along with the job description.
2. The backend detects whether the resume is plain text or base64.
3. If it's a file, the backend identifies the file type using magic bytes (`%PDF` or `PK`).
4. The parser extracts clean text using **pdf-parse** or **mammoth**.
5. The extracted text and job description are sent to **Google Gemini** with a structured prompt.
6. Gemini returns structured JSON containing:
   - Match score
   - Matched skills
   - Missing skills
   - Summary
   - Improvement tips
7. The frontend displays the results with an interactive dashboard.

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/AmazingFeature
```

3. Commit your changes

```bash
git commit -m "Add AmazingFeature"
```

4. Push to your branch

```bash
git push origin feature/AmazingFeature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for more information.

---

# 🙏 Acknowledgements

- Google Gemini API
- pdf-parse
- mammoth.js
- Express Rate Limit
- React
- Express.js

---

## ⭐ Support

If you found this project helpful, consider giving it a **⭐ Star** on GitHub.

It helps others discover the project and motivates future improvements.

---

Built with ❤️ using React, Node.js, Express, and Google Gemini AI.
