# VIHARA - Discover India's Hidden Gems 🇮🇳

Vihara is a premium, full-stack web application designed to help travelers discover untouched, offbeat, and incredibly beautiful destinations across India. 

![Vihara Platform](https://github.com/Govardhan1201/VIHARA/assets/placeholder-image)

## 🌟 Features

- **Interactive 3D UI**: Stunning 3D hero sections and premium micro-interactions built with Three.js and GSAP.
- **Smart Discover Map**: An integrated dynamic map to explore destinations visually, categorized by budget and experience.
- **AI Travel Assistant**: An omnipresent, multilingual AI chatbot ready to guide you to your next adventure.
- **Multilingual Support**: Fully localized in English, Hindi, and Telugu.
- **Travel Toolkit**: Built-in currency and temperature converters, alongside curated travel tips.
- **Community Submissions**: Users can submit their own hidden gems, securely reviewed via a private admin dashboard.

## 🛠️ Tech Stack

This project was recently modernized from a static HTML architecture to a robust modern web framework.

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS (with custom glassmorphism tokens)
- **Database**: SQLite
- **ORM**: Prisma
- **3D & Animation**: `@react-three/fiber`, `@react-three/drei`, GSAP
- **Map Integration**: `react-leaflet`
- **Internationalization**: `next-intl`

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Govardhan1201/VIHARA.git
   cd VIHARA/vihara-app
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📂 Folder Structure

- `/vihara-app` - The main Next.js modern application.
- `/legacy` - The original static HTML/CSS/JS version of the website.
