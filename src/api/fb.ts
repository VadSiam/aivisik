import axios from 'axios';

const postAtInstagram = async (imgUrl: string, caption: string) => {
  // get long term(~ 60 days) access token
  const { data: accessData } = await axios.get(
    'https://graph.facebook.com/v16.0/oauth/access_token',
    {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        fb_exchange_token: process.env.FB_EXCHANGE_TOKEN,
      },
    },
  );
  const { access_token: hotAccessToken, expires_in } = accessData;

  // pre-upload img to Instagram
  const { data } = await axios.post(
    `https://graph.facebook.com/v16.0/${process.env.INST_BUSINESS_ACCOUNT}/media`,
    {
      image_url: imgUrl,
      caption,
      access_token: hotAccessToken,
    },
  );
  const { id } = data;

  // Upload img to Instagram
  const resp = await axios.post(
    `https://graph.facebook.com/v16.0/${process.env.INST_BUSINESS_ACCOUNT}/media_publish`,
    {
      creation_id: id,
      access_token: hotAccessToken,
    },
  );
  console.log('🚀 ~ file: fb.ts:82 ~ resp:', resp?.data);
};

export { postAtInstagram };
