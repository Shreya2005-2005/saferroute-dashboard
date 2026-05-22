# Safer Route AI 🚦  
A risk‑aware routing application built with **React + Vite** for the dashboard and a companion **Android app** for mobile users.

## 📌 Project Overview
This project provides safer travel routes by analyzing accident data and predicting risk zones using clustering and risk scoring.  
- **Frontend:** React + Vite (with HMR and ESLint rules)  
- **Backend:** FastAPI + ML models (KMeans clustering, risk scoring)  
- **Mobile App:** Android APK for Safer Route AI  

## ⚡ React + Vite Setup
This template uses Vite for fast development with React.  
- Hot Module Replacement (HMR) enabled  
- ESLint rules included  
- Two official plugins available:  
  - `@vitejs/plugin-react` (Oxc)  
  - `@vitejs/plugin-react-swc` (SWC)  

👉 Note: React Compiler is disabled by default due to performance impact. See React Compiler Docs [(react.dev in Bing)](https://www.bing.com/search?q="https%3A%2F%2Freact.dev%2Fblog%2F2024%2F04%2F25%2Freact-compiler") if you want to enable it.

## 🛠 Expanding ESLint
For production apps, we recommend using **TypeScript** with type‑aware lint rules.  
Check out the Vite TS template for integration with `typescript-eslint`.

## 📱 Android App
The Safer Route AI mobile app is available as an APK:  
**`application-5ff0f235-92a6-4f02-a5f8-4cd686b65c89.apk`**  

- Download the APK to your phone.  
- Tap to install (allow installation from unknown sources if prompted).  
- Open the app and start exploring safer routes.  

## 🚀 How to Run Locally
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open `http://localhost:5173` [(localhost in Bing)](https://www.bing.com/search?q="http%3A%2F%2Flocalhost%3A5173%2F") in your browser.

---
