import { IParseTrend } from 'src/app.service';
import { getRandomCountry } from './ggltrends';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const googleTrends = require('google-trends-api');

async function fetchTrendingSearches() {
  const [randomCountryCode, randomCountry] = getRandomCountry();
  try {
    const results = await googleTrends?.dailyTrends({
      geo: randomCountryCode ?? 'US',
    });
    const data =
      JSON.parse(results).default.trendingSearchesDays[0].trendingSearches;
    const trendingSearches = data.map((item: IParseTrend) => ({
      title: item?.title?.query,
      subtitle: item?.articles?.[0]?.snippet,
      thumbnail: item?.image?.imageUrl,
    }));
    return { dailyResults: trendingSearches, randomCountry };
  } catch (error) {
    console.error('Error fetching trending searches:', error);
  }
}

export { fetchTrendingSearches };
