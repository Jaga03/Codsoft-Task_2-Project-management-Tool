# 🗂️ Project Management Tool

A full-stack web application to manage projects, assign tasks, and track progress visually. Built with **MERN stack**, **Firebase Authentication**, and deployed on **Render** & **Netlify**.

---

## 🚀 Features

- 🔐 Secure Firebase authentication with session cookies  
- 📁 Create and manage multiple projects  
- ✅ Add, assign, and track tasks with real-time status updates  
- 📊 Dashboard with task charts (Bar & Doughnut)  
- 🧑‍💼 Profile page with password change  
- 🌙 Modern UI with responsive design  
- ☁️ Backend on Render | Frontend on Netlify

---

## 🛠️ Tech Stack

**Frontend:**  
- React + Vite  
- Firebase Auth  
- Chart.js  
- React Toastify  
- Styled Components + CSS

**Backend:**  
- Node.js + Express  
- MongoDB + Mongoose  
- Firebase Admin SDK  
- Render deployment

---

## 🧾 Environment Setup

### 🔑 Firebase Setup
1. Create Firebase project  
2. Enable Email/Password login in Auth  
3. Generate Admin SDK JSON (save as `firebase-admin.json`)  
4. Base64 encode it for Render deployment

### ⚙️ Environment Variables

- PORT=5000
- MONGO_URI=your_mongodb_url
- NODE_ENV=production
- FIREBASE_ADMIN_SDK=your_base64_encoded_firebase_admin_json

#### On **Render (Backend)**


---

## 🧑‍💻 Local Development

### Backend
```bash
git clone https://github.com/your-username/project-management-tool.git
cd backend
npm install
npm run dev

###Frontend

cd frontend
npm install
npm run dev

🌍 Deployment
Backend (Render)
- Connect repo → Create Web Service

- Set environment variables

- Start command: npm start

- Use Build command if needed: npm install

Frontend (Netlify)
- Connect GitHub repo

- Set env variables

- Build command: npm run build

- Publish directory: dist

📩 Contact
Created by: Jagathish Kumar
📧 LinkedIn - https://www.linkedin.com/in/jagathish-kumar-u/

