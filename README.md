# Suwayba's Blog App
This is a generic blog application that lets users create, view, edit, and delete their personal blog posts as well as view other users' blog posts. It takes UI inspiration from [Linear](https://linear.app/now) and is built with React, ChakraUI, and Supabase for the backend.


## Features
- Authentication with Supabase (sign up, log in, log out).
- Homepage showing all posts.
- "My Posts" page for user-specific content.
- Create, edit, and delete posts.
- Search posts
- Responsive design.


## Tech Stack
- Frontend: React, Chakra UI
- Backend: Supabase (Database + Auth)
- Deployment: Vercel

## Getting Started
1. Clone the repo
```bash
git clone https://github.com/Susu-spec/blog-app.git
cd blog-app
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
Create a `.env` file in the root of the project:
```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the project
```bash
npm run dev
```


## Project Structure
```bash
src/
 ┣ assets/         # Image assets (App Snapshot)
 ┣ components/     # UI components (Navbar, SearchModal, etc.)
 ┣ hooks/          # Custom hooks (useAuthUser, usePosts)
 ┣ pages/          # Page-level components (Home, MyPosts, CreatePost)
 ┣ libs/           # Helpers & configs
 ┣ routes/         # Route level configs
 ┗ main.jsx        # Entry point
```


##  Live Demo
Check out the live app here: [susu-blog.vercel.app](https://susu-blog.vercel.app/)