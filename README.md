# 📝 Postly – Social Blogging Web Application

Postly is a full-stack social blogging web application that allows users to create, share, and explore posts across various categories. It is built using a modern RESTful architecture with Spring Boot powering the backend, React handling the frontend, and MySQL serving as the relational database.

The project is designed to reflect real-world application development practices, focusing on scalability, clean code structure, and secure authentication using JWT.

---

## 🚀 Features

- 👤 User Registration & Authentication (JWT-based)
- 🔐 Secure Login & Role-based Authorization (User / Admin)
- ✍️ Create, Update, and Delete Posts
- 🗂️ Categorize Posts for Easy Filtering
- 🌐 Explore Posts from All Users
- 🔍 Filter Posts by Category
- 📄 Paginated Post Fetching
- ❤️ Like Posts
- 🔖 Save Posts for Later
- 💬 Comment on Posts
- 🧑 Profile-based Post Management
- 📡 RESTful API Integration with Frontend

---

## 🛠️ Tech Stack

### Backend
- Java
- Spring Boot
- Spring MVC
- Spring Data JPA (Hibernate)
- Spring Security
- JWT Authentication
- RESTful APIs
- ModelMapper
- MySQL

### Frontend
- React.js
- Zustand (State Management)
- Axios
- Tailwind CSS + DaisyUI
- HTML5 / CSS3 / JavaScript (ES6)

### Database
- MySQL

### Tools & IDE
- IntelliJ / Eclipse
- Postman (API Testing)
- Git & GitHub
- Swagger (API Documentation)

---

## 🧩 Architecture & Design

- Layered Architecture  
  `Controller → Service → Repository`

- DTO Pattern for Data Transfer

- JWT-based Stateless Authentication

- Role-based Authorization (Admin / User)

- Exception Handling using Custom Exceptions

- Pagination & Sorting with Spring Data

- Proper Entity Relationships  
  `User ↔ Post ↔ Category ↔ Comment ↔ Like ↔ Save`

- CORS Configuration for Frontend Integration

---

## 📂 Project Structure (Backend)

```

com.blog_application
├── Controller
├── Service
├── Repository
├── Entities
├── Payload (DTOs)
├── Security (JWT, Filters, Config)
└── Exceptions

````

---

## 🔐 Authentication Flow

1. User registers → Backend assigns USER role
2. User logs in → JWT token generated
3. Token stored in frontend (localStorage)
4. JWT attached to protected API requests
5. Spring Security validates token per request

---

## ⚙️ REST API Highlights

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/home/api/auth/login` | User Login |
| POST | `/home/api/USER` | User Registration |
| GET | `/home/api/POST` | Fetch All Posts (Paginated) |
| GET | `/home/api/POST/{id}` | Fetch Single Post |
| POST | `/home/api/user/{userId}/category/{categoryId}/POST` | Create Post |
| DELETE | `/home/api/POST/{id}` | Delete Post (Admin Only) |

---

## 🎯 Purpose of the Project

This project was developed as part of the **CDAC curriculum** to demonstrate practical expertise in:

- Full-stack Web Development
- REST API Design using Spring Boot
- Secure Authentication with Spring Security & JWT
- Frontend Integration with React
- Database Modeling & ORM with Hibernate
- Clean Code and Scalable Architecture

---

## 🖥️ Screenshots

> will update in future

---

## 🚀 How to Run Locally

### Backend

```bash
git clone https://github.com/koushub/postly-backend.git
cd postly-backend
configure application.properties (DB credentials)
run Spring Boot Application
```

### Frontend

```bash
git clone https://github.com/koushub/postly-frontend.git
cd postly-frontend
npm install
npm run dev
```

---

## 📌 Future Enhancements

* Admin Dashboard
* Image Upload for Posts
* Email Verification
* Forgot Password Flow
* Full-text Search
* Infinite Scroll

---

## 🤝 Contributing

Contributions are welcome. Feel free to fork the repository and submit pull requests.

---

## 📧 Contact

**Koushubh Yadav**
🔗 LinkedIn: [https://www.linkedin.com/in/koushubh-yadav/](https://www.linkedin.com/in/koushubh-yadav/)
💻 GitHub: [https://github.com/koushubh](https://github.com/koushubh)

---

⭐ If you like this project, consider giving it a star on GitHub!

