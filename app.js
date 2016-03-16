const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const moment = require('moment');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage (in production, use a database)
let users = [];
let journals = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'mindful-journal-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication required' });
    }
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Authentication routes
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = users.find(u => u.email === email || u.username === username);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = {
            id: Date.now(),
            username,
            email,
            password: hashedPassword,
            createdAt: moment().toISOString()
        };

        users.push(user);
        req.session.userId = user.id;

        res.json({ message: 'Registration successful', user: { id: user.id, username, email } });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        req.session.userId = user.id;
        res.json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logout successful' });
});

// Journal routes
app.get('/api/journals', requireAuth, (req, res) => {
    const userJournals = journals
        .filter(j => j.userId === req.session.userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(userJournals);
});

app.post('/api/journals', requireAuth, (req, res) => {
    const { title, content, mood, tags } = req.body;

    const journal = {
        id: Date.now(),
        userId: req.session.userId,
        title: title || `Journal Entry - ${moment().format('MMMM Do, YYYY')}`,
        content,
        mood: mood || 'neutral',
        tags: tags || [],
        createdAt: moment().toISOString(),
        updatedAt: moment().toISOString()
    };

    journals.push(journal);
    res.json(journal);
});

app.get('/api/journals/:id', requireAuth, (req, res) => {
    const journal = journals.find(j => j.id === parseInt(req.params.id) && j.userId === req.session.userId);
    
    if (!journal) {
        return res.status(404).json({ error: 'Journal not found' });
    }

    res.json(journal);
});

app.put('/api/journals/:id', requireAuth, (req, res) => {
    const journalIndex = journals.findIndex(j => j.id === parseInt(req.params.id) && j.userId === req.session.userId);
    
    if (journalIndex === -1) {
        return res.status(404).json({ error: 'Journal not found' });
    }

    const { title, content, mood, tags } = req.body;
    
    journals[journalIndex] = {
        ...journals[journalIndex],
        title: title || journals[journalIndex].title,
        content: content || journals[journalIndex].content,
        mood: mood || journals[journalIndex].mood,
        tags: tags || journals[journalIndex].tags,
        updatedAt: moment().toISOString()
    };

    res.json(journals[journalIndex]);
});

app.delete('/api/journals/:id', requireAuth, (req, res) => {
    const journalIndex = journals.findIndex(j => j.id === parseInt(req.params.id) && j.userId === req.session.userId);
    
    if (journalIndex === -1) {
        return res.status(404).json({ error: 'Journal not found' });
    }

    journals.splice(journalIndex, 1);
    res.json({ message: 'Journal deleted successfully' });
});

// Analytics routes
app.get('/api/analytics', requireAuth, (req, res) => {
    const userJournals = journals.filter(j => j.userId === req.session.userId);
    
    const analytics = {
        totalEntries: userJournals.length,
        entriesThisMonth: userJournals.filter(j => moment(j.createdAt).isSame(moment(), 'month')).length,
        moodDistribution: {},
        writingStreak: calculateWritingStreak(userJournals),
        averageWordsPerEntry: calculateAverageWords(userJournals)
    };

    // Calculate mood distribution
    userJournals.forEach(j => {
        analytics.moodDistribution[j.mood] = (analytics.moodDistribution[j.mood] || 0) + 1;
    });

    res.json(analytics);
});

// Helper functions
function calculateWritingStreak(journals) {
    if (journals.length === 0) return 0;
    
    const sortedDates = journals
        .map(j => moment(j.createdAt).format('YYYY-MM-DD'))
        .filter((date, index, arr) => arr.indexOf(date) === index)
        .sort((a, b) => moment(b).diff(moment(a)));

    let streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
        const current = moment(sortedDates[i]);
        const previous = moment(sortedDates[i - 1]);
        
        if (previous.diff(current, 'days') === 1) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
}

function calculateAverageWords(journals) {
    if (journals.length === 0) return 0;
    
    const totalWords = journals.reduce((sum, j) => {
        return sum + (j.content ? j.content.split(' ').length : 0);
    }, 0);
    
    return Math.round(totalWords / journals.length);
}

// Start server
app.listen(PORT, () => {
    console.log(`Mindful Journal server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to start journaling`);
});
// Session timeout handling
// Password strength validation
// Email notification system
