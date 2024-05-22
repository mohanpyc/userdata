const express = require('express');
const connectDB = require('./Config/db');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const User = require('./Models/user');

const app = express();

connectDB();

app.use(bodyParser.json());

app.use(express.json({ extended: false }));

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    console.error(username,password);
    try {
        let user = await User.findOne({ username });
        if (user) {
            console.error('userAlready exists');
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            password
        });

        await user.save();
        console.error('signup successful');
        res.send('Signup successful');
    } catch (err) {
        console.error(err.message,'in catch');
        res.status(500).send('Server error');
    }
});


app.use(cors());

app.get('/', (req, res) => res.send('API Running'));

app.use('/api/auth', require('./Routes/authRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
