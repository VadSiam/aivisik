import { Injectable } from '@nestjs/common';
import { CreateImageRequestSizeEnum } from 'openai';
import { postAtInstagram } from 'src/api/fb';
import { fetchTrendingSearches } from 'src/api/ggltrends_second';
import { runMidjourney } from 'src/api/midjourney';
import { responseOpenAI } from 'src/api/openai';
import { ITrend } from 'src/app.service';

@Injectable()
export class CronService {
  async lambdaFunction(): Promise<string> {
    // Your Lambda function logic here
    try {
      await this.getAIImageAndPostToInsta();
      return 'Success';
    } catch (error) {
      console.log('lambdaFunction -> getAIImageAndPostToInsta, error:', error);
    }
  }

  async getAIImageAndPostToInsta() {
    function swopWhitespaceToUnderscore(str: string) {
      return str.replace(/\s+/g, '_');
    }
    try {
      const { title, subtitle, country } = await this.getFoodForAI();
      const strPrompt = `${title}. ${subtitle}`;
      const imgUrl = await this.getOpenAIImage(strPrompt);
      const tags = `#DALL-E2#${swopWhitespaceToUnderscore(
        country,
      )}#${swopWhitespaceToUnderscore(title)} ${strPrompt}`;
      await postAtInstagram(imgUrl as string, tags);

      const imgUrlMJ = await this.getMidjourneyImage(strPrompt);
      const tagsMJ = `#Midjourney#${swopWhitespaceToUnderscore(
        country,
      )}#${swopWhitespaceToUnderscore(title)} ${strPrompt}`;
      await postAtInstagram(imgUrlMJ as string, tagsMJ);
    } catch (error) {
      console.log('getOpenAIImage Error: ', error);
    }
  }

  async getFoodForAI() {
    const [trend, country] = await this.getGglTrends();
    const { title, subtitle, thumbnail } = trend;
    return {
      title,
      subtitle,
      thumbnail,
      country,
    };
  }

  async getGglTrends(): Promise<[ITrend, string]> {
    const { dailyResults, randomCountry } = await fetchTrendingSearches();
    const [trend] = dailyResults;
    return [trend as ITrend, randomCountry];
  }

  async getMidjourneyImage(strPrompt: string) {
    const imgUrl = await runMidjourney(strPrompt);
    return imgUrl;
  }

  async getOpenAIImage(strPrompt: string) {
    let attempt = 1;
    while (attempt <= 5) {
      const [imgUrl] = await responseOpenAI({
        strPrompt,
        imgNumber: 1,
        imgSize: CreateImageRequestSizeEnum._1024x1024,
      });
      console.log('>>>>>>>> imgUrl:', imgUrl);
      if (!imgUrl) {
        console.log(`Attempt ${attempt} failed.`);
        if (attempt === 5) {
          throw new Error("Couldn't get image from responseOpenAI()");
        }
        attempt++;
      } else {
        attempt = 6;
        return imgUrl;
      }
    }
  }
}
