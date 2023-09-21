import { Configuration, CreateImageRequestSizeEnum, OpenAIApi } from 'openai';

interface IResponse {
  strPrompt: string;
  imgNumber: number;
  imgSize: CreateImageRequestSizeEnum;
}

interface CheckResult {
  isValid: boolean;
  revisedPrompt?: string;
}

const checkPromptWithChatGPT = async (
  strPrompt: string,
): Promise<CheckResult> => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const resp = await openai.createCompletion({
      model: 'gpt-3.5-turbo',
      prompt: `Given the content policy of DALL·E, is the prompt "${strPrompt}" compliant? Start your answer with "Yes" or "No". If "No", provide a minimally altered version inside #...#, ensuring changes related to public figures, politics, or other sensitive areas maintain the same gender and analogous context.`,
      max_tokens: 500,
    });

    const outputText = resp?.data?.choices?.[0]?.text?.trim();

    if (outputText?.startsWith('Yes,')) {
      return { isValid: true };
    } else {
      const match = outputText?.match(/#(.*?)#/);
      const revisedPrompt = match ? match[1] : '';
      return { isValid: false, revisedPrompt };
    }
  } catch (error) {
    console.error('Error checking prompt with ChatGPT:', error);
    return { isValid: false };
  }
};

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

export { checkPromptWithChatGPT, responseOpenAI };
