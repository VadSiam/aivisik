import { Configuration, CreateImageRequestSizeEnum, OpenAIApi } from 'openai';

interface IResponse {
  strPrompt: string;
  imgNumber: number;
  imgSize: CreateImageRequestSizeEnum;
}

const responseOpenAI = async ({
  strPrompt,
  imgNumber = 1,
  imgSize = CreateImageRequestSizeEnum._256x256,
}: IResponse): Promise<[string, string]> => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  try {
    const resp = await openai.createImage({
      prompt: strPrompt,
      n: imgNumber,
      size: imgSize,
    });
    const imgUrl = resp?.data?.data?.[0]?.url ?? '';
    const imgName = `${resp?.data?.created}`;
    return [imgUrl, imgName];
  } catch (error) {
    console.log('openai error', error);
    return ['', ''];
  }
};

export { responseOpenAI };
