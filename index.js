
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookie = require('cookie-parser');
const config = require('./env/config');

const auth = require('./src/routes/auth.route');

app.use('/auth', auth);

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookie());
app.use(express.json());

// Connect to mongo 

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Database: MongoDB is now connected");
    }
    catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}
connectDB();

app.listen(process.env.PORT || 8080, () => {
    console.log('running on port now');
});
