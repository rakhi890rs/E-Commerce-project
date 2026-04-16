const express = require('express');
const cartRoutes = require('./routes/cart.routes');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/api/cart', cartRoutes);
app.get("/",(req,res)=>{
    res.status(200).json({message:"Cart Service is up and running"
    })
})

module.exports = app;