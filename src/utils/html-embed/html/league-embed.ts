import { MatchDto } from "twisted/dist/models-dto";
import { getChampionIcon, getSummonerIcon, MatchSummary } from "../../league";

interface LeagueEmebedOptions {
    username: string,
    iconId: number;
    matches: MatchSummary[]
}

const coreHtml = (options: LeagueEmebedOptions) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <style>
      body {
        font-family: "Poppins", Arial, Helvetica, sans-serif;
        background: rgb(22, 22, 22);
        color: #fff;
        max-width: 300px;
      }

      .app {
        max-width: 300px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        border-top: 3px solid rgb(16, 180, 209);
        background: rgb(31, 31, 31);
        align-items: center;
      }

      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
        border-radius: 50%;
        border: 1px solid #fff;
        padding: 5px;
      }

      .match_summary img {
          aspect-ratio: 1/1;
          /* width: 25px; */
          height: 100%;
          padding: 0px;
          border: none;
      }

      h5 {
          margin-top: 0px;
          margin-bottom: 4px;
      }

      h4 {
          margin-top: 0px;
          margin-bottom: 4px;
      }

      p {
          margin-top: 0px;
          margin-bottom: 0px;
          font-size: 12px;
      }

      .header {
          display: flex;
          flex-direction: row;
      }

      .header_text {
          display: flex;
          flex-direction: column;
          justify-content: center;
      }

      .winloss_container {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-top: 10px;
      }

      .winloss_item {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
          height: 30px;
          margin: 6px;
          padding: 5px;
          border-radius: 2px;
          font-weight: bold;
      }

      .win {
          background: green;
      }

      .loss {
          background: #c93535;
      }

      .win_text {
          color: green;
      }

      .loss_text {
          color: #c93535;
      }

      .winloss_item:first-child {
        margin-left: 0;
      }

      .winloss_item:last-child {
        margin-right: 0;
      }

      .summary_container {
          width: 100%;
          display: flex;
          flex-direction: column;
      }

      .match_summary {
          padding: 10px;
          display: flex;
          flex-direction: row;
          background: rgb(19, 19, 19);
          margin-bottom: 10px;
          border-left: #c93535 4px solid;
          border-radius: 4px;
      }

      .match_summary.loss {
        border-left: #c93535 4px solid;
      }

      .match_summary.win {
        border-left: green 4px solid;

      }

      .match_summary:last-child {
          margin-bottom: 0px;
      }

      .match_summary:first-child {
          margin-top: 10px;
      }

      .kda {
          font-size: 10px;
          font-weight: 700;
          margin-bottom: 2px;
      }

      .cs {
          font-size: 10px;
          font-weight: 700;
      }

    </style>
  </head>
  <body>
    <div class="app">
        <div class="header">
            <img src="${getSummonerIcon(options.iconId)}" />
            <div class="header_text">
                <h4>${options.username}</h4>
                <p>Based on your last 5 matches<p>
            </div>
        </div>

        <div class="winloss_container">
            ${options.matches.map(getWinLossSummary).join(' ')}
        </div>

        <div class="summary_container">
            ${options.matches.map(getMatchSummary).join(' ')}
        </div>
    </div>
  </body>
</html>`

const getWinLossSummary = (match: MatchSummary): string => `
    <div class="winloss_item ${match.win ? 'win' : 'loss'}">
        ${match.win ? 'W' : 'L'}
    </div>
`;

const getMatchSummary = (match: MatchSummary): string => `
    <div class="match_summary ${match.win ? 'win' : 'loss'}">
        <img src="${getChampionIcon(match.champion.key)}" />

        <div>
            <h5 class="${match.win ? 'win' : 'loss'}_text">${match.win ? 'Victory' : 'Defeat'}</h5>

            <p class="kda">${match.k} / ${match.d} / ${match.a}</p>
            <p class="cs">${match.cs} CS</p>
        </div>
    </div>
`

export { coreHtml }