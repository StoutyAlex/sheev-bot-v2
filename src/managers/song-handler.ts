import { Collection, Snowflake, SnowflakeUtil } from "discord.js";
import { Song } from "../types";

class SongManager extends Collection<Snowflake, Song> {
    constructor(data?: ReadonlyArray<readonly [Snowflake, Song]> | null) {
        super(data);
    }

    public addSong(song: Song): this {
        return this.set(SnowflakeUtil.generate(), song);
    }

    public deleteFirst(): boolean {
        return this.delete(this.firstKey()!);
    }

    public clear(): this {
        this.forEach((v: Song, k: Snowflake) => {
            this.delete(k);
        });
        return this;
    }
};

export { SongManager };
