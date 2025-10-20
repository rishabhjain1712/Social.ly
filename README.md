
# 🌐 Social.ly — Full Stack Web Application

**Social.ly** is a full-stack web application built with **Node.js**, **Express**, and **React**.
The project follows a modular architecture with separate folders for the **frontend** and **backend**, ensuring scalability and maintainability.

---

## 📁 Project Structure

```
.
├── backend/         # Express.js server and APIs
│   ├── server.js    # Entry point for backend
│   ├── package.json
│   └── ...
│
└── frontend/        # React application
    ├── src/
    ├── package.json
    └── ...
```

---

## ⚙️ Tech Stack

### 🖥️ Frontend

* React (Create React App)
* React Router DOM
* Axios (for API communication)

### 🧠 Backend

* Node.js
* Express.js
* Nodemon (for development hot reload)
* (Optional) Prisma / MongoDB / PostgreSQL for database integration

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/Social.ly.git
cd Social.ly
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
npm run dev
```

By default, the backend runs on **[http://localhost:5000](http://localhost:5000)**

**Example `.env` file:**

```
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
npm start
```

By default, the frontend runs on **[http://localhost:3000](http://localhost:3000)**

---

## 🔗 Connecting Frontend and Backend

Make sure the frontend’s API calls point to your backend’s URL. Example:

```js
axios.get("http://localhost:5000/api/users");
```

---

## 🧩 Build Scripts

**Backend (package.json)**

```json
{
  "dev": "nodemon server.js"
}
```

**Frontend (package.json)**

```json
{
  "start": "react-scripts start",
  "build": "react-scripts build"
}
```

---

## 📦 Folder Responsibilities

| Folder      | Description                                                            |
| ----------- | ---------------------------------------------------------------------- |
| `backend/`  | Contains Express server, routes, controllers, and configuration files. |
| `frontend/` | Contains the React app, components, pages, and UI logic.               |

---

## 🚢 Deployment

1. Build the frontend:

   ```bash
   npm run build
   ```
2. Serve the frontend through the backend or deploy it separately using **Vercel** or **Netlify**.
3. Deploy the backend using **Render**, **Railway**, **AWS**, or **Heroku**.

---

## 🤝 Contributing

We welcome contributions!
To get started:

1. **Fork** the repository
2. **Create** a new branch:

   ```bash
   git checkout -b feature/your-feature
   ```
3. **Commit** your changes
4. **Push** to your fork and open a **Pull Request**

---

## 🧾 License

This project is licensed under the **MIT License**.
See the [LICENSE](./LICENSE) file for details.

---

## 🌟 Support the Project

If you found this project helpful, please **star ⭐ the repository** — it means a lot!

---
