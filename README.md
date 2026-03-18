# News Buzz - Angular

A full-stack news aggregation and personalization platform that delivers curated news from multiple sources, tailored to individual user preferences.

![Angular](https://img.shields.io/badge/Angular-21-red?logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?logo=firebase)

---

## Table of Contents

1. [About the Project](#about-the-project)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [API Endpoints](#api-endpoints)
8. [Firestore Collections](#firestore-collections)
9. [Deployment](#deployment)
10. [Contributors](#contributors)

---

## About the Project

**News Buzz** bridges the gap between readers and high-quality news from multiple sources. Users can personalize their experience by following preferred channels, bookmarking articles, and engaging with content through likes, comments, and shares. The platform uses Google News RSS feeds to aggregate trending and relevant stories.

---

## Features

- **Top Stories** - Trending news from Google News, localized by country
- **Advanced Search** - Search by keywords, topics, locations, and date ranges
- **Personalized Feed** - Curated feed based on search history and topic preferences
- **News Providers** - Browse, follow, and mute news sources
- **Bookmarks** - Save articles for later reading
- **Reading History** - Track and revisit previously read articles
- **Comments & Likes** - Engage with articles through comments and likes
- **Share Articles** - Share news via social media and direct links
- **User Authentication** - Secure signup/login with email verification
- **Dark/Light Theme** - Toggle between dark and light modes
- **Responsive Design** - Optimized for desktop and mobile

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| Angular 21 | Frontend framework |
| TypeScript | Type-safe development |
| Angular Material | UI component library |
| RxJS | Reactive state management |
| SCSS | Styling |
| Crypto-JS | Client-side password encryption |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| Firebase Firestore | NoSQL database |
| JWT | Authentication tokens |
| Nodemailer + Resend | Email services |
| RSS Parser | Google News RSS feed parsing |
| Puppeteer | Fallback web scraping |

---

## Project Structure

```
News-Buzz-Angular/
├── backend/
│   ├── algorithms/          # News fetching & feed generation
│   │   ├── myFeed.js        # Personalized feed algorithm
│   │   ├── top_stories.js   # Trending stories
│   │   ├── search.js        # Search algorithm
│   │   └── ...
│   ├── config/
│   │   └── firebase.js      # Firestore connection
│   ├── controllers/         # Route handlers
│   ├── middleware/
│   │   └── checkAuth.js     # JWT authentication middleware
│   ├── routes/              # API route definitions
│   └── index.js             # Express server entry point
│
├── frontend_angular/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # Reusable UI components
│   │   │   │   ├── navbar/
│   │   │   │   ├── sidebar/
│   │   │   │   ├── news-card/
│   │   │   │   ├── feed-card/
│   │   │   │   ├── bookmark-card/
│   │   │   │   ├── comments-menu/
│   │   │   │   ├── share-dialog/
│   │   │   │   └── ...
│   │   │   ├── pages/       # Route pages
│   │   │   │   ├── home/
│   │   │   │   ├── login/
│   │   │   │   ├── signup/
│   │   │   │   ├── my-feed/
│   │   │   │   ├── search-results/
│   │   │   │   ├── bookmark/
│   │   │   │   ├── history/
│   │   │   │   └── ...
│   │   │   ├── services/    # API, Auth, Theme services
│   │   │   └── app.routes.ts
│   │   ├── environments/    # Dev & prod configs
│   │   └── styles.scss      # Global styles
│   ├── angular.json
│   └── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Angular CLI** - `npm install -g @angular/cli`
- **Firebase** project with Firestore enabled

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/0408-tannu/News-Buzz-Angular.git
cd News-Buzz-Angular
```

**2. Setup Backend**

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (see [Environment Variables](#environment-variables)).

```bash
npm start
```

Backend runs on `http://localhost:9000`

**3. Setup Frontend**

```bash
cd frontend_angular
npm install
ng serve
```

Frontend runs on `http://localhost:4200`

---

## Environment Variables

Create a `backend/.env` file with the following:

```env
PORT=9000
JWT_SECRET=your_jwt_secret_key
PWD_SECRET=your_password_encryption_key

# Firebase
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key

# Email Service
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASS=your_email_app_password

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| POST | `/api/user/signup` | Register new user | No |
| POST | `/api/user/login` | Login user | No |
| GET | `/api/user/profile` | Get user profile | Yes |
| GET | `/api/algorithms/topstories` | Get trending stories | No |
| GET | `/api/search` | Search news articles | Yes |
| GET | `/api/myfeed` | Get personalized feed | Yes |
| POST | `/api/userdo/bookmark` | Bookmark an article | Yes |
| POST | `/api/userdo/like` | Like an article | Yes |
| POST | `/api/userdo/comment` | Comment on an article | Yes |
| POST | `/api/userdo/follow` | Follow a news provider | Yes |
| GET | `/api/provider/all` | Get all news providers | No |
| GET | `/api/provider/following` | Get followed providers | Yes |
| POST | `/api/mute` | Mute a news provider | Yes |
| GET | `/api/history` | Get reading history | Yes |
| POST | `/api/changepassword` | Change password | Yes |
| POST | `/api/sendemail` | Send verification email | No |

---

## Firestore Collections

| Collection | Description |
|---|---|
| `users` | User profiles and credentials |
| `bookmarks` | Saved articles per user |
| `likes` | Article likes |
| `comments` | Article comments |
| `newsProviders` | News source metadata and logos |
| `quickSearches` | Saved search queries |
| `searchLocations` | Search history with frequency tracking |
| `topStories` | Cached trending stories |
| `mutes` | Muted providers per user |
| `history` | Reading history |
| `verificationCodes` | Email verification codes |

---

## Deployment

- **Backend**: Deployed on [Render](https://render.com)
- **Frontend**: Can be deployed on [Vercel](https://vercel.com) or [Firebase Hosting](https://firebase.google.com/docs/hosting)

**Build frontend for production:**

```bash
cd frontend_angular
ng build --configuration production
```

---

## Contributors

- **Tanisha Vaghani** - [GitHub](https://github.com/0408-tannu)
