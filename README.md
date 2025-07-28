<div align="center">
  <img src="./frontend/public/Rydirect Logo 512x512.png" alt="Rydirect Logo" width="150" style="border-radius: 10px;">
  <h1 align="center" style="font-size: 2.5rem;">Rydirect | Revolutionizing Links</h1>
  <p align="center">
    Every Click Counts.
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
    <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
  </p>
</div>

---

### **Table of Contents**
1.  [**✨ Key Features**](#-key-features)
2.  [**🛠️ Tech Stack**](#️-tech-stack)
3.  [**🚀 Getting Started**](#-getting-started)
4.  [**📸 Demo Links**](#-demolinks)

---

## ✨ Key Features

| Feature                 | Description                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| 🔗 **Link Management** | Full CRUD for links, custom short codes, batch organization, and bulk actions.                          |
| 🚀 **Redirect Experience** | Choose between instant redirects or use one of three customizable splash page designs per link.         |
| 🛡️ **Security & Visibility**| Set links as Public, Private (password-protected), or Shareable. Schedule links with activation dates.  |
| 📊 **Analytics** | A full analytics dashboard with charts and tables for clicks, countries, and referrers.                 |
| 🎨 **Branding** | Customize your public profile, upload custom icons, and create branded promotional cards.               |
| 📲 **QR Codes** | Instantly generate and download a branded QR code for any link directly from the admin panel, or using "/qr"           |

---

## 🛠️ Tech Stack

| Category      | Technology                                                      |
| ------------- | --------------------------------------------------------------- |
| **Frontend** | `React` `Vite` `TypeScript` `Tailwind CSS` `Framer Motion`      |
| **Backend** | `Node.js` `Express` `TypeScript` `Prisma` `MongoDB`             |
| **Deployment**| `Vercel` (Frontend) & `VPS` with `Nginx` + `PM2` (Backend)      |

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Project Setup
```bash
# 1. Clone the repository
git clone <https://github.com/sibisiddharth8/Rydirect.git>

# 2. Install dependencies for backend and setup Prisma
cd ./backend
npm install
npx prisma generate
npx prisma db push

# 3. Seed the database with initial data and run the server
npx prisma db seed
npm run dev

# 4. Install dependencies for frontend and run the frontend
cd ./frontend
npm install
npm run dev
```

## 📸 Demo Links
- [Public Page](https://links.sibisiddharth.me/all)
- [Splash Page](https://links.sibisiddharth.me/mymind) 
    - splash page styles: minimal, branded, company.
    - page visibility: public, private, shareable.
- [QR Page](https://links.sibisiddharth.me/linkedin/qr)    
- [Admin Panel](https://rydirect.sibisiddharth.me)

## 🤝 Contact
For inquiries, please reach out via Get in Touch from my [Website](https://www.sibisiddharth.me).
