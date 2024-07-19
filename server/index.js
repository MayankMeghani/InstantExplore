// const express = require('express');
import express from 'express';
import { configDotenv } from 'dotenv';
configDotenv();
import  router  from './router/routes.js';
import connectDB from './config/dbConnection.js';
import cityRoute from './router/city.routes.js';   
import attractionRoute from './router/attraction.routes.js';
import stateRoute from './router/State.routes.js';
import countryRoute from './router/country.routes.js';
const app = express();

const port = process.env.PORT || 5005;
connectDB();

app.use(express.json());

// app.use("/", router);
app.use("/cities", cityRoute);
app.use("/attractions", attractionRoute);
app.use("/states", stateRoute);
app.use("/countries", countryRoute);

app.listen(port, () => 
    console.log(`Server running on port ${port}`));