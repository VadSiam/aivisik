// blue cat in the beach --testp --v 5 --ar 7:4
import axios from 'axios';
import { IDiscordMessage } from './types';

const applicationID = '936929561302675456';
const commandID = '938956540159881230';

const delayedMJCheckMessage = async (
  attempts = 5,
): Promise<IDiscordMessage | null> => {
  for (let i = 0; i < attempts; i++) {
    const success = await new Promise<IDiscordMessage | null>(
      (resolve) =>
        setTimeout(async () => {
          const result = await getMJLastMessage();
          resolve(result);
        }, 60000), // 60 sec
    );

    if (
      success &&
      !success.content.includes('Waiting to start') &&
      !success.attachments?.[0]?.url.includes('webp')
    ) {
      console.log('🚀 ~ file: midjourney.ts:115 ~ success:', success);
      console.log('Check MJ message function succeeded');
      return success;
      break;
    } else {
      console.log('Fail to check MJ message function, retrying...');
    }
  }
  return null;
};

const extractUUID = (filename: string) => {
  const regex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
  const match = filename.match(regex);
  return match ? match[0] : null;
};

const dmChannelId = '1092399713757708378';

const getMJLastMessage = async (): Promise<IDiscordMessage | null> => {
  const messageLimit = 1; // Set the number of messages to retrieve (1 for the last message)

  const getMessagesUrl = `https://discord.com/api/v10/channels/${dmChannelId}/messages?limit=${messageLimit}`;

  const headers = {
    Authorization: process.env.DISCORD_USER_TOKEN,
  };

  try {
    const { data } = await axios.get(getMessagesUrl, { headers });
    const [lastMessage] = data as IDiscordMessage[];
    if (lastMessage?.author?.username === 'Midjourney Bot') {
      return lastMessage;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error retrieving messages:', error.message);
    return null;
  }
};

const generateSingleMJPrompt = async ({
  uuid,
  messageId,
}): Promise<string | null> => {
  const sendInteractionUrl = `https://discord.com/api/v9/interactions`;
  const headers = {
    Authorization: process.env.DISCORD_USER_TOKEN,
    'Content-Type': 'application/json',
  };
  const interaction = {
    type: 3,
    nonce: '1093096782868512768',
    guild_id: null,
    channel_id: '1092399713757708378',
    message_flags: 0,
    message_id: messageId,
    application_id: '936929561302675456',
    session_id: '041284822e71aec2e9791de1cd681107',
    data: {
      component_type: 2,
      custom_id: `MJ::JOB::upsample::1::${uuid}`,
    },
  };

  try {
    await axios.post(sendInteractionUrl, interaction, { headers });
    return 'success';
  } catch (error) {
    console.error('Error sending interaction:', error);
    return null;
  }
};

const generateNewMJPrompt = async (
  promptStr: string,
): Promise<string | null> => {
  const sendInteractionUrl = `https://discord.com/api/v9/interactions`;
  const headers = {
    Authorization: process.env.DISCORD_USER_TOKEN,
    'Content-Type': 'application/json',
  };
  const interaction = {
    type: 2,
    application_id: applicationID,
    channel_id: dmChannelId,
    session_id: 'b9653ac4d031b88c1a1bd6920735dba6',
    data: {
      version: '1118961510123847772',
      id: commandID,
      name: 'imagine',
      type: 1,
      options: [
        {
          type: 3,
          name: 'prompt',
          value: promptStr,
        },
      ],
      application_command: {
        id: commandID,
        application_id: applicationID,
        version: '1118961510123847772',
        default_permission: true,
        default_member_permissions: null,
        type: 1,
        nsfw: false,
        name: 'imagine',
        description: 'Create images with Midjourney',
        dm_permission: true,
        options: [
          {
            type: 3,
            name: 'prompt',
            description: 'The prompt to imagine',
            required: true,
          },
        ],
      },
      attachments: [],
    },
    nonce: '1120230447008186368',
  };

  try {
    const resp = await axios.post(sendInteractionUrl, interaction, {
      headers,
    });
    console.log('🚀 ~ file: midjourney.ts:274 ~ resp:', resp);
    return 'success';
  } catch (error) {
    console.error('Error sending interaction:', error);
    return null;
  }
};

const createMJImg = async (promptStr: string): Promise<string | null> => {
  const promptResp = await generateNewMJPrompt(promptStr);
  console.log('🚀 ~ file: midjourney.ts:137 ~ promptResp:', promptResp);
  if (!promptResp) {
    return null;
  }
  const { attachments, id: messageId } = await delayedMJCheckMessage();
  console.log('🚀 ~ file: midjourney.ts:141 ~ attachments:', attachments);
  const [{ filename }] = attachments;
  console.log('🚀 ~ file: midjourney.ts:142 ~ filename:', filename);
  const uuid = extractUUID(filename);
  console.log('🚀 ~ file: midjourney.ts:142 ~ uuid:', uuid);
  if (!uuid) {
    return null;
  }

  const upscaledRest = await generateSingleMJPrompt({
    uuid,
    messageId,
  });
  if (!upscaledRest) {
    return null;
  }
  const { attachments: singleAttachments } = await delayedMJCheckMessage();
  const [{ url }] = singleAttachments;
  console.log('🚀 ~ file: midjourney.ts:154 ~ singleAttachments:', url);
  return url;
};

const runMidjourney = async (promptStr) => {
  try {
    const imgUrl = await createMJImg(promptStr);
    return imgUrl;
  } catch (error) {
    console.error('createMJImg error:', error);
    return '';
  }
};

export { runMidjourney };
