import nodeHtmlToImage from 'node-html-to-image';
import { getSummonerIcon, MatchSummary } from '../league';
import { coreHtml } from './html/league-embed';

const createHtmlEmbed = async (html: string) => {
    const image = await nodeHtmlToImage({
        html,
        quality: 100,
        type: 'jpeg',
        puppeteerArgs: {
          args: ['--no-sandbox'],
        },
      })

     return image as Buffer;
};

const matchHtml = (summonerName: string, summonerImage: number) => `
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
        flex-direction: row;
        border-top: 3px solid rgb(16, 180, 209);
        background: rgb(31, 31, 31);
        align-items: center;
      }

      img {
        width: 50px;
        height: 50px;
        margin-right: 20px;
        border-radius: 50%;
        border: 1px solid #fff;
        padding: 5px;
      }
    </style>
  </head>
  <body>
    <div class="app">
      <img src="${getSummonerIcon(summonerImage)}" />

      <h4>Welcome ${summonerName}</h4>
    </div>
  </body>
</html>
`;


const createMatchEmbed = async (summonerName: string, summonerImage: number, matches: MatchSummary[]) => {
    // const image = createHtmlEmbed(matchHtml(summonerName, summonerImage));
    const image = createHtmlEmbed(coreHtml({
        username: summonerName,
        iconId: summonerImage,
        matches
    }));

    return image;
};

export { createMatchEmbed };
