<div align="center">
  <br />
    <a href="https://travel-one-lime.vercel.app/" target="_blank">
      <img src="https://res.cloudinary.com/dibvsl8ic/image/upload/v1761678649/Screenshot_2025-10-26_000259_f5lwzk.png">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/-React-black?style=for-the-badge&logo=react&logoColor=white&color=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/-Tailwind%20CSS-black?style=for-the-badge&logo=tailwindcss&logoColor=white&color=06B6D4" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/-Redis-black?style=for-the-badge&logo=redis&logoColor=white&color=DC382D" alt="Redis" />

  </div>

<h3 align="center">Nexus chat</h3>

</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)

## <a name="introduction">🤖 Introduction</a>

NexusChat is a real-time messaging application designed to offer fast and seamless one-to-one communication. It uses modern technology to deliver instant message updates, ensuring users stay connected without delays. With a clean and intuitive interface, chatting feels smooth and effortless across all devices. The app also handles message storage efficiently, allowing quick access to recent conversations. Overall, NexusChat provides a reliable and responsive chatting experience built for everyday communication.

## <a name="tech-stack">⚙️ Tech Stack</a>

- Next.js
- Redis
- TailwindCSS
- Pusher Channels
- Zod
- Docker

## <a name="features">🔋 Features</a>

👉 **Real-Time Messaging**: Enables instant one-to-one conversations with smooth and reliable message delivery across devices.

👉 **Pusher-Powered Live Updates**: Uses Pusher Channels to deliver real-time message synchronization without manual WebSocket management.

👉 **Redis-Backed Fast Storage**: Stores and retrieves recent chats efficiently using Redis for rapid access and improved responsiveness.

👉 **Secure Input Validation**: Ensures safe and error-free messaging with strict Zod-based validation for all chat inputs.

👉 **Device-Consistent Experience**: Maintains chat history and message continuity, providing a unified experience across multiple devices.

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- (Optional) Docker Desktop - if running with Docker

**Cloning the Repository**

```bash
git clone https://github.com/Rishivenkatakousik/chat-app.git
cd chat-app
```

**Installation Options**

### A. Docker (recommended for production / consistent environment)

Prerequisites:

- Docker Desktop installed and running

Build and run (compose will build image and start the service):

```bash
docker compose up --build
```

Notes:

- Use `docker compose up --build -d` to run in detached mode.
- Ensure all required environment variables are provided to the container (see Environment Variables below). Do NOT rely on a local `.env.local` being copied into the image in production; instead supply env vars via your CI/deploy or docker-compose `environment:` / `env_file:`.

Example docker-compose fragment (for reference):

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    env_file: .env.prod
    # or
    # environment:
    #   NEXTAUTH_URL: "https://yourdomain.com"
    #   NEXTAUTH_SECRET: "..."
```

### B. Local development (npm)

Prerequisites:

- Node.js (v18+ recommended) and npm

Install dependencies and run dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000/](http://localhost:3000/) in your browser to view the project.

**Set Up Environment Variables**

Create a new file named `.env.local` in the root of your project and add the following content:

```env
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

PUSHER_APP_ID=
NEXT_PUBLIC_PUSHER_APP_KEY=
PUSHER_APP_SECRET=
```

## Notes and Troubleshooting

- If real-time features don't work in production, verify Pusher keys and cluster, ensure WebSockets are allowed, and confirm environment variables are correct.
- If auth/callbacks fail in production, check `NEXTAUTH_URL` and `NEXTAUTH_SECRET`.
- For Docker deployments, prefer passing env vars at runtime (docker-compose `env_file` or `environment`) rather than copying `.env.local` into the image.

This README includes a project introduction, features, and step-by-step installation instructions.😊
