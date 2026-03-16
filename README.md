# Portfolio Backend

Backend service for my personal developer portfolio.

This project provides the server-side logic used by my portfolio application. It handles data management, business logic, and exposes an API that can be consumed by a frontend client.

The purpose of this project is to demonstrate backend development skills using Java and modern backend architecture practices.

---

## Overview

This backend is responsible for:

- Managing portfolio data
- Processing requests from the frontend
- Handling application logic

The project is structured to follow clean and maintainable backend development practices.

---

## Tech Stack

**Language**
- Java

**Framework**
- Spring Boot 

**Build Tool**
- Gradle

**Other Tools**
- Git
- GitHub
- REST API architecture

---

## Project Structure

```
src
 ├── main
 │   ├── java
 │   │   └── com/valenvalag/
 │   │       ├── controller
 │   │       └── models
 │   │
 │   └── resources
 │       ├── application.properties
 │
 └── test
```

---

## Endpoints
| Method | Endpoint | Description |
|------|------|------|
| GET | `/repositories` | Gets all personal projects that I have public in GitHub |
| POST | `/send-email` | Submit a contact message |

---

## Author

**Valen Valag**

GitHub  
https://github.com/ValenValag

Portfolio page   
https://valentinalvarez.vercel.app/en

---

## License

This project is licensed under the MIT License.
