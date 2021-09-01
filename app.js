const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');

const app = express();
dotenv.config();


// routes
const userRoute = require('./routes/userRoute');
const indexRoute = require('./routes/indexRoute');
const vehicleRoute = require('./routes/vehicleRoute')

// DB connection
mongoose.connect(process.env.DB_CONNECT,
     {useNewUrlParser: true},
     () => console.log('Connected to DB'));

// middlewares
app.use(express.json());
app.use(cors());
app.use(logger('dev'));

app.use('/api/user', userRoute);
app.use('/', indexRoute);
app.use('/api/vehicle', vehicleRoute)

app.listen(3000, () => console.log('Server up and running'));
