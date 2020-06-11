
const express = require('express');
const mongoose = require('mongoose');
const cookie = require('cookie-parser');
const cors = require('cors');

const config = require('./env/config');
const auth = require('./src/routes/auth.route');

const app = express();



app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookie());
app.use(express.json());


// ROUTES

app.use('/auth', auth);



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
