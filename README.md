# **Social.ly**

> A full-stack social media web app where users can post, like, comment, and connect — built using React (frontend), Node.js + Express (backend), and MongoDB (database).

---

## 🚀 **Tech Stack**

### **Frontend**

* React 18 
* Redux Toolkit (state management)
* Axios (API requests)

### **Backend**

* Node.js + Express.js (API framework)
* MongoDB (database)
* Mongoose (ODM)
* JSON Web Token (auth)
* Multer (file uploads)
* Bcrypt (password hashing)

---

## ⚙️ **Project Setup**

### **1️⃣ Clone the repository**

```bash
git clone https://github.com/<your-username>/Social.ly.git
cd Social.ly
```

---

### **2️⃣ Backend setup**

```bash
cd backend
npm install
```

#### **Environment Variables**

Create a `.env` file in the `backend` directory with the following values:

```bash
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/socially
JWT_SECRET=<your_secret_key>
CLOUDINARY_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
NODE_ENV=development
```

#### **Run Backend**

```bash
npm run dev
```

> Backend will start on [http://localhost:5000](http://localhost:5000)

---

### **3️⃣ Frontend setup**

```bash
cd frontend
npm install
```

#### **Frontend Environment Variables**

Create `.env` file in `frontend`:

```bash
REACT_APP_API_URL=http://localhost:5000/api
```

#### **Run Frontend**

```bash
npm run dev
```

> Frontend runs on [http://localhost:5173](http://localhost:5173)

---

### **4️⃣ Connecting Backend with Frontend**

* The frontend communicates with the backend through the base URL defined in `REACT_APP_API_URL`.
* Ensure both frontend and backend servers are running.
* All API calls (login, posts, profile, etc.) will be sent to the backend at:

  ```
  http://localhost:5000/api
  ```

---

## 🗂️ **Project Structure**

```
Social.ly/
│
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/            # Business logic for routes
│   ├── middleware/             # Auth & error handlers
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API route definitions
│   ├── utils/                  # Helper functions
│   ├── server.js               # Express server entry point
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Main page components
│   │   ├── store/              # Redux slices & store setup
│   │   ├── utils/              # API helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env.example
│
└── README.md                   # Project documentation
```

---

## 🧪 **Testing**

* Run backend tests:

  ```bash
  cd backend && npm test
  ```
* Run frontend tests (if configured):

  ```bash
  cd frontend && npm run test
  ```

---

## ✅ **Features**

* 🔐 JWT-based Authentication
* 🖼️ Image Uploads via Cloudinary
* 💬 Comments, Likes, and Posts
* 👥 Follow / Unfollow Users
* 🌓 Responsive UI with TailwindCSS

---

## 🧰 **Future Enhancements**

* Notifications & messaging
* Dark mode toggle
* Real-time chat using Socket.io

---

## 🧑‍💻 **Contributing**

1. Fork the repo
2. Create a new branch

   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit changes

   ```bash
   git commit -m "Added X feature"
   ```
4. Push and open a PR referencing the related issue.

---

---

