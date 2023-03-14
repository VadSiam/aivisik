import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin?.());

const baseURL = `https://trends.google.com`;

async function fillTrendsDataFromPage(page) {
  // while (false) {
  //   const isNextPage = await page.$('.feed-load-more-button');
  //   if (!isNextPage) break;
  //   await page.click('.feed-load-more-button');
  //   await page.waitForTimeout(2000);
  // }
  const dataFromPage = await page.evaluate((baseURL) => {
    const resp = Array.from(
      document.querySelectorAll('._md-select-menu-container'),
    );
    console.log('🚀 ~ file: ggltrends.ts:17 ~ resp:', resp);
    return Array.from(document.querySelectorAll('.feed-list-wrapper')).map(
      (el) => ({
        [el.querySelector('.content-header-title').textContent.trim()]:
          Array.from(el.querySelectorAll('feed-item')).map((el) => ({
            index: el.querySelector('.index')?.textContent.trim(),
            title: el.querySelector('.title a')?.textContent.trim(),
            titleLink: `${baseURL}${el
              .querySelector('.title a')
              ?.getAttribute('href')}`,
            subtitle: el.querySelector('.summary-text a')?.textContent.trim(),
            subtitleLink: el
              .querySelector('.summary-text a')
              ?.getAttribute('href'),
            source: el
              .querySelector('.source-and-time span:first-child')
              ?.textContent.trim(),
            published: el
              .querySelector('.source-and-time span:last-child')
              ?.textContent.trim(),
            searches: el
              .querySelector('.search-count-title')
              ?.textContent.trim(),
            thumbnail: el.getAttribute('image-url'),
          })),
      }),
    );
  }, baseURL);
  return dataFromPage;
}

async function getGGLTrends() {
  const [randomCountryCode, randomCountry] = getRandomCountry();
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    const URL = `${baseURL}/trends/trendingsearches/daily?geo=${
      randomCountryCode ?? 'US'
    }&hl=en`;

    page.setDefaultNavigationTimeout(6000);
    await page.goto(URL);
    // page.setDefaultTimeout(6000);

    await page.waitForSelector('.feed-item');

    const dailyResults = await fillTrendsDataFromPage(page);

    await browser.close();

    return { dailyResults, randomCountry };
  } catch (error) {
    console.error('google trends error: ', error);
  }
}

export { getGGLTrends };

const getRandomCountry = (): [string, string] => {
  const countriesLength = countriesList.length;
  const rndmCountryNumber = Math.floor(Math.random() * countriesLength) + 1;
  const rndmCountry = countriesList[rndmCountryNumber - 1];
  const keys = Object.keys(rndmCountry);
  const key = keys[0];
  const value = rndmCountry[key];
  return [key, value];
};

const countriesList = [
  { AR: 'Argentina' },
  { AU: 'Australia' },
  { AT: 'Austria' },
  { BE: 'Belgium' },
  { BR: 'Brazil' },
  { CA: 'Canada' },
  { CL: 'Chile' },
  { CO: 'Colombia' },
  { CZ: 'Czechia' },
  { DK: 'Denmark' },
  { EG: 'Egypt' },
  { FI: 'Finland' },
  { FR: 'France' },
  { DE: 'Germany' },
  { GR: 'Greece' },
  { HK: 'Hong Kong' },
  { HU: 'Hungary' },
  { IN: 'India' },
  { ID: 'Indonesia' },
  { IE: 'Ireland' },
  { IL: 'Israel' },
  { IT: 'Italy' },
  { JP: 'Japan' },
  { KE: 'Kenya' },
  { MY: 'Malaysia' },
  { MX: 'Mexico' },
  { NL: 'Netherlands' },
  { NZ: 'New Zealand' },
  { NG: 'Nigeria' },
  { NO: 'Norway' },
  { PE: 'Peru' },
  { PH: 'Philippines' },
  { PL: 'Poland' },
  { PT: 'Portugal' },
  { RO: 'Romania' },
  { RU: 'Russia' },
  { SA: 'Saudi Arabia' },
  { SG: 'Singapore' },
  { ZA: 'South Africa' },
  { KR: 'South Korea' },
  { ES: 'Spain' },
  { SE: 'Sweden' },
  { CH: 'Switzerland' },
  { TW: 'Taiwan' },
  { TH: 'Thailand' },
  { TR: 'Türkiye' },
  { UA: 'Ukraine' },
  { GB: 'United Kingdom' },
  { US: 'United States' },
  { VN: 'Vietnam' },
];
