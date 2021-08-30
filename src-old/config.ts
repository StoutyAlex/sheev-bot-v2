export const totalShards: string | number = process.env.CONFIG_TOTALSHARDS?.toLowerCase() ?? "auto";
export const fetchAllUsers = true;
export const prefix = process.env.CONFIG_PREFIX?.replace(/"/g, "") ?? "sheev "; // Temporary workaround for https://github.com/docker/compose/issues/6951
