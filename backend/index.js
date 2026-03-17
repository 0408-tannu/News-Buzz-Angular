
// const express = require('express');
// const serverless = require('serverless-http');
import express from 'express';
// import serverless from 'serverless-http';
const app = express();


import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import {checkAuth} from './middleware/checkAuth.js';
import {router as userroute } from './routes/ruser.js';
import {router as algorithmsroute} from './routes/ralgorithms.js';
import {router as searchroute} from './routes/rsearch.js';
import {router as userdoroute} from './routes/ruserdo.js';
import {router as feedroute} from './routes/rfeed.js';
import {router as quicksearchroute} from './routes/rquicksearch.js';
import {router as sendemailroute} from './routes/rsendemail.js';
import {router as changepasswordroute }from './routes/rchangepassword.js';
import {router as providerroute} from './routes/rprovider.js';
import { router as history_router } from './routes/rhistory.js';
import { router as mute_router } from './routes/rmute.js';
import { loadProviderCache, refreshAllProviderLogos } from './utils/providerCache.js';


import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();

// Create __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 9000;

app.use(express.static(path.join(__dirname, './frontend/build')));
// Serve static files from the React app

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("connected to mongodb");
  // Load provider cache into memory on startup
  loadProviderCache();
}).catch((err) => {
  console.log(`${err} \n error connecting mongoDB `);
});


app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "authorization"],
}));


app.get("/api/checkauth", checkAuth);
app.use("/api/user", userroute);
app.use("/api/algorithms", algorithmsroute);
app.use("/api/search", checkAuth, searchroute);
app.use("/api/userdo", checkAuth, userdoroute);
app.use("/api/myfeed", checkAuth, feedroute);
app.use("/api/quicksearch", checkAuth, quicksearchroute);
app.use("/api/sendemail", sendemailroute);
app.use("/api/changepassword", checkAuth, changepasswordroute);
app.use("/api/provider", checkAuth, providerroute);
app.use("/api/mute", checkAuth, mute_router);
app.use("/api/history", checkAuth, history_router);


app.get('/',(req,res)=> {res.json({message:"Hello Backend 2ND time"})});
app.get('/api/get',(req,res)=> {res.json({message:"Hello Backend 2ND time"})});
app.get('/api',(req,res)=> {res.json({message:"Hello Backend 2ND time"})});
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from Serverless!' }); // Proper JSON response
});

// One-time endpoint to refresh all existing provider logos to Google Favicon 128px
app.get('/api/refresh-provider-logos', async (req, res) => {
  try {
    const count = await refreshAllProviderLogos();
    res.json({ success: true, message: `Updated ${count} provider logos to Google Favicon 128px` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



// Global error handler to prevent unhandled errors from crashing the server
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
});
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
});

app.listen(process.env.PORT || port, () => {
	console.log(`Listening on port ${port}`);
});
