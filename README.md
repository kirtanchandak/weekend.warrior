# Weekend Warrior - Next.js Edition

A secure, server-side implementation of the Weekend Warrior GitHub analyzer with proper backend API handling.

## 🚀 Features

- **Secure Backend API**: GitHub PAT stored server-side only
- **Real GitHub Data Integration**: GraphQL API for 2025 weekend commits
- **MongoDB Leaderboard**: Real-time rankings and user statistics
- **Retro Gaming Aesthetic**: CRT-style display with pixel art
- **Comprehensive Stats**: Hourly patterns, achievements, heatmaps
- **Next.js 15.1.6**: Latest stable version with App Router
- **React 19**: Latest React with improved performance

## 🔒 Security Improvements

- GitHub Personal Access Token never exposed to frontend
- Server-side API routes handle all external requests
- Environment variables properly secured
- Rate limiting and error handling

## 🛠️ Setup

### Prerequisites

- Node.js 18+ & npm (Node.js 20+ recommended)
- GitHub Personal Access Token
- MongoDB database (Atlas recommended)

### Installation

```bash
# Clone and navigate
cd next-weekend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your credentials to .env.local
```

### Environment Configuration

Create `.env.local` with:

```env
# GitHub Personal Access Token (Server-side only)
GITHUB_TOKEN=your_github_token_here

# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weekend-warrior

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### GitHub Token Setup

1. **Create Personal Access Token:**

   - Go to https://github.com/settings/tokens
   - Generate new token (classic)
   - Select scopes: `repo`, `read:user`
   - Copy token to `GITHUB_TOKEN` in `.env.local`

2. **MongoDB Setup:**
   - Create free MongoDB Atlas cluster
   - Get connection string
   - Add to `MONGODB_URI` in `.env.local`

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
next-weekend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # Backend API routes
│   │   │   ├── github-stats/  # GitHub data fetching
│   │   │   └── leaderboard/   # Leaderboard API
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── providers.tsx      # Context providers
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── CRTOverlay.tsx    # Retro display effect
│   │   ├── TitleScreen.tsx   # Main menu
│   │   ├── StatsScreen.tsx   # Statistics display
│   │   └── ...               # Other components
│   ├── lib/                  # Utility libraries
│   │   ├── github-api.ts     # GitHub GraphQL client
│   │   ├── database.ts       # MongoDB service
│   │   └── utils.ts          # Helper functions
│   ├── types/                # TypeScript definitions
│   └── data/                 # Static data & constants
├── .env.local                # Environment variables
├── next.config.js           # Next.js configuration
└── package.json             # Dependencies
```

## 🔌 API Routes

### POST /api/github-stats

Fetches user's 2025 weekend GitHub statistics.

**Request:**

```json
{
  "username": "github_username"
}
```

**Response:**

```json
{
  "username": "github_username",
  "totalWeekendCommits": 245,
  "saturdayCommits": 120,
  "sundayCommits": 125,
  "globalRank": 42,
  "totalPlayers": 1337,
  "achievements": [...],
  ...
}
```

### GET /api/leaderboard?limit=50

Retrieves top players from leaderboard.

**Response:**

```json
{
  "leaderboard": [
    {
      "username": "top_player",
      "totalWeekendCommits": 500,
      "rank": 1,
      ...
    }
  ],
  "total": 50,
  "limit": 50
}
```

## 🎮 How It Works

1. **User Input**: Enter GitHub username on title screen
2. **Navigation**: Redirects to `/stats/[username]` route
3. **Secure Fetch**: Page calls `/api/github-stats` endpoint
4. **Server Processing**: Backend fetches data using server-side GitHub token
5. **Database Storage**: User stats saved to MongoDB leaderboard
6. **Real Rankings**: Calculate actual rank among all users
7. **Display Results**: Show comprehensive stats with retro styling
8. **Shareable URLs**: Direct links to user stats and leaderboard

## 🔗 Routes

- `/` - Main title screen
- `/stats/[username]` - Individual user statistics
- `/leaderboard` - Global leaderboard
- `/api/github-stats` - Backend API for fetching stats
- `/api/leaderboard` - Backend API for leaderboard data

## 🔧 Key Differences from Vite Version

| Feature      | Vite Version           | Next.js Version        |
| ------------ | ---------------------- | ---------------------- |
| GitHub Token | Client-side (unsafe)   | Server-side (secure)   |
| API Calls    | Direct from browser    | Through API routes     |
| Deployment   | Static hosting         | Full-stack hosting     |
| Security     | Token exposed          | Token protected        |
| Performance  | Client-side processing | Server-side processing |

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Other Platforms

- **Netlify**: Use `npm run build` output
- **Railway**: Connect GitHub repo
- **Heroku**: Add buildpack for Node.js

## 🔍 Environment Variables

| Variable          | Description                   | Required |
| ----------------- | ----------------------------- | -------- |
| `GITHUB_TOKEN`    | GitHub Personal Access Token  | Yes      |
| `MONGODB_URI`     | MongoDB connection string     | Yes      |
| `NEXTAUTH_URL`    | Application URL               | Yes      |
| `NEXTAUTH_SECRET` | Secret for session encryption | Yes      |

## 🛡️ Security Features

- **Server-side token storage**: GitHub PAT never sent to client
- **Input validation**: Username format validation
- **Rate limiting**: Built-in GitHub API rate limiting
- **Error handling**: Graceful fallbacks for API failures
- **CORS protection**: Proper API route configuration

## 🐛 Troubleshooting

### "GitHub token not configured"

- Check `GITHUB_TOKEN` in `.env.local`
- Restart development server
- Verify token has correct scopes

### "MongoDB connection failed"

- Verify `MONGODB_URI` format
- Check network access in MongoDB Atlas
- Ensure database user has correct permissions

### "User not found"

- Verify GitHub username exists
- Check for typos
- Try with a known active user

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas Setup](https://www.mongodb.com/atlas)
- [GitHub API Documentation](https://docs.github.com/en/graphql)
- [Vercel Deployment Guide](https://vercel.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Weekend Warrior Next.js Edition** - Secure, scalable, and production-ready! 🎮
