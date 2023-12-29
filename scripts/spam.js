"node ./scripts/spam.js";

const puppeteer = require("puppeteer");
const fs = require("fs");

const jsonData = require("../vacanciesResult.json");

(async () => {
  const values = Object.values(jsonData);
  let arrayLinksForScrap = [];

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp",
  });

  const page = await browser.newPage();

  values.forEach((vacancy) => {
    arrayLinksForScrap.push(vacancy);
  });

 for(let i = 0; i < arrayLinksForScrap.length; i++){
    // console.log(arrayLinksForScrap.length);
    const random = ((Math.floor((Math.random() * 10)) * (Math.random() * 2)) + 1) * 1000;
   
    await page.goto(arrayLinksForScrap[i]);
    console.log(`1. page done ${arrayLinksForScrap[i]}`)
   await page.waitForTimeout(random);

   await page.waitForSelector("div > div > lib-top-bar > div > div > santa-button > button", { visible: true });
   await page.click("div > div > lib-top-bar > div > div > santa-button > button");
   console.log("2, click respond");

   await page.waitForTimeout(random);
   
   await page.waitForSelector("body > app-root > div > alliance-apply-page-shell > div > alliance-apply-page > main > div:nth-child(2) > div > alliance-apply-action-buttons > div > santa-button-spinner > div > santa-button > button", { visible: true });
   await page.click("body > app-root > div > alliance-apply-page-shell > div > alliance-apply-page > main > div:nth-child(2) > div > alliance-apply-action-buttons > div > santa-button-spinner > div > santa-button > button");
   
   console.log("3,  respons data");

   await page.waitForTimeout(random);

   
   arrayLinksForScrap.shift()

   let result = JSON.stringify(arrayLinksForScrap);
   
   fs.writeFile("vacanciesResult.json", result, function (err) {
     if (err) {
       console.log(err)
     }
   })

 }
     console.log("4.finish")
    await browser.close() 
})();
