const { By, Key, until } = require("selenium-webdriver");

const web = "https://es.wikipedia.org/wiki/Wikipedia:Portada";
const wikiSearch = "Universidad San Ignacio de Loyola";

const wikipediaHelpers = {
  existWord: async (driver, titleString, contentString) => {
    // await driver.get(web);
    const searchBox = driver.findElement(By.name("search"));
    await searchBox.sendKeys(wikiSearch, Key.RETURN);
    // let el = driver.findElement(By.className("mw-search-results"));
    await driver.wait(
      until.elementLocated(By.className("mw-search-results")),
      5 * 1000
    );
    const searchList = driver.findElement(By.className("mw-search-results"));
    const linksContainers = await searchList.findElements(
      By.className("mw-search-result")
    );
    //get the first child of the option list
    const firstLink = await linksContainers[0].findElement(
      By.className("mw-search-result-heading")
    );
    //validate if exist and added click function
    await driver
      .wait(until.elementIsVisible(firstLink), 3000)
      .then(() => firstLink.click())
      .catch(() => console.log("There isn't link"));
    //get box
    const box = driver.findElement(By.className("infobox"));
    let ths = [];
    let tds = [];

    //valite if box exist and get ths and tds
    await driver
      .wait(until.elementIsVisible(box), 3000)
      .then(async () => {
        ths = await box.findElements(
          By.xpath("//table/tbody/tr/th[@scope='row']")
        );
        tds = await box.findElements(
          By.xpath("//table/tbody/tr/td[@colspan='2']")
        );
      })
      .catch(() => console.log("there isn't box"));
    try {
      const result = await getResult(ths, tds, titleString, contentString);
      console.log("Result: " + result, "\n");
      return result;
    } catch (error) {
      console.log("There is a error in this app to show the result");
    }
  },
};

async function getResult(ths, tds, titleString, contentString) {
  let arrTitles = [];
  let arrResp = [];
  for (let index = 0; index < ths.length; index++) {
    const th = ths[index];
    const td = tds[index];
    const thText = await th.getText();
    const finalWordTh = formatWord(thText);
    arrTitles.push(finalWordTh);
    const tdText = await td.getText();
    const finalWordTd = formatWord(tdText);
    arrResp.push(finalWordTd);
  }
  //get position of attribute value
  const indexAtrValue = arrTitles.indexOf(formatWord(titleString));
  //get position of expect value
  const indexExpectValue = arrResp.indexOf(formatWord(contentString));
  //compare positions
  if (indexAtrValue === indexExpectValue) {
    return "Success";
  }
  return "Error";
}
function formatWord(word) {
  word = withOutJumpLine(word);
  //   if (options.capital_letter) {
  word = withOutCapitalLetter(word);
  //   }
  //   if (options.accent) {
  word = withOutAccent(word);
  //   }
  return word;
}
function withOutAccent(word) {
  const ObjAccent = {
    á: "a",
    é: "e",
    í: "i",
    ó: "o",
    ú: "u",
  };
  const splitWord = word.split("");
  const correctWord = splitWord
    .map((letter) => {
      if (letter in ObjAccent) {
        return ObjAccent[letter];
      }
      return letter;
    })
    .join("");
  return correctWord;
}
function withOutJumpLine(word) {
  return word.split("\n").join(" ").trim();
}
function withOutCapitalLetter(word) {
  const splitWord = word.split(" ");
  const correctWord = splitWord.map((letter) => letter.toLowerCase()).join(" ");
  return correctWord;
}

module.exports = { withOutCapitalLetter, withOutAccent, withOutJumpLine };

module.exports = wikipediaHelpers;
