import { LolApi } from 'twisted'
import { Regions } from 'twisted/dist/constants';
import { MatchDto, MatchListingMatches, MatchPositionDto, SummonerV4DTO } from 'twisted/dist/models-dto';

import * as championData from '../static-data/champion.json';

export interface MatchSummary {
    win: boolean;
    champion: Champion;
    k: number;
    d: number;
    a: number;
    role: string;
    lane: string;
    cs: number;
    time: number;
    duration: number;
}

export interface Champion {
    id: string;
    key: number;
    name: string;
}

export const champions = Object.entries(championData.data).map(([_, data]): Champion => ({
    id: data.id,
    key: Number(data.key),
    name: data.name
}));


const api = new LolApi({ key: 'RGAPI-2db8e25c-64ea-464a-b510-3d1b63c5077e' });

const getSummoner = async (username: string, region: Regions) => {
    const { response } = await api.Summoner.getByName(username, region);
    return response;
};

const getSummonerIcon = (id: number): string =>
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${id}.jpg`;

const getChampionIcon = (id: number): string =>
    `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${id}.png`;

const getMatchList = async (accountId: string, region: Regions): Promise<MatchListingMatches[]> => {
    const { response } = await api.Match.list(accountId, region);
    return response.matches;
};

const getMatch = async (match: MatchListingMatches, region: Regions): Promise<MatchDto> => {
    const { response } = await api.Match.get(match.gameId, region);
    return response;
};

const getMatches = async (accountId: string, region: Regions): Promise<MatchDto[]> => {
    const matchList = await getMatchList(accountId, region);

    const lastFive = matchList.slice(0, 5);

    const matches = await Promise.all(lastFive.map((match) => getMatch(match, region)));
    return matches;
};

const getLane = (lane: string): string => {
    const laneString = lane.toLowerCase()

    if (laneString === 'none') return 'ARAM';
    if (laneString === 'middle') return 'BOT';
    if (laneString === 'top') return 'TOP';

    return lane;
};

const generateMatchSummary = (accountId: string, matches: MatchDto[]): MatchSummary[] => {
    return matches.map(match => {
        const participantId = match.participantIdentities.find(participant => participant.player.accountId === accountId);
        const participant = match.participants.find(p => p.participantId === participantId?.participantId)!;

        const team = participant?.teamId;
        const win = match.teams.find(t => t.teamId === team)!.win;

        return {
            win,
            champion: champions.find(champ => champ.key === participant.championId)!,
            k: participant.stats.kills,
            d: participant.stats.deaths,
            a: participant.stats.assists,
            role: participant.timeline.role,
            lane: participant.timeline.lane,
            cs: participant.stats.totalMinionsKilled,
            time: match.gameCreation,
            duration: match.gameDuration,
        }
    })
};

const getForm = async (accountId: string, region: Regions): Promise<MatchSummary[]> => {
    const matches = await getMatches(accountId, region);
    const matchSummary = generateMatchSummary(accountId, matches);

    return matchSummary;
};

export { getSummoner, getSummonerIcon, getMatchList, getChampionIcon, getForm, getLane };
