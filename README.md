# 📝 Real-Time Collaborative Notes App

A full-stack real-time notes app using MERN + Socket.IO where multiple users can edit the same note in real-time.

---

## 🚀 Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Atlas)
- **Real-Time**: Socket.IO
- **Deployment**: Render

---

## 📸 Features

- Create notes with unique room IDs
- Real-time text syncing using WebSockets
- Auto-save to MongoDB every few seconds
- Collaborators count and last updated time
- Deployed using Render (frontend + backend)

---

## 📁 Project Structure

```
realtime-notes-app/
├── client/       # Vite + React frontend
├── server/       # Express + MongoDB + Socket.IO backend
├── README.md
```

---

## 🛠️ Local Setup

> ⚠️ Requires Node.js and MongoDB (local or MongoDB Atlas)

---

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Aman00097/realtime-notes-app.git
cd realtime-notes-app
```

---

### 2️⃣ Backend Setup

```bash
cd server
cp .env.example .env     # Fill in your MongoDB URI
npm install
node server.js
```

#### Example `.env`

```env
MONGO_URI=mongodb://localhost:27017/realtime-notes
PORT=5000
```

---

### 3️⃣ Frontend Setup

```bash
cd ../client
cp .env.example .env     # Set backend URL
npm install
npm run dev
```

#### Example `.env`

```env
VITE_SERVER_URL=http://localhost:5000
```

---
