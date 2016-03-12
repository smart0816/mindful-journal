# Mindful Journal

A personal journaling platform designed for mindfulness and self-reflection. Built with Node.js and Express, featuring user authentication, mood tracking, and analytics to help users develop a consistent journaling practice.

## Features

### Core Functionality
- 📝 **Personal Journaling**: Create, edit, and organize journal entries
- 🔐 **User Authentication**: Secure registration and login system
- 😊 **Mood Tracking**: Track emotional states with each entry
- 🏷️ **Tagging System**: Organize entries with custom tags
- 📊 **Analytics Dashboard**: Insights into writing habits and mood patterns

### Advanced Features
- 🔥 **Writing Streaks**: Track consecutive days of journaling
- 📈 **Mood Analytics**: Visualize emotional patterns over time
- 🔍 **Search & Filter**: Find entries by date, mood, or tags
- 💾 **Auto-save**: Never lose your thoughts with automatic saving
- 📱 **Responsive Design**: Write anywhere, on any device

## Technologies Used

### Backend
- **Node.js**: Server runtime environment
- **Express.js**: Web application framework
- **bcrypt**: Password hashing for security
- **express-session**: Session management
- **moment.js**: Date and time manipulation

### Frontend
- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with responsive design
- **Vanilla JavaScript**: Client-side functionality
- **Local Storage**: Offline draft saving

## Getting Started

### Prerequisites
- Node.js (v4.0.0 or higher)
- npm (Node Package Manager)
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mindful-journal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Development Mode

For development with auto-restart:
```bash
npm run dev
```

## Usage

### Getting Started
1. **Register**: Create a new account with username, email, and password
2. **Login**: Access your personal journal space
3. **Write**: Create your first journal entry
4. **Track**: Monitor your mood and writing habits
5. **Reflect**: Use analytics to understand your patterns

### Features Guide
- **Create Entry**: Click "New Entry" to start writing
- **Set Mood**: Choose your current emotional state
- **Add Tags**: Organize entries with relevant tags
- **View Analytics**: Check your writing statistics and mood trends
- **Search**: Find specific entries using the search function

## API Endpoints

### Authentication
- `POST /api/register` - Create new user account
- `POST /api/login` - User login
- `POST /api/logout` - User logout

### Journal Management
- `GET /api/journals` - Get user's journal entries
- `POST /api/journals` - Create new journal entry
- `GET /api/journals/:id` - Get specific journal entry
- `PUT /api/journals/:id` - Update journal entry
- `DELETE /api/journals/:id` - Delete journal entry

### Analytics
- `GET /api/analytics` - Get user's journaling analytics

## Data Structure

### User Object
```javascript
{
  id: Number,
  username: String,
  email: String,
  password: String (hashed),
  createdAt: String (ISO date)
}
```

### Journal Entry Object
```javascript
{
  id: Number,
  userId: Number,
  title: String,
  content: String,
  mood: String,
  tags: Array,
  createdAt: String (ISO date),
  updatedAt: String (ISO date)
}
```

## Security Features

- **Password Hashing**: bcrypt for secure password storage
- **Session Management**: Secure session handling
- **Authentication Middleware**: Protected routes
- **Input Validation**: Server-side validation for all inputs

## Customization

### Adding New Moods
Update the mood options in both frontend and backend:
1. Add new mood to the mood selector in HTML
2. Update mood validation in the API
3. Add corresponding styling for the new mood

### Extending Analytics
Add new analytics features by:
1. Creating new calculation functions
2. Adding endpoints to `/api/analytics`
3. Updating the frontend dashboard

## Browser Support

- Chrome 50+
- Firefox 45+
- Safari 10+
- Edge 12+
- Mobile browsers

## Deployment

### Environment Variables
```bash
PORT=3000                    # Server port
SESSION_SECRET=your-secret   # Session encryption key
```

### Production Considerations
- Use a proper database (MongoDB, PostgreSQL)
- Implement proper logging
- Add rate limiting
- Use HTTPS in production
- Set up proper session store

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this code for your own projects!

---

*Built with ❤️ for mindful reflection and personal growth*
