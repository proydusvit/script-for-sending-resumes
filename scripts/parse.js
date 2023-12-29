"node ./scripts/parse.js";

const puppeteer = require("puppeteer");
const fs = require("fs");

const linkWithFiltersValue =
  "https://robota.ua/zapros/junior-frontend-developer/kyiv";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp",
  });

  const page = await browser.newPage();

  await page.goto(linkWithFiltersValue);

  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 300;

      const scrollInterval = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(scrollInterval);
          resolve();
        }
      }, 100);
    });
  });

  const pages = await page.$$("santa-pagination-with-links > div > a");
  pages.shift();

  let vacancies = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        "alliance-jobseeker-desktop-vacancies-list > div > div > alliance-vacancy-card-desktop > a",
      ),
    ).map((a) => a.href),
  );

  for (const page of pages) {
    await page.click();

    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        let totalHeight = 0;
        const distance = 300;

        const scrollInterval = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(scrollInterval);
            resolve();
          }
        }, 100);
      });
    });

    let vacancieNew = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "alliance-jobseeker-desktop-vacancies-list > div > div > alliance-vacancy-card-desktop > a",
        ),
      ).map((a) => a.href),
    );

    vacancies = vacancies.concat(vacancieNew);
  }

  let result = JSON.stringify(vacancies);

  fs.writeFile("vacanciesResult.json", result, function (err) {
    if (err) {
      console.log(err);
    }
  });
  console.log("save");
  await browser.close();
})();
