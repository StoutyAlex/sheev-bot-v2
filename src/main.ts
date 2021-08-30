import mongoose, { ConnectOptions } from 'mongoose';
import { SheevBot } from './base/sheev-bot';

import { databaseUri, environment } from './config';

console.log('Running on environment', environment);

const client = new SheevBot();

client.start(process.env.BOT_TOKEN!).then(() => console.log('Logged in'));

const options: ConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

mongoose.connect(databaseUri, options)
    .then(() => {
        console.log('Connected to MongoDB Database');
    })
    .catch(error => {
        console.error(error);
    });