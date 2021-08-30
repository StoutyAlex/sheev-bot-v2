import mongoose from 'mongoose';
import { SheevBot } from './base/sheev-bot';

import { databaseUri, environment } from './config';

console.log('Running on environment', environment);

const client = new SheevBot();

client.start(process.env.BOT_TOKEN!).then(() => console.log('Logged in'));

mongoose.connect(databaseUri)
    .then(() => {
        console.log('Connected to MongoDB Database');
    })
    .catch(error => {
        console.error(error);
    });