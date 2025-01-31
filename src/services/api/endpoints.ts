import { SERVER_ID } from './constants';

export const endpoints = {
  serverInfo: () => 
    `/servers/${SERVER_ID}?include=player,session,serverEvent`
};