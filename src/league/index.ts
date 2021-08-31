import { LolApi } from 'twisted'
import { Regions } from 'twisted/dist/constants';

const api = new LolApi({ key: 'RGAPI-2db8e25c-64ea-464a-b510-3d1b63c5077e' });

const run = async () => {
    const { response: { accountId } } = await api.Summoner.getByName('StoutyAlex', Regions.EU_WEST);
    const { response: matcheList } = await api.Match.list(accountId, Regions.EU_WEST);

    const [ lastPlayed ] = matcheList.matches;

    const { response: match } = await api.Match.get(lastPlayed.gameId, Regions.EU_WEST);

    console.log('match', match.participants[0]);
};

run();
