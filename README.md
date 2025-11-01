<div align="center">

# 🌐 OS Portfolio

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=3B82F6&center=true&vCenter=true&width=435&lines=Modern+Developer+Portfolio;Next.js+15+%2B+React+19;Type-Safe+%26+Production-Ready;Fully+Customizable" alt="Typing SVG" />
</p>

<p align="center">
  A stunning, high-performance developer portfolio website built with cutting-edge technologies
</p>

<!-- Badges -->
<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/nerkoux/os-portfolio?style=flat-square&color=blue" alt="License" />
  <img src="https://img.shields.io/github/stars/nerkoux/os-portfolio?style=flat-square&color=yellow" alt="Stars" />
  <img src="https://img.shields.io/github/forks/nerkoux/os-portfolio?style=flat-square&color=green" alt="Forks" />
  <img src="https://img.shields.io/github/issues/nerkoux/os-portfolio?style=flat-square&color=red" alt="Issues" />
  <img src="https://img.shields.io/github/last-commit/nerkoux/os-portfolio?style=flat-square&color=purple" alt="Last Commit" />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-installation--setup">Installation</a> •
  <a href="#-customization-guide">Customization</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-license">License</a>
</p>

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

</div>

---

## ⚡ Features

<div align="center">

| 🎯 Feature | 📝 Description |
|:-----------|:---------------|
| **⚡ Lightning Fast** | Built on Next.js 15 with Turbopack for blazing fast development |
| **🎨 Beautiful UI** | Polished interface using shadcn/ui, Radix UI, and Tailwind CSS v4 |
| **📊 GitHub Integration** | Dynamic widget that auto-fetches your GitHub profile data |
| **📧 Contact Form** | Working email API powered by Nodemailer (Gmail ready) |
| **🌗 Theme Support** | Seamless dark/light mode toggle with next-themes |
| **🖼️ Export Ready** | PDF export & screenshot capabilities built-in |
| **🌀 Smooth Animations** | Fluid animations using Framer Motion |
| **🧩 State Management** | Efficient state handling with Zustand |
| **🔒 Type-Safe** | Full TypeScript support for reliability |
| **♿ Accessible** | WCAG compliant with Radix UI primitives |

</div>

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

---

## 🛠️ Tech Stack

<div align="center">

### Core Technologies

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
      <br>Next.js 15
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
      <br>React 19
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=typescript" width="48" height="48" alt="TypeScript" />
      <br>TypeScript
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
      <br>Tailwind v4
    </td>
  </tr>
</table>

### UI & Animation

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://ui.shadcn.com/favicon.ico" width="48" height="48" alt="shadcn/ui" />
      <br>shadcn/ui
    </td>
    <td align="center" width="96">
      <img src="https://avatars.githubusercontent.com/u/75042455?s=200&v=4" width="48" height="48" alt="Radix UI" />
      <br>Radix UI
    </td>
    <td align="center" width="96">
      <img src="https://www.ejable.com/wp-content/uploads/2022/04/Framer-Motion.webp" width="48" height="48" alt="Framer Motion" />
      <br>Framer Motion
    </td>
    <td align="center" width="96">
      <img src="https://lucide.dev/favicon.ico" width="48" height="48" alt="Lucide" />
      <br>Lucide Icons
    </td>
  </tr>
</table>

### Backend & Utilities

