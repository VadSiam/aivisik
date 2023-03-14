import axios from 'axios';
import { load } from 'cheerio';

const rawUrl = 'https://www.worldometers.info/';
const charsToRemove = /[,+]/g;

const getStats = async (dir = 'coronavirus') =>
  axios.get(`${rawUrl}${dir}`).then((response) => {
    const data = []; // Initialize an empty array to save the information to be retrieved.

    const $ = load(response.data); // Load the webpage.
    const table = $('#main_table_countries_today'); // Look for the table.
    const tbodies = table.find('tbody'); // Look for tbody tags inside the table tag.

    console.log('🚀 ~ file: worldometers.ts:15 ~ table', table);
    // The table has several tbody tags. The first one contains the information for every country/territory.
    const tbody_countries = tbodies[0]; // Countries tbody.
    console.log(
      '🚀 ~ file: worldometers.ts:17 ~ tbody_countries',
      tbody_countries,
    );

    // Get every row of the table.
    const table_rows_countries = $(tbody_countries).find('tr').toArray();

    // Get the data for each country.
    table_rows_countries.forEach((row) => {
      // Get every column of the row.
      const columns = $(row).find('td');

      const country = $(columns[1]).text().trim().toUpperCase();
      const totalCases =
        parseInt($(columns[2]).text().replace(charsToRemove, '')) || 0;
      const newCases =
        parseInt($(columns[3]).text().replace(charsToRemove, '')) || 0;
      const totalDeaths =
        parseInt($(columns[4]).text().replace(charsToRemove, '')) || 0;
      const newDeaths =
        parseInt($(columns[5]).text().replace(charsToRemove, '')) || 0;

      // Add the data to the array.
      data.push({ country, totalCases, newCases, totalDeaths, newDeaths });
    });

    // Return the array.
    return data;
  });

export { getStats };

// /**
//  * Gets a the data of a specific country by searching it in the array returned from getStats().
//  * Returns a promise, which returns the desired information as an object.
//  */
// exports.getCountry = (country) => {
//   return this.getStats().then((stats) => {
//     return stats.find((entry) => entry.country == country.toUpperCase());
//   });
// };
