# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# AI Twin – Personal AI Companion

AI Twin is a sophisticated personal AI assistant designed to learn from your conversations, remember context, and act as a digital extension of yourself. It leverages a hybrid architecture combining local LLMs (via Ollama) and cloud-based models (via Groq) to deliver fast, secure, and intelligent responses.

Key capabilities include intent-based routing, long-term memory management, document processing, and seamless integration with various tools.

![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-green)
![Redis](https://img.shields.io/badge/Redis-7.0-red)
![License](https://img.shields.io/badge/License-MIT-purple)

## 🚀 Features

-   **🧠 Hybrid Intelligence**: Automatically routes queries between local LLMs (Ollama) for privacy/personal tasks and cloud LLMs (Groq) for general knowledge.
-   **💾 Memory System**: Incorporates short-term and long-term memory to maintain context across conversations.
-   **⚡ High Performance**: Uses **Redis** for caching frequent queries and **Celery** for background task processing.
-   **📂 Document Intelligence**: Upload documents for background processing and analysis to expand the AI's knowledge base.
-   **🛡️ Secure Authentication**: User management and authentication system using JWT (JSON Web Tokens).
-   **🎯 Intent Classification**: Smartly classifies user queries (e.g., Coding, Casual, Personal) to optimize response generation.

## 🛠️ Tech Stack

-   **Framework**: FastAPI
-   **Database**: SQLModel (SQLite/PostgreSQL)
-   **Cache**: Redis
-   **Task Queue**: Celery
-   **LLM Serving**: Ollama (Local), Groq (Cloud)
-   **Orchestration**: LangChain, LangGraph

## 📂 Project Structure

```bash
ai-twin/
├── app/
│   ├── core/           # Core logic (Config, Security, LLM, Memory, Celery)
│   ├── api/            # API Route definitions
│   ├── models.py       # Database models
│   ├── database.py     # Database connection setup
│   └── tasks.py        # Celery background tasks
├── temp_uploads/       # Temporary storage for document processing
├── main.py             # Application entry point
├── requirements.txt    # Python dependencies
└── .env                # Environment variables
```

## ⚙️ Setup & Installation

### Prerequisites

-   Python 3.10+
-   Redis Server (running locally or remotely)
-   Ollama (for local models)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-twin.git
cd ai-twin/backend
```

### 2. Create a Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```
*Note: Ensure you have uncommented the necessary packages in `requirements.txt` (redis, celery, langchain, etc.) if they are not already active.*

### 4. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
SECRET_KEY=your_super_secret_key
GROQ_API_KEY=your_groq_api_key
REDIS_URL=redis://localhost:6379/0
DATABASE_URL=sqlite:///./database.db
```

### 5. Setup External Services

#### Start Redis
```bash
docker run -d -p 6379:6379 --name ai-redis redis:7
# OR run a local instance directly
```

#### Start Ollama
```bash
ollama serve
ollama pull llama3  # or phi3, mistral, etc.
```

## 🏃‍♂️ Running the Application

### 1. Start Support Services (Celery)
To process background tasks (like document uploads), start the Celery worker:

```bash
# Windows (requires gevent or solo pool usually, but for dev):
celery -A app.core.celery_app worker --loglevel=info --pool=solo

# Linux/Mac
celery -A app.core.celery_app worker --loglevel=info
```

### 2. Start the Backend Server
```bash
uvicorn main:app --reload
```

The API will be available at **http://localhost:8000**.

## 📖 API Documentation

FastAPI provides automatic interactive documentation:

-   **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
-   **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Key Endpoints

-   `POST /users/`: Register a new user.
-   `POST /token`: Login and get a JWT access token.
-   `POST /chat/`: Interact with the AI (requires Auth).
-   `POST /upload-doc/`: Upload files for processing (requires Auth).

## 🔮 Future Improvements

-   [ ] Web chat interface (React/Next.js)
-   [ ] Mobile companion app (React Native/Flutter)
-   [ ] LoRA-based personal brain training
-   [ ] Autonomous task execution agents
-   [ ] Cross-app memory integration

## ✍️ Author

**Yash Singh**  
*CSE Student | AI Systems Builder*
