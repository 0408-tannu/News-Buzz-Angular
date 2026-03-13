# NewsBuzz React - Complete Frontend UI Documentation

> Aa file ma badha frontend pages, components, layout, cards, headers, sidebars - badhuj detail ma describe karelu che.

---

## Table of Contents

1. [App Layout Architecture](#app-layout-architecture)
2. [Navbar (Header)](#navbar-header)
3. [Sidebar Navigation](#sidebar-navigation)
4. [Pages](#pages)
   - [Home Page (Logged Out)](#1-home-page-logged-out)
   - [Logged Home Page (Logged In)](#2-logged-home-page-logged-in)
   - [Login Page](#3-login-page)
   - [Signup Page](#4-signup-page)
   - [My Feed Page](#5-my-feed-page)
   - [Search Results Page](#6-search-results-page)
   - [Bookmark Page](#7-bookmark-page)
   - [History Page](#8-history-page)
   - [User Profile Page](#9-user-profile-page)
   - [News Providers Pages](#10-news-providers-pages)
   - [About Us Page](#11-about-us-page)
   - [Contact Us Page](#12-contact-us-page)
   - [404 Page Not Found](#13-404-page-not-found)
5. [Shared Card Components](#shared-card-components)
6. [Modal / Dialog Components](#modal--dialog-components)
7. [Utility Components](#utility-components)
8. [Theme & Styling System](#theme--styling-system)
9. [Routing Structure](#routing-structure)

---

## App Layout Architecture

App nu main layout 3 part ma divided che:

```
┌──────────────────────────────────────────────────┐
│                    NAVBAR (Top)                  │
│  Logo | Search | Location Filter | Topics | User │
├──────────┬───────────────────────────────────────┤
│          │                                       │
│ SIDEBAR  │           MAIN CONTENT                │
│          │         (Page Component)              │
│  Home    │                                       │
│  Feed    │    ┌─────────┐  ┌─────────┐          │
│  Follow  │    │  Card   │  │  Card   │          │
│  Bookmark│    │         │  │         │          │
│  History │    └─────────┘  └─────────┘          │
│          │                                       │
│ ──────── │    ┌─────────┐  ┌─────────┐          │
│ Theme 🌙 │    │  Card   │  │  Card   │          │
│ Logout   │    │         │  │         │          │
│          │    └─────────┘  └─────────┘          │
└──────────┴───────────────────────────────────────┘
```

- **Navbar** → Fixed top bar, badha pages par same rahe che
- **Sidebar** → Left side, collapsible (64px collapsed ↔ 220px expanded)
- **Main Content** → Right side, page content change thay route pramane

---

## Navbar (Header)

**File:** `src/components/Navbar.jsx`

Navbar ek fixed top bar che je badha pages par display thay che.r

### Elements (Left to Right):

| # | Element | Description |
|---|---------|-------------|
| 1 | **Logo** | NewsBuzz custom SVG logo + "NewsBuzz" gradient text (blue + gold) |
| 2 | **Search Bar** | Text input with search icon, focus par expand thay, Enter press karo to search page par jao |
| 3 | **Advanced Search Toggle** | Search bar ni andar ek button che je advanced filters open kare |
| 4 | **Location Filter** | Dropdown with Country → State → City selection, news ne location wise filter kare |
| 5 | **Quick Search Topics** | Horizontal scrollable chips/buttons, user na saved topics display thay |
| 6 | **Add Topic Button (+)** | Click par inline input open thay, new topic add karo |
| 7 | **Profile/Account Button** | User avatar/icon, click par `/account` page par jao |

### Advanced Search Panel:
- Date range filter (From date, To date)
- Site-specific search (e.g., search only from bbc.com)
- Apply/Clear buttons

### Quick Search Topics:
- Each topic ek clickable chip/button che
- Click karo to search by that topic
- **Right-click** karo to "Remove Topic" option aave (custom context menu)
- Remove par custom themed confirmation dialog aave (browser confirm nahi)
- Shimmer loading animation while topics load thai raha hoy

### Location Filter Dropdown:
- 3 levels: Country → State → City
- JSON data thi populate thay
- Select karo to news articles ne geo-filter kare

---

## Sidebar Navigation

**File:** `src/components/SidebarNavigation.jsx`

Left side nu collapsible navigation panel.

### Visual Design:
- Semi-transparent background with **backdrop blur** effect
- Smooth width transition (0.3s ease)
- **Collapsed:** 64px width (only icons visible)
- **Expanded:** 220px width (icons + labels visible)

### Navigation Items (Top Section):

| # | Icon | Label | Route | Description |
|---|------|-------|-------|-------------|
| 1 | 🏠 HomeIcon | Home | `/` | Main homepage |
| 2 | 📰 Custom FeedIcon | Feed | `/myfeed` | Personalized news feed |
| 3 | 👥 Custom FollowingIcon | Following | `/providers/following` | Followed providers |
| 4 | 🔖 BookmarkIcon | Bookmark | `/bookmark` | Saved articles |
| 5 | 📜 HistoryIcon | History | `/history` | Browsing history |

### Bottom Section:

| # | Element | Description |
|---|---------|-------------|
| 1 | **Theme Toggle** | Dark/Light mode switch (sun/moon icon) |
| 2 | **Logout Button** | Red styled button, click par logout + redirect to login |

### Active State:
- Active page nu sidebar item highlight thay
- Blue left border (3px) active item par
- Background color change on active

### Collapsed State:
- Only icons visible
- Tooltips show on icon hover

---

## Pages

### 1. Home Page (Logged Out)

**File:** `src/pages/Home.jsx`
**Route:** `/` (when user is NOT logged in)

```
┌─────────────────────────────────────────┐
│              Search Bar                 │
│         [🔍 Search for news...]         │
├────────────────────┬────────────────────┤
│                    │                    │
│  ┌──────────────┐  │  ┌──────────────┐ │
│  │ UnLogged     │  │  │ UnLogged     │ │
│  │ NewsCard     │  │  │ NewsCard     │ │
│  │              │  │  │              │ │
│  │ Title        │  │  │ Title        │ │
│  │ Summary      │  │  │ Summary      │ │
│  │ Provider     │  │  │ Provider     │ │
│  └──────────────┘  │  └──────────────┘ │
│                    │                    │
│  ┌──────────────┐  │  ┌──────────────┐ │
│  │ UnLogged     │  │  │ UnLogged     │ │
│  │ NewsCard     │  │  │ NewsCard     │ │
│  └──────────────┘  │  └──────────────┘ │
│                    │                    │
│        [Login to see more →]           │
│                    │                    │
│         ∞ Infinite Scroll...           │
└────────────────────┴────────────────────┘
```

**Features:**
- 2-column grid layout (24px gap)
- **UnLoggedNewsCard** components use thay
- Click on card → Login page redirect
- Share button functional che
- Like, comment, bookmark → disabled (login required)
- Skeleton loading cards while data fetch thay
- Infinite scroll pagination (scroll down → more articles load)
- Login prompt button visible

---

### 2. Logged Home Page (Logged In)

**File:** `src/pages/LoggedHome.jsx`
**Route:** `/` (when user IS logged in)

```
┌─────────────────────────────────────────┐
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │  NewsCard    │  │  NewsCard    │    │
│  │ ┌──────────┐ │  │ ┌──────────┐ │    │
│  │ │ Image    │ │  │ │ Image    │ │    │
│  │ └──────────┘ │  │ └──────────┘ │    │
│  │ Title        │  │ Title        │    │
│  │ Summary text │  │ Summary text │    │
│  │              │  │              │    │
│  │ 📰Provider  │  │ 📰Provider  │    │
│  │ ⏱ 2hrs ago  │  │ ⏱ 5hrs ago  │    │
│  │              │  │              │    │
│  │ [♥ 12] [💬 3] [📤] [🔖] │        │
│  └──────────────┘  └──────────────┘    │
│                                         │
│         ∞ Infinite Scroll...           │
└─────────────────────────────────────────┘
```

**Features:**
- 2-column grid layout (16px gap)
- Full **NewsCard** components with all interactions
- Article image display
- Like button with animated count
- Comment button → opens CommentsMenu popover
- Share button → opens ShareDialog
- Bookmark toggle
- Provider logo + name display
- Relative time display ("2 hours ago")
- Click card → article opens in new tab + saved to history
- Infinite scroll with lazy loading

---

### 3. Login Page

**File:** `src/pages/Login.jsx`
**Route:** `/login`

```
┌─────────────────────────────────────────┐
│                                         │
│     ○ (decorative blur circle)          │
│                                         │
│         ┌───────────────────┐           │
│         │                   │           │
│         │    [Logo SVG]     │           │
│         │                   │           │
│         │  "Welcome back"   │           │
│         │                   │           │
│         │ ┌───────────────┐ │           │
│         │ │ ✉ Email       │ │           │
│         │ └───────────────┘ │           │
│         │                   │           │
│         │ ┌───────────────┐ │           │
│         │ │ 🔒 Password 👁│ │           │
│         │ └───────────────┘ │           │
│         │                   │           │
│         │ [Forgot Password?]│           │
│         │                   │           │
│         │ ┌───────────────┐ │           │
│         │ │   LOG IN      │ │           │
│         │ └───────────────┘ │           │
│         │                   │           │
│         │ Don't have account│           │
│         │ [Sign up]         │           │
│         └───────────────────┘           │
│                                         │
│            ○ (decorative blur)          │
└─────────────────────────────────────────┘
```

**Visual Design:**
- Full-screen gradient background
- Decorative blur circles (glass morphism effect)
- Centered card with semi-transparent background

**Form Elements:**
- **Email input** → Email icon prefix, validation
- **Password input** → Lock icon prefix, show/hide toggle (eye icon)
- **Login button** → Blue gradient, full width
- **Forgot Password link** → Opens ForgotPassword modal
- **Sign up link** → Navigate to `/signup`

**Functionality:**
- Password encrypted with CryptoJS before sending
- Toast notifications for success/error feedback
- Token stored in localStorage on success
- Redirect to home after login

---

### 4. Signup Page

**File:** `src/pages/Signup.jsx`
**Route:** `/signup`

Similar layout to Login page with additional fields:

```
┌───────────────────────┐
│      [Logo SVG]       │
│   "Create Account"    │
│                       │
│ ┌───────────────────┐ │
│ │ 👤 Username       │ │
│ └───────────────────┘ │
│ ┌───────────────────┐ │
│ │ ✉ Email           │ │
│ └───────────────────┘ │
│ ┌───────────────────┐ │
│ │ 🔒 Password     👁│ │
│ └───────────────────┘ │
│ ┌───────────────────┐ │
│ │ 🔒 Confirm Pass 👁│ │
│ └───────────────────┘ │
│                       │
│ ┌───────────────────┐ │
│ │     SIGN UP       │ │
│ └───────────────────┘ │
│                       │
│ Already have account? │
│ [Log in]              │
└───────────────────────┘
```

**Form Elements:**
- Username input
- Email input with validation
- Password + Confirm Password with show/hide
- Role selection (Reader/Provider) if applicable
- Sign up button
- Link to login page

---

### 5. My Feed Page

**File:** `src/pages/MyFeed.jsx`
**Route:** `/myfeed`

```
┌─────────────────────────────────────────┐
│     ┌─────────────────────────┐         │
│     │ 🔍 Search your feed...  │         │
│     └─────────────────────────┘         │
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │ FeedNewsCard │  │ FeedNewsCard │    │
│  │ ┌──────────┐ │  │ ┌──────────┐ │    │
│  │ │  Large   │ │  │ │  Large   │ │    │
│  │ │  Image   │ │  │ │  Image   │ │    │
│  │ └──────────┘ │  │ └──────────┘ │    │
│  │              │  │              │    │
│  │ Article Title│  │ Article Title│    │
│  │ Summary...   │  │ Summary...   │    │
│  │              │  │              │    │
│  │ 📰 Provider │  │ 📰 Provider │    │
│  │ ⏱ Time      │  │ ⏱ Time      │    │
│  │ [♥][💬][📤][🔖]│ │ [♥][💬][📤][🔖]│    │
│  └──────────────┘  └──────────────┘    │
│                                         │
│         ∞ Infinite Scroll...           │
└─────────────────────────────────────────┘
```

**Features:**
- Search bar at top with focus expansion animation
- **FeedNewsCard** components (larger variant, full-width images)
- 2-column grid layout
- Articles load from multiple endpoints:
  - Text-based feed
  - Topic-based feed
  - Alternating between sources
- Infinite scroll triggers at 75% scroll position
- Skeleton loader cards while fetching
- Error state display if fetch fails

---

### 6. Search Results Page

**File:** `src/pages/SearchResults.jsx`
**Route:** `/search?q=query&site=...&tbs=...&gl=...`

```
┌─────────────────────────────────────────┐
│                                         │
│  Search results for "query"             │
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │  NewsCard    │  │  NewsCard    │    │
│  │  (search     │  │  (search     │    │
│  │   results)   │  │   results)   │    │
│  └──────────────┘  └──────────────┘    │
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │  NewsCard    │  │  NewsCard    │    │
│  └──────────────┘  └──────────────┘    │
│                                         │
│         ∞ Infinite Scroll...           │
└─────────────────────────────────────────┘
```

**Query Parameters:**
- `q` → Search query text
- `site` → Filter by specific website (e.g., bbc.com)
- `tbs` → Time-based filter (date range)
- `gl` → Geo-location filter

**Features:**
- Results display as NewsCard components
- Infinite pagination with React Query
- Dynamic filtering based on URL parameters
- Back to search if no results

---

### 7. Bookmark Page

**File:** `src/pages/Bookmark.jsx`
**Route:** `/bookmark`

```
┌─────────────────────────────────────────┐
│                                         │
│  🔖 Your Bookmarks                     │
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │ BookmarkCard │  │ BookmarkCard │    │
│  │              │  │              │    │
│  │ Title        │  │ Title        │    │
│  │ Summary      │  │ Summary      │    │
│  │ Provider     │  │ Provider     │    │
│  │              │  │              │    │
│  │ [Remove 🔖]  │  │ [Remove 🔖]  │    │
│  └──────────────┘  └──────────────┘    │
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │ BookmarkCard │  │ BookmarkCard │    │
│  └──────────────┘  └──────────────┘    │
│                                         │
│   (Empty state if no bookmarks)        │
└─────────────────────────────────────────┘
```

**Features:**
- Displays all saved/bookmarked articles
- BookmarkCard components
- Remove bookmark functionality
- Empty state with message when no bookmarks

---

### 8. History Page

**File:** `src/pages/History.jsx`
**Route:** `/history`

```
┌─────────────────────────────────────────┐
│                                         │
│  📜 Browsing History    [Clear All 🗑]  │
│                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ History │ │ History │ │ History │  │
│  │ Card    │ │ Card    │ │ Card    │  │
│  │         │ │         │ │         │  │
│  │ Title   │ │ Title   │ │ Title   │  │
│  │ (3 line)│ │ (3 line)│ │ (3 line)│  │
│  │         │ │         │ │         │  │
│  │ ⏱ time  │ │ ⏱ time  │ │ ⏱ time  │  │
│  │    [🗑] │ │    [🗑] │ │    [🗑] │  │
│  └─────────┘ └─────────┘ └─────────┘  │
│                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ History │ │ History │ │ History │  │
│  │ Card    │ │ Card    │ │ Card    │  │
│  └─────────┘ └─────────┘ └─────────┘  │
│                                         │
│   (Empty state: "No history yet")      │
└─────────────────────────────────────────┘
```

**Header Section:**
- History icon + "Browsing History" title
- "Clear All" button (red styled) → deletes all history

**HistoryNewsCard:**
- Article title (truncated to 3 lines with ellipsis)
- Timestamp in human-readable format ("2 hours ago", "March 10, 2026")
- Delete button (🗑) → only visible on hover
- Click card → re-opens article

**Grid Layout:**
- `grid-template-columns: repeat(auto-fill, minmax(340px, 1fr))`
- Responsive - adapts to screen width

**Empty State:**
- Large history icon
- "No browsing history yet" message

---

### 9. User Profile Page

**File:** `src/pages/UserProfile.jsx`
**Route:** `/account`

```
┌─────────────────────────────────────────┐
│                                         │
│            ┌──────────┐                 │
│            │  Profile │                 │
│            │  Image   │                 │
│            │ (150x150)│                 │
│            └──────────┘                 │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │  Username:  [tanisha_v]         │    │
│  │                                 │    │
│  │  ┌──────────┐  ┌──────────┐    │    │
│  │  │First Name│  │Last Name │    │    │
│  │  └──────────┘  └──────────┘    │    │
│  │                                 │    │
│  │  Age:       [22            ]    │    │
│  │                                 │    │
│  │  Phone:     [+91 98765...]     │    │
│  │                                 │    │
│  │  Email:     [user@email.com]   │    │
│  │                                 │    │
│  │  Topics:                        │    │
│  │  [Technology ✕] [Sports ✕]     │    │
│  │  [Politics ✕]                  │    │
│  │  [+ Add Topic]                 │    │
│  │                                 │    │
│  │  ┌────────────┐ ┌────────────┐ │    │
│  │  │  Update    │ │Reset Pass  │ │    │
│  │  │  Profile   │ │            │ │    │
│  │  └────────────┘ └────────────┘ │    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

**Profile Image:**
- Circular (150x150 pixels)
- Top-center positioned
- Default avatar if no image

**Form Fields:**
- **Username** → Text input (may be read-only)
- **First Name / Last Name** → Side-by-side text inputs
- **Age** → Number input
- **Phone Number** → Text input
- **Email** → Email input (may be read-only)
- **Topics** → Badge/chip list with remove (✕) buttons + add topic input

**Action Buttons:**
- **Update Profile** → Save changes to server
- **Reset Password** → Opens ResetPassword modal dialog

**Container Styling:**
- Semi-transparent background
- Rounded corners
- Centered on page

---

### 10. News Providers Pages

#### All Providers (`/providers/all`)
**File:** `src/pages/NewsProviderPageAll.jsx`

- Lists all available news providers
- Provider cards with logo, name, description
- Follow/Unfollow button on each card

#### Following Providers (`/providers/following`)
**File:** `src/pages/NewsProviderPageFollowing.jsx`

- Shows only providers the user follows
- Same card layout as All Providers
- Unfollow button to remove

#### Create Provider (`/providers/create`)
**File:** `src/pages/ProviderPage.jsx`

- Only visible to users with PROVIDER role
- Form to create/manage a news provider profile
- Fields for provider name, description, logo, etc.

---

### 11. About Us Page

**File:** `src/pages/AboutUs.jsx`
**Route:** `/about`

```
┌─────────────────────────────────────────┐
│                                         │
│           ✨ NewsBuzz ✨                │
│     (Gradient text: blue + gold)        │
│                                         │
│  "Your one-stop destination for         │
│   curated news from trusted sources"    │
│                                         │
│  ┌──────────┐┌──────────┐┌──────────┐  │
│  │What We Do││Our Mission││ Our Team │  │
│  │          ││          ││          │  │
│  │ We bring ││ To make  ││ A team   │  │
│  │ you news ││ news     ││ of devs  │  │
│  │ from top ││ accessible││ and     │  │
│  │ sources  ││ to all   ││ designers│  │
│  └──────────┘└──────────┘└──────────┘  │
│                                         │
│           Our Features                  │
│                                         │
│  ┌──────────┐┌──────────┐┌──────────┐  │
│  │ 📈       ││ ✅       ││ 📱       │  │
│  │ Trending ││ Trusted  ││ Any      │  │
│  │ News     ││ Sources  ││ Device   │  │
│  │ (green)  ││ (red)    ││ (orange) │  │
│  │          ││          ││          │  │
│  │ Stay     ││ Only     ││ Access   │  │
│  │ updated  ││ verified ││ anywhere │  │
│  └──────────┘└──────────┘└──────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

**Hero Section:**
- "NewsBuzz" in large gradient text
- Tagline/description

**Info Cards (3 cards):**
- What We Do
- Our Mission
- Our Team
- Each with descriptive text

**Feature Cards (3 cards):**
- **Trending News** → Green accent icon
- **Trusted Sources** → Red accent icon
- **Any Device** → Orange accent icon
- Hover animation: card lifts up with shadow increase

---

### 12. Contact Us Page

**File:** `src/pages/ContactUs.jsx`
**Route:** `/contact`

- Contact form with input fields
- Name, Email, Subject, Message fields
- Submit button → sends email via backend (Resend/NodeMailer)
- Toast notification on success/failure

---

### 13. 404 Page Not Found

**File:** `src/pages/PageNotFound.jsx`
**Route:** `*` (any unmatched route)

- Large "404" text
- "Page Not Found" message
- Link/button to go back to Home

---

## Shared Card Components

### NewsCard (`src/components/NewsCard.jsx`)

Full-featured article card for logged-in users.

```
┌─────────────────────────────┐
│ ┌─────────────────────────┐ │
│ │     Article Image       │ │
│ │     (thumbnail)         │ │
│ └─────────────────────────┘ │
│                             │
│ Article Title Here          │
│ Summary text lorem ipsum    │
│ dolor sit amet...           │
│                             │
│ 📰 ProviderLogo  Provider  │
│ ⏱ 2 hours ago              │
│                             │
│ [♥ 12] [💬 3] [📤 Share] [🔖]│
└─────────────────────────────┘
```

**Elements:**
- **Article Image** → Thumbnail from article
- **Title** → Bold, clickable
- **Summary** → Truncated description text
- **Provider Info** → Provider logo (20-24px) + provider name
- **Time** → Relative time ("2 hours ago")
- **Action Buttons** (visible on hover):
  - ♥ **Like** → Toggle like with animated count (vertical slide animation, 300ms)
  - 💬 **Comment** → Opens CommentsMenu popover
  - 📤 **Share** → Opens ShareDialog modal
  - 🔖 **Bookmark** → Toggle bookmark (filled/outline icon)

**Interactions:**
- Card hover → Lift effect (translateY) + shadow increase
- Click card → Opens article in new tab + adds to history
- Action buttons fade in on hover
- Rounded corners (16px)

---

### FeedNewsCard (`src/components/FeedNewsCard.jsx`)

Larger variant designed for feed pages.

- Same features as NewsCard
- **Larger article image** (full-width)
- Better suited for 2-column grid layout
- More prominent display

---

### UnLoggedNewsCard (`src/components/UnLoggedNewsCard.jsx`)

Simplified card for non-authenticated users.

- Article title + summary
- Provider info
- **Click → Redirects to Login page**
- Like, Comment, Bookmark → Disabled
- Share button → Still functional
- Simpler styling, less interactive

---

### HistoryNewsCard (`src/components/HistoryNewsCard.jsx`)

Compact card for history page.

```
┌─────────────────────────┐
│                         │
│ Article Title Here      │
│ That Can Go Up To       │
│ Three Lines Max...      │
│                         │
│ ⏱ March 10, 2026       │
│                    [🗑] │
└─────────────────────────┘
```

- Title (max 3 lines with ellipsis)
- Formatted timestamp
- Delete button (🗑) → Only visible on hover
- Compact layout

---

### BookmarkCard (`src/components/BookmarkCard.jsx`)

Card for bookmarked articles.

- Similar to NewsCard layout
- Save/Unsave toggle functionality
- Provider info display

---

## Modal / Dialog Components

### ShareDialog (`src/components/ShareDialog.jsx`)

```
┌─────────────────────────┐
│ Share Article        [✕] │
│                         │
│  [𝕏 Twitter]           │
│  [📘 Facebook]          │
│  [🔗 Copy Link]        │
│                         │
└─────────────────────────┘
```

- Fixed modal centered on screen
- **Share options:**
  - **X (Twitter)** → Opens Twitter share URL with article link
  - **Facebook** → Opens Facebook share URL
  - **Copy Link** → Copies article URL to clipboard
- Tooltips on hover for each option
- Close button (✕) top-right corner
- Toast notification when link copied

---

### CommentsMenu (`src/components/CommentsMenu.jsx`)

```
┌─────────────────────────────┐
│ Comments                     │
│                              │
│ ┌──────────────────────────┐ │
│ │ @user1 · 2hrs ago        │ │
│ │ "Great article!"    [🗑] │ │
│ ├──────────────────────────┤ │
│ │ @user2 · 5hrs ago        │ │
│ │ "Interesting read"       │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ Write a comment...    [➤]│ │
│ └──────────────────────────┘ │
└─────────────────────────────┘
```

- **Popover** component anchored to comments button
- Width: 380px, max-height with scroll
- **Comment list:**
  - Username + timestamp
  - Comment text
  - Delete button (🗑) → Only for user's own comments
- **Comment input:**
  - Textarea (2 rows)
  - Send button (➤ SendIcon)
- **Empty state:** Info alert "No comments yet"

---

### ForgotPassword Modal

- Email input field
- "Send Reset Link" button
- Sends password reset email via backend
- Toast notifications

### ResetPassword Modal

- Current password input
- New password input
- Confirm new password input
- Submit button
- Validation for password match

---

## Utility Components

### Logo (`src/components/Logo.jsx`)

Custom SVG logo component:
- Gradient background (blue to darker blue)
- "N" letterform in white
- Lightning bolt accent in gold/orange gradient
- Live indicator red dot
- Brand text: "NewsBuzz" with gradient ("News" = blue, "Buzz" = gold)
- Customizable height parameter

### DottedSpinner (`src/components/DottedSpinner.jsx`)

Loading spinner:
- 8 dots arranged in a circle
- 30x30px size
- Blue dots (#3268bf)
- 1.5s rotation animation
- Used throughout app as loading indicator

### CustomCursor (`src/components/CustomCursor.jsx`)

- Custom cursor following mouse movement
- Currently disabled in production

---

## Theme & Styling System

### Dark Mode

| Element | Color |
|---------|-------|
| Background (main) | `#121212` |
| Background (sidebar) | `#1a1a1a` |
| Background (cards) | `rgb(40, 40, 40)` |
| Text (primary) | `rgba(255, 255, 255, 0.92)` |
| Text (secondary) | `rgba(255, 255, 255, 0.6)` |
| Borders | `rgba(255, 255, 255, 0.06)` to `0.1` |

### Light Mode

| Element | Color |
|---------|-------|
| Background (main) | `#ffffff` / light gray |
| Background (sidebar) | White with transparency |
| Background (cards) | White |
| Text (primary) | `#1a1a2e` |
| Text (secondary) | `rgba(0, 0, 0, 0.6)` |
| Borders | `rgba(0, 0, 0, 0.04)` to `0.08` |

### Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue | `#1E90FF` | Buttons, links, active states |
| Dark Blue | `#0055CC` | Gradient endpoints |
| Gold | `#FFD700` | Logo accent, "Buzz" text |
| Success Green | `#22C55E` | Positive actions |
| Error Red | `#EF4444` | Delete, logout, errors |
| Warning Orange | `#F59E0B` | Feature accent |

### Typography

- **Font Family:** "Quicksand", Arial, sans-serif
- **Global:** Font smoothing enabled, smooth scrolling

### Custom Scrollbar

- Width: 6px
- Track: Transparent
- Thumb: Light gray, rounded
- Hover: Slightly darker gray

### Animations

| Animation | Duration | Description |
|-----------|----------|-------------|
| Card hover lift | 0.3s | `translateY(-4px)` + shadow increase |
| Sidebar expand | 0.3s ease | Width 64px ↔ 220px |
| Search bar focus | 0.3s | Width expansion |
| Like count | 300ms | Vertical slide animation |
| Shimmer loading | continuous | Gradient shift left-to-right |
| Toast auto-dismiss | 3000ms | Auto fade out |
| Page load | fade-in | CSS keyframe animation |
| Spinner rotation | 1.5s | 360° continuous rotation |

---

## Routing Structure

```
/                       → Home (logged out) OR LoggedHome (logged in)
/login                  → Login Page
/signup                 → Signup Page
/search?q=...           → Search Results Page
/myfeed                 → My Feed Page (personalized)
/account                → User Profile Page
/bookmark               → Bookmark Page
/providers/all          → All News Providers
/providers/following    → Followed Providers
/providers/create       → Create Provider (PROVIDER role only)
/history                → Browsing History
/about                  → About Us Page
/contact                → Contact Us Page
*                       → 404 Page Not Found
```

### Authentication Flow:
- **Not logged in:** Can only access `/`, `/login`, `/signup`, `/about`, `/contact`
- **Logged in (READER):** All routes except `/providers/create`
- **Logged in (PROVIDER):** All routes including `/providers/create`

### State Management:
- **Auth Token** → localStorage
- **Theme (Dark/Light)** → ThemeContext (React Context)
- **Server Data** → React Query (TanStack Query)
- **HTTP Client** → Axios with config-based backend URL
- **Notifications** → React Hot Toast (Quicksand font, custom styling)

---

*This document describes the complete UI of the NewsBuzz React application as of March 2026.*
