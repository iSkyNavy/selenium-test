const wikipediaHelpers = require("../../../../../src/helpers/wikipedia.helpers");
const getBrowserDriver = require("../../../../../src/browsers/browserDriver");

const url = process.env.url;
const findString = process.env.searchText;
const title = "Fundadorxd";
const content = "Raúl Diez Canseco Terry";
const web = "https://es.wikipedia.org/wiki/Wikipedia:Portada";

describe(`Search words on wikipedia`, () => {
  let driver;

  beforeAll(async () => {
    driver = await getBrowserDriver();
    await driver.get(web);
  });

  /* beforeEach(async () => {
    await driver.get(web);
  }); */

  it(`Check if it exists ${findString} on wikipedia`, async () => {
    const isSuccess = await wikipediaHelpers.existWord(driver, title, content);
    expect(isSuccess).toMatch(/^(Success)+/);
  });

  afterAll(async () => {
    await driver.quit();
  });
});
