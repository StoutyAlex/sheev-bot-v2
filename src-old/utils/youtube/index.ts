import { getInfo } from "ytdl-core";
import ytpl from "ytpl";
import ytsr, { Video as IVideo } from "ytsr";
import { Playlist } from "./Playlist";
import { resolveYTPlaylistID } from "./utils/resolve-tyurl";
import { YouTubeError } from "./utils/youtube-error";
import { Video } from "./Video";

const getVideo = async (url: string): Promise<Video> => {
    try {
        const data = await getInfo(url);
        return new Video(data, "ytdl");
    } catch (error) {
        throw new YouTubeError("Could not get video data", error);
    }
};

const getPlaylist = async (url: string): Promise<Playlist> => {
    try {
        const id = resolveYTPlaylistID(url);
        if (!id) throw new Error(`Could not extract Playlist ID from url, URL is: ${url}`);
        const data = await ytpl(id);
        return new Playlist(data, "normal");
    } catch (error) {
        throw new YouTubeError(`Could not get playlist data`, error);
    }
};

const searchVideos = async (query: string, maxResults = 10): Promise<Video[]> => {
    try {
        const data = await ytsr(query, { limit: maxResults, safeSearch: false });
        return data.items.filter(x => x.type === "video").map(i => new Video(i as IVideo, "normal"));
    } catch (error) {
        throw new YouTubeError(`Could not get search data`, error);
    }
};

export {
    getVideo,
    getPlaylist,
    searchVideos,
};