| Category | Technology |
|:---------|:-----------|
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) |
| **Email Service** | [Nodemailer](https://nodemailer.com/about/) |
| **PDF Generation** | [jsPDF](https://github.com/parallax/jsPDF) |
| **Screenshots** | [html2canvas](https://html2canvas.hertzen.com/) |
| **Audio** | [Howler.js](https://howlerjs.com/) |
| **Animations** | [tailwindcss-animate](https://github.com/benface/tailwindcss-animate) |

</div>

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

---

## 📂 Project Structure

```
os-portfolio/
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 api/
│   │   │   └── 📁 send-email/
│   │   │       └── 📄 route.ts          # Contact form email handler
│   │   ├── 📄 layout.tsx
│   │   └── 📄 page.tsx                  # Homepage
│   ├── 📁 components/
│   │   ├── 📁 os/
│   │   │   └── 📁 widgets/
│   │   │       └── 📄 github-app.tsx    # GitHub Profile Widget
│   │   └── 📁 ui/                       # shadcn/ui components
│   ├── 📁 lib/
│   │   └── 📄 utils.ts
│   └── 📁 styles/
│       └── 📄 globals.css
├── 📁 public/
│   └── 📁 assets/
├── 📄 components.json                    # shadcn/ui config
├── 📄 next.config.ts
├── 📄 tailwind.config.js
├── 📄 tsconfig.json
├── 📄 package.json
├── 📄 .env.local.example
└── 📄 README.md
```

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

---

## ⚙️ Installation & Setup

<details>
<summary><b>📦 Prerequisites</b></summary>

- Node.js 18.17 or later
- npm, yarn, or pnpm
- Git
- Gmail account (for contact form)

</details>

### 🚀 Quick Start

```bash
# 1️⃣ Clone the repository
git clone https://github.com/nerkoux/os-portfolio.git
cd os-portfolio

# 2️⃣ Install dependencies
npm install
# or
yarn install
# or
pnpm install

# 3️⃣ Create environment file
cp .env.local.example .env.local

# 4️⃣ Configure your environment variables
# Edit .env.local and add:
# SMTP_EMAIL=your_email@gmail.com
# SMTP_PASSWORD=your_app_password

# 5️⃣ Run the development server
npm run dev
```

<div align="center">

🎉 **Open [http://localhost:3000](http://localhost:3000) in your browser!**

</div>

### 📧 Gmail App Password Setup

<details>
<summary><b>Click to expand Gmail configuration steps</b></summary>

1. Go to your [Google Account](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll to **App passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password
6. Add it to your `.env.local` file as `SMTP_PASSWORD`

> 💡 **Note:** Never use your actual Gmail password. Always use App Passwords for security.

</details>

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

---

## 🧠 Customization Guide

### 🔹 1. GitHub Widget Setup

**File:** `src/components/os/widgets/github-app.tsx`

```typescript
// Replace with your GitHub username
const username = 'your-github-username' // 👈 Change this

useEffect(() => {
  fetchGitHubData()
}, [])

const fetchGitHubData = async () => {
  setLoading(true)
  setError(null)
  
  try {
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Fetch profile data with proper headers
    const profileResponse = await fetch(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Portfolio-App'
        }
      }
    )

    if (!profileResponse.ok) throw new Error('Failed to fetch profile')
    
    const profileData = await profileResponse.json()
    setProfile(profileData)
    
    // Fetch repositories...
  } catch (err) {
    setError('Failed to load GitHub data.')
  } finally {
    setLoading(false)
  }
}
```

<details>
<summary><b>💡 Pro Tip: Using GitHub Personal Access Token</b></summary>

For higher API rate limits, add a GitHub token:

```typescript
// In .env.local
GITHUB_TOKEN=ghp_your_token_here

// In github-app.tsx
const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN

const profileResponse = await fetch(
  `https://api.github.com/users/${username}`,
  {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Accept': 'application/vnd.github.v3+json',
    }
  }
)
```

</details>

---

### 🔹 2. Contact Form Configuration

**File:** `src/app/api/send-email/route.ts`

```typescript
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Gmail SMTP Setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: process.env.SMTP_EMAIL, // Your email
      subject: `Portfolio Contact: ${name}`,
      text: message,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
```

<details>
<summary><b>🔄 Alternative Email Providers</b></summary>

**Outlook/Hotmail:**
```javascript
service: 'hotmail'
```

**Yahoo:**
```javascript
service: 'yahoo'
```

**Custom SMTP:**
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
})
```

</details>

---

### 🔹 3. UI Customization

#### Tailwind Configuration

**File:** `tailwind.config.js`

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Customize your color palette
        primary: {
          50: '#eff6ff',
          // ... add your colors
          900: '#1e3a8a',
        },
      },
      animation: {
        // Add custom animations
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
    },
  },
}
```

#### Add shadcn/ui Components

```bash
# Add individual components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog

# View all available components
npx shadcn-ui@latest add
```

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

---

## 🧩 Available Scripts

| Command | Description |
|:--------|:------------|
| `npm run dev` | 🚀 Start development server with Turbopack |
| `npm run build` | 📦 Build for production |
| `npm run start` | ▶️ Start production server |
| `npm run lint` | 🔍 Run ESLint checks |
| `npm run type-check` | ✅ Run TypeScript type checking |

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

---

## 🚀 Deployment

### ➤ Vercel (Recommended)

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nerkoux/os-portfolio)

</div>

**Steps:**

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com/new)
3. Add environment variables:
   - `SMTP_EMAIL`
   - `SMTP_PASSWORD`
4. Click **Deploy** 🎉

---

### ➤ Manual Build

```bash
# Build the application
npm run build

# Start production server
npm run start
```

---

### ➤ Alternative Hosting

<details>
<summary><b>Netlify</b></summary>

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

</details>

<details>
<summary><b>Docker</b></summary>

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
docker build -t os-portfolio .
docker run -p 3000:3000 os-portfolio
```

</details>

<details>
<summary><b>AWS (S3 + CloudFront)</b></summary>

```bash
# Build static export
npm run build

# Deploy to S3
aws s3 sync out/ s3://your-bucket-name --delete
```

</details>

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

---

## 📸 Screenshots

<div align="center">

### 🏠 Homepage
![Homepage](https://cdn.akszt.dev/a99541653e4d49f4.png)

### 📊 GitHub Widget
![GitHub Widget](https://cdn.akszt.dev/64ad4dd364b949f2.png)

### 📧 Contact Form
![Contact Form](https://cdn.akszt.dev/2853fd3a79dd4ae1.png)

### 🌗 Dark Mode
![Dark Mode](https://cdn.akszt.dev/4d1ca5879fcf40f2.png)

</div>

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

---

## 🔮 Roadmap & Future Enhancements

- [ ] 📝 **Blog Section** with MDX support
- [ ] 🔒 **reCAPTCHA Integration** for spam protection
- [ ] 📈 **Analytics Dashboard** (Google Analytics / Plausible)
- [ ] 🌍 **i18n Support** for multiple languages
- [ ] 🎨 **Theme Customizer** with live preview
- [ ] 📱 **PWA Support** for offline functionality
- [ ] 🔔 **Web Push Notifications**
- [ ] 🧪 **Unit & E2E Tests** with Jest and Playwright
- [ ] 📊 **Admin Panel** for content management
- [ ] 🚀 **Performance Monitoring** with Sentry

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

---

## 🤝 Contributing

Contributions are always welcome! Here's how you can help:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔀 Open a Pull Request

<details>
<summary><b>📋 Contribution Guidelines</b></summary>

- Follow the existing code style
- Write meaningful commit messages
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass before submitting PR

</details>

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

---

## 🐛 Bug Reports & Feature Requests

Found a bug? Have a feature suggestion? Please [open an issue](https://github.com/nerkoux/os-portfolio/issues/new) with:

- 🐛 Clear description of the bug/feature
- 📸 Screenshots (if applicable)
- 🔍 Steps to reproduce (for bugs)
- 💡 Expected behavior
- 🖥️ Environment details

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

---

## 🧑‍💻 Author

<div align="center">

<img src="https://github.com/nerkoux.png" width="100" height="100" style="border-radius: 50%;" alt="Akshat Mehta"/>

### **Akshat Mehta**

Full Stack Developer | UI/UX Enthusiast

[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://os.akshatmehta.com)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/nerkoux)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/akszt)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:hello@akshatmehta.com)

---

**Original concept inspired by [@nerkoux](https://github.com/nerkoux)**

</div>

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

---

## 📜 License

<div align="center">

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Akshat Mehta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="100%">

---

## 💖 Support

If you found this project helpful, please consider:

<div align="center">

⭐ **Star this repository**

🍴 **Fork and share**

☕ **Buy me a coffee**

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/akszt)

</div>

---

<div align="center">

### 🌟 Show some ❤️ by starring this repository!

<img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="400">

---

**Made with ❤️ and lots of ☕**

![Wave](https://raw.githubusercontent.com/mayhemantt/mayhemantt/Update/svg/Bottom.svg)

</div>
