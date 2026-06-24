# Thongmus Students Organization (TSO) — Official Web Platform

The official web platform for the **Thongmus Students Organization (TSO)**, built using **Django** to provide a complete, database-driven backend for managing the organization's core operations.

## Why Django?

Django was chosen as the backend framework because of its ability to handle complex, data-heavy operations efficiently and securely. Almost every feature on this platform is backed by the database — member records, donation history, gallery content, and registration data are all fetched, validated, and managed through Django's ORM and model layer. This ensures:

- **Centralized data management** — all information (members, donations, gallery items) is stored and retrieved from a single, structured database.
- **Reliable backend logic** — Django handles authentication, form validation, and data processing behind the scenes for every module.
- **Scalability** — as the organization grows, new features and data can be added without restructuring the core system.
- **Security** — Django's built-in protections (CSRF, SQL injection prevention, etc.) keep member and donation data safe.

## Features

- 👥 **Member Management** — Add, update, and manage member profiles, all synced with the database.
- 💰 **Donation Dashboard** — Track and display donation records pulled directly from the database in real time.
- 🖼️ **Gallery** — Dynamic media gallery where images/content are managed and served from the backend.
- 📝 **Registration System** — Full registration workflow for new members and events, with all submissions stored and validated through Django.

## Tech Stack

- **Backend:** Django (Python)
- **Database:** SQLite 
- **Frontend:** agar HTML/CSS/JS 
