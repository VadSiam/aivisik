export interface IAttachment {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxy_url: string;
  width: number;
  height: number;
  content_type: string;
}

export interface IDiscordMessage {
  id: string;
  type: number;
  content: string;
  channel_id: string;
  author: {
    id: string;
    username: string;
    global_name: null;
    display_name: null;
    avatar: string;
    avatar_decoration: null;
    discriminator: string;
    public_flags: number;
    bot: boolean;
  };
  attachments: IAttachment[];
  embeds: Array<any>;
  mentions: Array<object>;
  mention_roles: Array<any>;
  pinned: boolean;
  mention_everyone: boolean;
  tts: boolean;
  timestamp: string;
  edited_timestamp: null;
  flags: number;
  components: Array<object>;
}
