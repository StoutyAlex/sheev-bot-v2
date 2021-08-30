import 'dotenv/config';

export const databaseUri: string = process.env.DB_URI!.replace(/<password>/, process.env.DB_PASSWORD!);
export const prefix: string = 'sheev';

export const environment: 'test' | 'live' = process.env.NODE_ENV === 'development' ? 'test' : 'live';

export const xp = {
    passivePerMinute: 1,
};
