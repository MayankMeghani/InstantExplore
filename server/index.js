// const express = require('express');
import express from 'express';
import { configDotenv } from 'dotenv';
configDotenv();
import ngrok from '@ngrok/ngrok';

import  router  from './router/routes.js';
import connectDB from './utills/dbConnection.js';
import cityRoute from './router/city.routes.js';   
import attractionRoute from './router/attraction.routes.js';
import stateRoute from './router/State.routes.js';
import countryRoute from './router/country.routes.js';
import userRoute from './router/user.routes.js';
import reviewRoute from './router/review.routes.js';
import requestRoute from './router/request.routes.js';
import cors from 'cors';
import User from './models/User.js'
const app = express();

const port = process.env.PORT || 5005;
connectDB();

app.use(cors());

app.use(express.json());

// app.use("/", router);
app.use("/cities", cityRoute);
app.use("/attractions", attractionRoute);
app.use("/states", stateRoute);
app.use("/countries", countryRoute);
app.use("/users", userRoute);
app.use("/reviews",reviewRoute);
app.use("/requests",requestRoute);
app.get('/verify-email', async (req, res) => {
    const userId = req.query.id;  
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(400).send('Invalid verification link.');
      }
  
      user.isVerified = true;
      await user.save();
  
      res.status(200).send('Email successfully verified!');
    } catch (error) {
      res.status(500).send('Server error.');
    }
  });

app.listen(port, () => 
    console.log(`Server running on port ${port}`));


    let URL = "";  
    ngrok.connect({
        addr: 5000,              
        authtoken: process.env.NGROK_TOKEN,  
      }).then(listener =>
           URL = listener.url())
           .then(() => console.log(`Ingress established at: ${URL}`))
        .catch(err => console.error('Error connecting ngrok:', err));      
    
export const getURL = () =>{
    return URL;  
} 

let urls = getURL();