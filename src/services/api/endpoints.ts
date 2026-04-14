export const endpoints = {
  serverInfo: (serverId: string) =>
    `/servers/${serverId}?include=player,session,serverEvent`,
  searchServers: (query: string) =>
    `/servers?filter[search]=${encodeURIComponent(query)}&filter[game]=rust&page[size]=10`,
};
