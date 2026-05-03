/**
 * Cypress Bootstrap Cucumber
 *
 * This is the main entry point for the package.
 * It exports utilities and functions that might be useful for users of the package.
 */

// Export any utilities or functions that might be useful for users
module.exports = {
  // Example utility function
  getRandomString: (length = 10) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  },

  // Example utility function
  getRandomNumber: (min = 1, max = 1000) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Example utility function
  getRandomEmail: () => {
    return `test.${Date.now()}@example.com`;
  },

  // Example utility function
  getRandomDate: (start = new Date(2000, 0, 1), end = new Date()) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  },

  // Example utility function
  formatDate: (date, format = 'yyyy-MM-dd') => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return format.replace('yyyy', year).replace('MM', month).replace('dd', day);
  },
};
