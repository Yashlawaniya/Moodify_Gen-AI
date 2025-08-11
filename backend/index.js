require('dotenv').config();

const express= require('express')
const cors = require('cors')
const sentiment = require('./routes/sentiment.routes')
const app= express()
app.use(express.json())

// Testing ke liye sab origin allow karo
app.use(cors({
    origin: '*', // har jagah se allow
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use('/api/sentiment',sentiment)


app.use(cors({origin: process.env.FRONTEND_URL || '*'}))

app.get('/', (req, res) => {
    res.send('Backend is running ✅');
});


const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})