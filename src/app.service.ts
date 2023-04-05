import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CreateImageRequestSizeEnum } from 'openai';
import * as fs from 'fs';
import { responseOpenAI } from './api/openai';
import { getStats } from './api/worldometers';
import { getHumanityStats } from './api/visionofhumanity';
import { postAtInstagram } from './api/fb';
// import { Cron } from '@nestjs/schedule';
import { fetchTrendingSearches } from './api/ggltrends_second';
import { runMidjourney } from './api/midjourney';

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

export interface IParseTrend {
  title: {
    query: string;
    exploreLink: string;
  };
  formattedTraffic: string;
  image: {
    newsUrl: string;
    source: string;
    imageUrl: string;
  };
  articles: [
    {
      title: string;
      timeAgo: string;
      source: string;
      url: string;
      snippet: string;
    },
  ];
  shareUrl: string;
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
        imgSize: CreateImageRequestSizeEnum._1024x1024,
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
    const { dailyResults, randomCountry } = await fetchTrendingSearches();
    const [trend] = dailyResults;
    return [trend as ITrend, randomCountry];
  }

  async getHumanityStats() {
    // const result = await getHumanityStats();
    // console.log('🚀 ~ file: app.service.ts:59 ~ result', result);
    await runMidjourney('Кибальчиш в гостях у сказки');
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
      const strPrompt = `${title}. ${subtitle}`;
      const imgUrl = await this.getOpenAIImage(strPrompt);
      const tags = `#DALL-E2#${swopWhitespaceToUnderscore(
        country,
      )}#${swopWhitespaceToUnderscore(title)} ${strPrompt}`;
      await postAtInstagram(imgUrl as string, tags);
    } catch (error) {
      console.log('getOpenAIImage Error: ', error);
    }
  }

  /*
    0 0 specifies the seconds and minutes of the cron job to run at.
  0,8,16 specifies the hours of the cron job to run at, separated by commas.
  * * * specifies the days of the month, months, and days of the week, respectively. Using * means that the cron job should run every day of the month, every month of the year, and every day of the week.
  */
  // @Cron('0 0 0,8,16 * * *')
  // // @Cron('0 */8 * * * *') // run every 8 hours
  // handleCron() {
  //   this.getAIImageAndPostToInsta();
  // }
}
