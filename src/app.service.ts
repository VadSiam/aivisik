import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CreateImageRequestSizeEnum } from 'openai';
import * as fs from 'fs';
import { responseOpenAI } from './api/openai';
import { getStats } from './api/worldometers';
import { getGGLTrends } from './api/ggltrends';
import { getHumanityStats } from './api/visionofhumanity';
import { postAtInstagram } from './api/fb';
import { Cron } from '@nestjs/schedule';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

export interface ITrend {
  index: string;
  title: string;
  titleLink: string;
  subtitle: string;
  subtitleLink: string;
  source: string;
  published: string;
  searches: string;
  thumbnail: string;
}

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  async getOpenAIImage(strPrompt: string) {
    let attempt = 1;
    while (attempt <= 5) {
      const [imgUrl, imgName] = await responseOpenAI({
        strPrompt,
        imgNumber: 1,
        imgSize: CreateImageRequestSizeEnum._512x512,
      });
      console.log('🚀 ~ file: app.service.ts:37 ~ imgUrl:', imgUrl);
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

  async downloadImage(url: string, name = 'image') {
    const filePath = `./downloadedImgs/${name}.png`;
    const writer = fs.createWriteStream(filePath);

    const response = await this.httpService.axiosRef({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(path.resolve(filePath)));
      writer.on('error', reject);
    });
  }

  async getStatInfo() {
    const resp = await getStats('world-population');
    console.log('🚀 ~ file: app.service.ts:46 ~ resp', resp);
  }

  async getGglTrends(): Promise<[ITrend, string]> {
    const { dailyResults, randomCountry } = await getGGLTrends();
    const trendsArray = Object.values(dailyResults?.[0])[0] as [ITrend];
    return [trendsArray?.[0] as ITrend, randomCountry];
  }

  async getHumanityStats() {
    const result = await getHumanityStats();
    console.log('🚀 ~ file: app.service.ts:59 ~ result', result);
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

  async getAIImageAndPostToInsta() {
    function swopWhitespaceToUnderscore(str: string) {
      return str.replace(/\s+/g, '_');
    }
    try {
      const { title, subtitle, country } = await this.getFoodForAI();
      const strPrompt = `${title}. ${subtitle}}`;
      const imgUrl = await this.getOpenAIImage(strPrompt);
      const tags = `#${swopWhitespaceToUnderscore(
        country,
      )}#${swopWhitespaceToUnderscore(title)} ${strPrompt}`;
      await postAtInstagram(imgUrl as string, tags);
    } catch (error) {
      console.log('getOpenAIImage Error: ', error);
    }
  }

  // @Cron('0 * * * * *') // run every 1 minute
  @Cron('0 */8 * * * *') // run every 8 hours
  handleCron() {
    this.getAIImageAndPostToInsta();
  }
}
