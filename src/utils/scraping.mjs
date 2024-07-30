import axios from "axios";
import { parse } from "node-html-parser";

export const fetchScraping = (myFitnessPal) => {
  console.log(`Fetching diary for ${myFitnessPal}`);
  return new Promise((resolve, reject) => {
    axios
      .get("https://app.scrapingbee.com/api/v1/", {
        params: {
          api_key: process.env.SCRAPING_KEY,
          url: `https://www.myfitnesspal.com/food/diary/${myFitnessPal}`,
          wait: "5000",
          block_ads: "true",
          premium_proxy: "true",
          stealth_proxy: "true",
          country_code: "us",
        },
      })
      .then(function (response) {
        console.log(response.data);
        resolve(response.data);
      })
      .catch((err) => {
        console.log(
          `There was an error with the request for ${JSON.stringify({
            myFitnessPal,
          })}`
        );
        reject(err);
      });
  });
};

export const processMacros = (scrapingResponse) => {
  const root = parse(scrapingResponse);

  const mainTitle = root.querySelector(".main-title");

  if (mainTitle && mainTitle.innerText.includes("Private")) {
    return {
      isPrivate: true,
      diaryEntries: [],
      dateFetched: "",
      goals: {},
    };
  }

  const diaryTable = root.querySelector("#diary-table tbody");
  const diaryRows = diaryTable.querySelectorAll("tr");
  const diaryEntries = diaryRows
    .filter((diaryRow) => !diaryRow.attributes.class)
    .map((diaryRow) => {
      const nodes = diaryRow.querySelectorAll("td");
      const foodNode = nodes[0];
      const caloriesNode = nodes[1];
      const carbsNode = nodes[2].querySelector(".macro-percentage");
      const fatsNode = nodes[3].querySelector(".macro-percentage");
      const proteinsNode = nodes[4].querySelector(".macro-percentage");
      const food = foodNode.innerText.trim();
      const foodName = food.split(/(?:.(?!\, \d))+$/gim)[0];
      const servings = food.split(`${foodName},`)[1].trim();
      const servingsCount = servings.replace(/^(\d+)\s[\w\W]+/gim, "$1");
      const servingsLabel = servings.replace(/^\d+\s([\w\W]+)/gim, "$1");
      return {
        food,
        foodName,
        servingsCount: parseInt(servingsCount),
        servingsLabel,
        calories: parseInt(caloriesNode.innerText.trim()),
        carbsPercentage: parseInt(carbsNode.innerText.trim()),
        fatPercentage: parseInt(fatsNode.innerText.trim()),
        proteinPercentage: parseInt(proteinsNode.innerText.trim()),
      };
    });
  const goalRow = diaryTable.querySelector("tr.total.alt");
  const goalsComponents = goalRow.querySelectorAll("td");
  const calorieGoal = goalsComponents[1].innerText.replace(/\,/gi, "").trim();
  const carbsGoal = goalsComponents[2]
    .querySelector(".macro-value")
    .innerText.replace(/\,/gi, "")
    .trim();
  const fatGoal = goalsComponents[3]
    .querySelector(".macro-value")
    .innerText.replace(/\,/gi, "")
    .trim();
  const proteinGoal = goalsComponents[4]
    .querySelector(".macro-value")
    .innerText.replace(/\,/gi, "")
    .trim();
  // This is the goal row on MyFitnessPal, good to have so you can
  // add notification about mismatch
  const goals = {
    calorieGoal: parseInt(calorieGoal),
    carbsGoal: parseInt(carbsGoal),
    fatGoal: parseInt(fatGoal),
    proteinGoal: parseInt(proteinGoal),
  };

  const dateFetched = root.querySelector(
    `#date_controls input[name="hidden_date_selector"]`
  ).attributes.value;

  console.log({ diaryEntries, goals, dateFetched, isPrivate: false });
  return { diaryEntries, goals, dateFetched, isPrivate: false };
};
export const sampleScraping = () => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" class="lang-en js-enabled"><head><meta http-equiv="origin-trial" content="Az520Inasey3TAyqLyojQa8MnmCALSEU29yQFW8dePZ7xQTvSt73pHazLFTK5f7SyLUJSo2uKLesEtEa9aUYcgMAAACPeyJvcmlnaW4iOiJodHRwczovL2dvb2dsZS5jb206NDQzIiwiZmVhdHVyZSI6IkRpc2FibGVUaGlyZFBhcnR5U3RvcmFnZVBhcnRpdGlvbmluZyIsImV4cGlyeSI6MTcyNTQwNzk5OSwiaXNTdWJkb21haW4iOnRydWUsImlzVGhpcmRQYXJ0eSI6dHJ1ZX0=">
  
  
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>Hermano360's Food Diary | MyFitnessPal.com</title>
  <meta name="description" content="Free online calorie counter and diet plan. Lose weight by tracking your caloric intake quickly and easily.  Find nutrition facts for over 2,000,000 foods.">
  <meta name="keywords" content="calorie counter, free diet journal, weight loss program, nutrition facts, online calorie counter, free diet plan, weight loss online, free calorie counter">
  <meta name="csrf-param" content="authenticity_token">
<meta name="csrf-token" content="t7vrGGV5kvtlkEceVD9dskavprxhLMjxGRe/9E0fLFnl17zAMy0NHH4w9qeHeASFHS3xTiCM55LiY1mGtdhefQ==">
  <meta name="verify-v1" content="jKS1fjb9pK13luol4O+VFWO0OwEYaK4au88j0aRpQTM=">
    <meta name="robots" content="noindex, follow">
  <link rel="search" type="application/opensearchdescription+xml" href="opensearch.xml">
    <link rel="stylesheet" media="screen" href="https://d34yn14tavczy0.cloudfront.net/assets/sass/application-22031a183580aede8573d5150f500b4883ac2889b2f329646f722ea11ea4121a.css">
  <link rel="stylesheet" media="all" href="https://d34yn14tavczy0.cloudfront.net/stylesheets/font-awesome/css/font-awesome.min.css">
  <!--[if IE 7]>
    <link rel="stylesheet" media="all" href="https://d34yn14tavczy0.cloudfront.net/stylesheets/font-awesome/css/font-awesome-ie7.min.css" />
  <![endif]-->
  <link rel="stylesheet" media="all" href="https://d34yn14tavczy0.cloudfront.net/stylesheets/font-mfizz/font-mfizz.css">
  
 
 
  <link rel="canonical" href="https://www.myfitnesspal.com/food/diary/hermano360">
  <link rel="alternate" href="https://www.myfitnesspal.com.br/food/diary/hermano360" hreflang="pt">
  <link rel="alternate" href="https://www.myfitnesspal.com/food/diary/hermano360" hreflang="en">
  <link rel="alternate" href="https://www.myfitnesspal.cn/food/diary/hermano360" hreflang="zh-Hans">
  <link rel="alternate" href="https://www.myfitnesspal.de/food/diary/hermano360" hreflang="de">
  <link rel="alternate" href="https://www.myfitnesspal.es/food/diary/hermano360" hreflang="es">
  <link rel="alternate" href="https://www.myfitnesspal.com.hk/food/diary/hermano360" hreflang="zh-Hant">
  <link rel="alternate" href="https://www.myfitnesspal.it/food/diary/hermano360" hreflang="it">
  <link rel="alternate" href="https://www.myfitnesspal.jp/food/diary/hermano360" hreflang="ja">
  <link rel="alternate" href="https://www.myfitnesspal.co.kr/food/diary/hermano360" hreflang="ko">
  <link rel="alternate" href="https://www.myfitnesspal.com.mx/food/diary/hermano360" hreflang="es">
  <link rel="alternate" href="https://www.myfitnesspal.nl/food/diary/hermano360" hreflang="nl">
  <link rel="alternate" href="https://www.myfitnesspal.se/food/diary/hermano360" hreflang="sv">
  <link rel="alternate" href="https://www.myfitnesspal.com.tw/food/diary/hermano360" hreflang="zh-Hant">
  <link rel="alternate" href="https://www.myfitnesspal.com/de/food/diary/hermano360" hreflang="de-US">
  <link rel="alternate" href="https://www.myfitnesspal.com/es/food/diary/hermano360" hreflang="es-US">
  <link rel="alternate" href="https://www.myfitnesspal.com/fr/food/diary/hermano360" hreflang="fr-US">
  <link rel="alternate" href="https://www.myfitnesspal.com/pt/food/diary/hermano360" hreflang="pt-US">
  <link rel="alternate" href="https://www.myfitnesspal.com/it/food/diary/hermano360" hreflang="it-US">
  <link rel="alternate" href="https://www.myfitnesspal.com/nb/food/diary/hermano360" hreflang="nb-US">
  <link rel="alternate" href="https://www.myfitnesspal.com/nl/food/diary/hermano360" hreflang="nl-US">
  <link rel="alternate" href="https://www.myfitnesspal.com/ru/food/diary/hermano360" hreflang="ru-US">
  <link rel="alternate" href="https://www.myfitnesspal.com/sv/food/diary/hermano360" hreflang="sv-US">
  <link rel="alternate" href="https://www.myfitnesspal.com/da/food/diary/hermano360" hreflang="da-US">
  <link rel="alternate" href="https://www.myfitnesspal.com/ko/food/diary/hermano360" hreflang="ko-US">
  <link rel="alternate" href="https://www.myfitnesspal.com/ja/food/diary/hermano360" hreflang="ja-US">
  <link rel="alternate" href="https://www.myfitnesspal.com/zh-CN/food/diary/hermano360" hreflang="zh-Hans-US">
  <link rel="alternate" href="https://www.myfitnesspal.com/zh-TW/food/diary/hermano360" hreflang="zh-Hant-US">
  
<meta http-equiv="origin-trial" content="AlK2UR5SkAlj8jjdEc9p3F3xuFYlF6LYjAML3EOqw1g26eCwWPjdmecULvBH5MVPoqKYrOfPhYVL71xAXI1IBQoAAAB8eyJvcmlnaW4iOiJodHRwczovL2RvdWJsZWNsaWNrLm5ldDo0NDMiLCJmZWF0dXJlIjoiV2ViVmlld1hSZXF1ZXN0ZWRXaXRoRGVwcmVjYXRpb24iLCJleHBpcnkiOjE3NTgwNjcxOTksImlzU3ViZG9tYWluIjp0cnVlfQ=="><meta http-equiv="origin-trial" content="Amm8/NmvvQfhwCib6I7ZsmUxiSCfOxWxHayJwyU1r3gRIItzr7bNQid6O8ZYaE1GSQTa69WwhPC9flq/oYkRBwsAAACCeyJvcmlnaW4iOiJodHRwczovL2dvb2dsZXN5bmRpY2F0aW9uLmNvbTo0NDMiLCJmZWF0dXJlIjoiV2ViVmlld1hSZXF1ZXN0ZWRXaXRoRGVwcmVjYXRpb24iLCJleHBpcnkiOjE3NTgwNjcxOTksImlzU3ViZG9tYWluIjp0cnVlfQ=="><meta http-equiv="origin-trial" content="A9uiHDzQFAhqALUhTgTYJcz9XrGH2y0/9AORwCSapUO/f7Uh7ysIzyszNkuWDLqNYg8446Uj48XIstBW1qv/wAQAAACNeyJvcmlnaW4iOiJodHRwczovL2RvdWJsZWNsaWNrLm5ldDo0NDMiLCJmZWF0dXJlIjoiRmxlZGdlQmlkZGluZ0FuZEF1Y3Rpb25TZXJ2ZXIiLCJleHBpcnkiOjE3Mjc4MjcxOTksImlzU3ViZG9tYWluIjp0cnVlLCJpc1RoaXJkUGFydHkiOnRydWV9"><meta http-equiv="origin-trial" content="A9R+gkZL3TWq+Z7RJ2L0c7ZN7FZD5z4mHmVvjrPitg/EMz9P3j5d3W7Vw5ZR9jtJGmWKltM4BO3smNzpCgwYuwwAAACTeyJvcmlnaW4iOiJodHRwczovL2dvb2dsZXN5bmRpY2F0aW9uLmNvbTo0NDMiLCJmZWF0dXJlIjoiRmxlZGdlQmlkZGluZ0FuZEF1Y3Rpb25TZXJ2ZXIiLCJleHBpcnkiOjE3Mjc4MjcxOTksImlzU3ViZG9tYWluIjp0cnVlLCJpc1RoaXJkUGFydHkiOnRydWV9">
<style type="text/css">/* Chart.js */
/*
 * DOM element rendering detection
 * https://davidwalsh.name/detect-node-insertion
 */
@keyframes chartjs-render-animation {
	from { opacity: 0.99; }
	to { opacity: 1; }
}
.chartjs-render-monitor {
	animation: chartjs-render-animation 0.001s;
}
/*
 * DOM element resizing detection
 * https://github.com/marcj/css-element-queries
 */
.chartjs-size-monitor,
.chartjs-size-monitor-expand,
.chartjs-size-monitor-shrink {
	position: absolute;
	direction: ltr;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	overflow: hidden;
	pointer-events: none;
	visibility: hidden;
	z-index: -1;
}
.chartjs-size-monitor-expand > div {
	position: absolute;
	width: 1000000px;
	height: 1000000px;
	left: 0;
	top: 0;
}
.chartjs-size-monitor-shrink > div {
	position: absolute;
	width: 200%;
	height: 200%;
	left: 0;
	top: 0;
}
</style><meta http-equiv="origin-trial" content="AlK2UR5SkAlj8jjdEc9p3F3xuFYlF6LYjAML3EOqw1g26eCwWPjdmecULvBH5MVPoqKYrOfPhYVL71xAXI1IBQoAAAB8eyJvcmlnaW4iOiJodHRwczovL2RvdWJsZWNsaWNrLm5ldDo0NDMiLCJmZWF0dXJlIjoiV2ViVmlld1hSZXF1ZXN0ZWRXaXRoRGVwcmVjYXRpb24iLCJleHBpcnkiOjE3NTgwNjcxOTksImlzU3ViZG9tYWluIjp0cnVlfQ=="><meta http-equiv="origin-trial" content="Amm8/NmvvQfhwCib6I7ZsmUxiSCfOxWxHayJwyU1r3gRIItzr7bNQid6O8ZYaE1GSQTa69WwhPC9flq/oYkRBwsAAACCeyJvcmlnaW4iOiJodHRwczovL2dvb2dsZXN5bmRpY2F0aW9uLmNvbTo0NDMiLCJmZWF0dXJlIjoiV2ViVmlld1hSZXF1ZXN0ZWRXaXRoRGVwcmVjYXRpb24iLCJleHBpcnkiOjE3NTgwNjcxOTksImlzU3ViZG9tYWluIjp0cnVlfQ=="><meta http-equiv="origin-trial" content="A9uiHDzQFAhqALUhTgTYJcz9XrGH2y0/9AORwCSapUO/f7Uh7ysIzyszNkuWDLqNYg8446Uj48XIstBW1qv/wAQAAACNeyJvcmlnaW4iOiJodHRwczovL2RvdWJsZWNsaWNrLm5ldDo0NDMiLCJmZWF0dXJlIjoiRmxlZGdlQmlkZGluZ0FuZEF1Y3Rpb25TZXJ2ZXIiLCJleHBpcnkiOjE3Mjc4MjcxOTksImlzU3ViZG9tYWluIjp0cnVlLCJpc1RoaXJkUGFydHkiOnRydWV9"><meta http-equiv="origin-trial" content="A9R+gkZL3TWq+Z7RJ2L0c7ZN7FZD5z4mHmVvjrPitg/EMz9P3j5d3W7Vw5ZR9jtJGmWKltM4BO3smNzpCgwYuwwAAACTeyJvcmlnaW4iOiJodHRwczovL2dvb2dsZXN5bmRpY2F0aW9uLmNvbTo0NDMiLCJmZWF0dXJlIjoiRmxlZGdlQmlkZGluZ0FuZEF1Y3Rpb25TZXJ2ZXIiLCJleHBpcnkiOjE3Mjc4MjcxOTksImlzU3ViZG9tYWluIjp0cnVlLCJpc1RoaXJkUGFydHkiOnRydWV9"></head>
<body id="food-diary" data-lang="en" class="&quot;body-header&quot;">
  <!--[if lte IE 7]><div id="ie"><![endif]-->
  <!--[if IE 6]><div id="ie6"><![endif]-->
  
<div id="fb-root"></div>
  
  
  <div class="header-wrap clearfix">
  <div id="logo"><a href="http://www.myfitnesspal.com/">Calorie Counter</a></div>
  <ul id="navTop" class="nav guest">
  <li class="first">
    <a href="https://www.myfitnesspal.com/account/login?callbackUrl=https%3A%2F%2Fwww.myfitnesspal.com%2Ffood%2Fdiary%2Fhermano360">Log In</a>
  </li>
  <li class="last"><a class="signup-link" data-sso-source="top_menu" href="/account/create?redirect_to=%2F">Sign Up</a></li>
</ul>
</div>
  <div id="header">
  <div id="nav-bg">
  <ul id="nav" class="nav clearfix">
    <li>
  <a class="nav_button" href="/welcome/learn_more">About</a>
</li>
<li>
  <a class="nav_button active" href="/food/search">Food</a>
</li>
<li>
  <a class="nav_button" href="/exercise/lookup">Exercise</a>
</li>
    <li>
      <a class="nav_button" href="/apps">Apps</a>
    </li>
    <li>
      <a class="nav_button" href="/forums">Community</a>
    </li>
    <li>
      <a class="nav_button" href="http://blog.myfitnesspal.com">Blog</a>
    </li>
    <li>
      <a class="nav_button premium-nav-link" href="/premium?source=home_logged_out">Premium</a>
    </li>
  </ul>
</div>
  
</div><!-- / #header -->
  <div id="wrap">
    <div id="content">
      
<div class="google_ads_with_related_links">
  <div id="related_links">
  
  <ins class="adsbygoogle adsbygoogle-noablate" data-ad-client="ca-pub-8033683427063754" data-ad-output="js" data-adtest="off" data-max-radlink-len="20" data-num-radlinks="3" data-num-radlinks-per-unit="2,2" data-rl-filtering="high" data-adsbygoogle-status="done" style="display: inline-block; width: 0px; height: 0px;"><div id="aswift_0_host" style="border: none; height: 0px; width: 0px; margin: 0px; padding: 0px; position: relative; visibility: visible; background-color: transparent; display: inline-block;"></div></ins>
</div>
  
<div id="ad_fooddiary_728x90" data-network="google" class="ad-wrapper">
</div>
</div>
<div id="main">
  <div class="diary">
      <h1>hermano360's Food Diary For:</h1>
      <div id="date_controls">
  <form class="date-controls-form" action="/food/diary/hermano360" accept-charset="UTF-8" method="post"><input type="hidden" name="authenticity_token" value="t7vrGGV5kvtlkEceVD9dskavprxhLMjxGRe/9E0fLFnl17zAMy0NHH4w9qeHeASFHS3xTiCM55LiY1mGtdhefQ==" autocomplete="off">
    <span class="date">
      <a class="prev" href="/food/diary/hermano360?date=2024-06-26">
        <i class="icon-caret-left"></i>
</a>      <time>
        Thursday, June 27, 2024
      </time>
      <a class="next" href="/food/diary/hermano360?date=2024-06-28">
        <i class="icon-caret-right"></i>
</a>    </span>
      <input type="hidden" value="2024-06-27" name="hidden_date_selector" id="date_selector" class="hasDatepicker">
<i class="icon-calendar" id="datepicker-trigger"></i>
</form></div>
  </div>
  
<div class="food_container container">
    
    <table class="table0 " id="diary-table">
      <colgroup>
        <col class="col-1">
          <col class="col-2">
          <col class="col-2">
          <col class="col-2">
          <col class="col-2">
          <col class="col-2">
          <col class="col-2">
        <col class="col-8">
      </colgroup>
      <tbody>
          <tr class="meal_header">
            <td class="first alt">Breakfast</td>
                  <td class="alt nutrient-column">
                    Calories
                    <div class="subtitle">kcal</div>
                  </td>
                  <td class="alt nutrient-column">
                    Carbs
                    <div class="subtitle">g</div>
                  </td>
                  <td class="alt nutrient-column">
                    Fat
                    <div class="subtitle">g</div>
                  </td>
                  <td class="alt nutrient-column">
                    Protein
                    <div class="subtitle">g</div>
                  </td>
                  <td class="alt nutrient-column">
                    Sodium
                    <div class="subtitle">mg</div>
                  </td>
                  <td class="alt nutrient-column">
                    Sugar
                    <div class="subtitle">g</div>
                  </td>
          </tr>
            <tr>
              <td class="first alt">
                  Eggs, 8 large
              </td>
                  <td>572</td>
                  <td>
                    <span class="macro-value">4</span>
                    <span class="macro-percentage">3</span>
                  </td>
                  <td>
                    <span class="macro-value">40</span>
                    <span class="macro-percentage">63</span>
                  </td>
                  <td>
                    <span class="macro-value">50</span>
                    <span class="macro-percentage">34</span>
                  </td>
                  <td>516</td>
                  <td>1</td>
              <td class="delete">
              </td>
            </tr>
          <tr class="bottom">
            <td class="first alt" style="z-index: 10">
                <div class="quick_tools">
                  <a href="#quick_tools_0" class="toggle_diary_options">Quick Tools</a>
                  <div id="quick_tools_0" class="quick_tools_options hidden">
                    <ul>
                      <li class="with_border">
                        <a href="#meals_copy_to_0" class="toggle_diary_options copy_to_which_date" data-meal="0" data-to-date="2024-06-27">
                          Copy to today
                        </a>
                      </li>
                    <li><a href="#recent_meals_copy_to_0" class="toggle_diary_options">Copy to date</a></li>
                  </ul>
                </div>
              <div id="recent_meals_0" class="recent_meal_options hidden">
              </div>
              <div id="recent_meals_copy_to_0" class="recent_meal_options hidden">
                <ul id="recent_meal_options_copy_to_0">
                  <li class="header">Copy to which date?</li>
                  <li>
                    <a href="#meals_copy_to_0" class="toggle_diary_options copy_to_which_date" data-meal="0" data-to-date="2024-06-30">
                      Sunday, June 30
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_0" class="toggle_diary_options copy_to_which_date" data-meal="0" data-to-date="2024-06-29">
                      Saturday, June 29
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_0" class="toggle_diary_options copy_to_which_date" data-meal="0" data-to-date="2024-06-28">
                      Tomorrow
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_0" class="toggle_diary_options copy_to_which_date" data-meal="0" data-to-date="2024-06-27">
                      Today
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_0" class="toggle_diary_options copy_to_which_date" data-meal="0" data-to-date="2024-06-26">
                      Yesterday
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_0" class="toggle_diary_options copy_to_which_date" data-meal="0" data-to-date="2024-06-25">
                      Tuesday, June 25
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_0" class="toggle_diary_options copy_to_which_date" data-meal="0" data-to-date="2024-06-24">
                      Monday, June 24
                    </a>
                  </li>
                </ul>
              </div>
              <div id="meals_copy_to_0" class="quick_add_meals_list hidden">
                <ul id="meals_copy_options_copy_to_0">
                  <li class="header">Copy to which meal?</li>
                    <li><a rel="nofollow" data-method="post" href="/food/copy_meal?from_date=2024-06-27&amp;from_meal=0&amp;to_meal=0&amp;username=hermano360">Breakfast</a></li>
                    <li><a rel="nofollow" data-method="post" href="/food/copy_meal?from_date=2024-06-27&amp;from_meal=0&amp;to_meal=1&amp;username=hermano360">Lunch</a></li>
                    <li><a rel="nofollow" data-method="post" href="/food/copy_meal?from_date=2024-06-27&amp;from_meal=0&amp;to_meal=2&amp;username=hermano360">Dinner</a></li>
                    <li><a rel="nofollow" data-method="post" href="/food/copy_meal?from_date=2024-06-27&amp;from_meal=0&amp;to_meal=3&amp;username=hermano360">Snacks</a></li>
                </ul>
              </div>
            </div>
          </td>
              <td>572</td>
              <td>
                <span class="macro-value">4</span>
                <span class="macro-percentage">
                    3
                </span>
              </td>
              <td>
                <span class="macro-value">40</span>
                <span class="macro-percentage">
                    63
                </span>
              </td>
              <td>
                <span class="macro-value">50</span>
                <span class="macro-percentage">
                    34
                </span>
              </td>
              <td>516</td>
              <td>1</td>
          <td></td>
        </tr>
          <tr class="meal_header">
            <td class="first alt">Lunch</td>
          </tr>
            <tr>
              <td class="first alt">
                  Instant oats, cooked, 4 cup, cooked
              </td>
                  <td>653</td>
                  <td>
                    <span class="macro-value">112</span>
                    <span class="macro-percentage">68</span>
                  </td>
                  <td>
                    <span class="macro-value">13</span>
                    <span class="macro-percentage">18</span>
                  </td>
                  <td>
                    <span class="macro-value">23</span>
                    <span class="macro-percentage">14</span>
                  </td>
                  <td>470</td>
                  <td>4</td>
              <td class="delete">
              </td>
            </tr>
          <tr class="bottom">
            <td class="first alt" style="z-index: 9">
                <div class="quick_tools">
                  <a href="#quick_tools_1" class="toggle_diary_options">Quick Tools</a>
                  <div id="quick_tools_1" class="quick_tools_options hidden">
                    <ul>
                      <li class="with_border">
                        <a href="#meals_copy_to_1" class="toggle_diary_options copy_to_which_date" data-meal="1" data-to-date="2024-06-27">
                          Copy to today
                        </a>
                      </li>
                    <li><a href="#recent_meals_copy_to_1" class="toggle_diary_options">Copy to date</a></li>
                  </ul>
                </div>
              <div id="recent_meals_1" class="recent_meal_options hidden">
              </div>
              <div id="recent_meals_copy_to_1" class="recent_meal_options hidden">
                <ul id="recent_meal_options_copy_to_1">
                  <li class="header">Copy to which date?</li>
                  <li>
                    <a href="#meals_copy_to_1" class="toggle_diary_options copy_to_which_date" data-meal="1" data-to-date="2024-06-30">
                      Sunday, June 30
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_1" class="toggle_diary_options copy_to_which_date" data-meal="1" data-to-date="2024-06-29">
                      Saturday, June 29
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_1" class="toggle_diary_options copy_to_which_date" data-meal="1" data-to-date="2024-06-28">
                      Tomorrow
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_1" class="toggle_diary_options copy_to_which_date" data-meal="1" data-to-date="2024-06-27">
                      Today
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_1" class="toggle_diary_options copy_to_which_date" data-meal="1" data-to-date="2024-06-26">
                      Yesterday
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_1" class="toggle_diary_options copy_to_which_date" data-meal="1" data-to-date="2024-06-25">
                      Tuesday, June 25
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_1" class="toggle_diary_options copy_to_which_date" data-meal="1" data-to-date="2024-06-24">
                      Monday, June 24
                    </a>
                  </li>
                </ul>
              </div>
              <div id="meals_copy_to_1" class="quick_add_meals_list hidden">
                <ul id="meals_copy_options_copy_to_1">
                  <li class="header">Copy to which meal?</li>
                    <li><a rel="nofollow" data-method="post" href="/food/copy_meal?from_date=2024-06-27&amp;from_meal=1&amp;to_meal=0&amp;username=hermano360">Breakfast</a></li>
                    <li><a rel="nofollow" data-method="post" href="/food/copy_meal?from_date=2024-06-27&amp;from_meal=1&amp;to_meal=1&amp;username=hermano360">Lunch</a></li>
                    <li><a rel="nofollow" data-method="post" href="/food/copy_meal?from_date=2024-06-27&amp;from_meal=1&amp;to_meal=2&amp;username=hermano360">Dinner</a></li>
                    <li><a rel="nofollow" data-method="post" href="/food/copy_meal?from_date=2024-06-27&amp;from_meal=1&amp;to_meal=3&amp;username=hermano360">Snacks</a></li>
                </ul>
              </div>
            </div>
          </td>
              <td>653</td>
              <td>
                <span class="macro-value">112</span>
                <span class="macro-percentage">
                    68
                </span>
              </td>
              <td>
                <span class="macro-value">13</span>
                <span class="macro-percentage">
                    18
                </span>
              </td>
              <td>
                <span class="macro-value">23</span>
                <span class="macro-percentage">
                    14
                </span>
              </td>
              <td>470</td>
              <td>4</td>
          <td></td>
        </tr>
          <tr class="meal_header">
            <td class="first alt">Dinner</td>
          </tr>
          <tr class="bottom">
            <td class="first alt" style="z-index: 8">
                <div class="quick_tools">
                  <a href="#quick_tools_2" class="toggle_diary_options">Quick Tools</a>
                  <div id="quick_tools_2" class="quick_tools_options hidden">
                    <ul>
                      <li class="with_border">
                        <a href="#meals_copy_to_2" class="toggle_diary_options copy_to_which_date" data-meal="2" data-to-date="2024-06-27">
                          Copy to today
                        </a>
                      </li>
                    <li><a href="#recent_meals_copy_to_2" class="toggle_diary_options">Copy to date</a></li>
                  </ul>
                </div>
              <div id="recent_meals_2" class="recent_meal_options hidden">
              </div>
              <div id="recent_meals_copy_to_2" class="recent_meal_options hidden">
                <ul id="recent_meal_options_copy_to_2">
                  <li class="header">Copy to which date?</li>
                  <li>
                    <a href="#meals_copy_to_2" class="toggle_diary_options copy_to_which_date" data-meal="2" data-to-date="2024-06-30">
                      Sunday, June 30
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_2" class="toggle_diary_options copy_to_which_date" data-meal="2" data-to-date="2024-06-29">
                      Saturday, June 29
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_2" class="toggle_diary_options copy_to_which_date" data-meal="2" data-to-date="2024-06-28">
                      Tomorrow
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_2" class="toggle_diary_options copy_to_which_date" data-meal="2" data-to-date="2024-06-27">
                      Today
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_2" class="toggle_diary_options copy_to_which_date" data-meal="2" data-to-date="2024-06-26">
                      Yesterday
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_2" class="toggle_diary_options copy_to_which_date" data-meal="2" data-to-date="2024-06-25">
                      Tuesday, June 25
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_2" class="toggle_diary_options copy_to_which_date" data-meal="2" data-to-date="2024-06-24">
                      Monday, June 24
                    </a>
                  </li>
                </ul>
              </div>
              <div id="meals_copy_to_2" class="quick_add_meals_list hidden">
                <ul id="meals_copy_options_copy_to_2">
                  <li class="header">Copy to which meal?</li>
                    <li><a rel="nofollow" data-method="post" href="/food/copy_meal?from_date=2024-06-27&amp;from_meal=2&amp;to_meal=0&amp;username=hermano360">Breakfast</a></li>
                    <li><a rel="nofollow" data-method="post" href="/food/copy_meal?from_date=2024-06-27&amp;from_meal=2&amp;to_meal=1&amp;username=hermano360">Lunch</a></li>
                    <li><a rel="nofollow" data-method="post" href="/food/copy_meal?from_date=2024-06-27&amp;from_meal=2&amp;to_meal=2&amp;username=hermano360">Dinner</a></li>
                    <li><a rel="nofollow" data-method="post" href="/food/copy_meal?from_date=2024-06-27&amp;from_meal=2&amp;to_meal=3&amp;username=hermano360">Snacks</a></li>
                </ul>
              </div>
            </div>
          </td>
              <td>&nbsp;</td>
              <td>
                <span class="macro-value">&nbsp;</span>
                <span class="macro-percentage">
                    &nbsp;
                </span>
              </td>
              <td>
                <span class="macro-value">&nbsp;</span>
                <span class="macro-percentage">
                    &nbsp;
                </span>
              </td>
              <td>
                <span class="macro-value">&nbsp;</span>
                <span class="macro-percentage">
                    &nbsp;
                </span>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
          <td></td>
        </tr>
          <tr class="meal_header">
            <td class="first alt">Snacks</td>
          </tr>
          <tr class="bottom">
            <td class="first alt" style="z-index: 7">
                <div class="quick_tools">
                  <a href="#quick_tools_3" class="toggle_diary_options">Quick Tools</a>
                  <div id="quick_tools_3" class="quick_tools_options hidden">
                    <ul>
                      <li class="with_border">
                        <a href="#meals_copy_to_3" class="toggle_diary_options copy_to_which_date" data-meal="3" data-to-date="2024-06-27">
                          Copy to today
                        </a>
                      </li>
                    <li><a href="#recent_meals_copy_to_3" class="toggle_diary_options">Copy to date</a></li>
                  </ul>
                </div>
              <div id="recent_meals_3" class="recent_meal_options hidden">
              </div>
              <div id="recent_meals_copy_to_3" class="recent_meal_options hidden">
                <ul id="recent_meal_options_copy_to_3">
                  <li class="header">Copy to which date?</li>
                  <li>
                    <a href="#meals_copy_to_3" class="toggle_diary_options copy_to_which_date" data-meal="3" data-to-date="2024-06-30">
                      Sunday, June 30
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_3" class="toggle_diary_options copy_to_which_date" data-meal="3" data-to-date="2024-06-29">
                      Saturday, June 29
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_3" class="toggle_diary_options copy_to_which_date" data-meal="3" data-to-date="2024-06-28">
                      Tomorrow
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_3" class="toggle_diary_options copy_to_which_date" data-meal="3" data-to-date="2024-06-27">
                      Today
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_3" class="toggle_diary_options copy_to_which_date" data-meal="3" data-to-date="2024-06-26">
                      Yesterday
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_3" class="toggle_diary_options copy_to_which_date" data-meal="3" data-to-date="2024-06-25">
                      Tuesday, June 25
                    </a>
                  </li>
                  <li>
                    <a href="#meals_copy_to_3" class="toggle_diary_options copy_to_which_date" data-meal="3" data-to-date="2024-06-24">
                      Monday, June 24
                    </a>
                  </li>
                </ul>
              </div>
              <div id="meals_copy_to_3" class="quick_add_meals_list hidden">
                <ul id="meals_copy_options_copy_to_3">
                  <li class="header">Copy to which meal?</li>
                    <li><a rel="nofollow" data-method="post" href="/food/copy_meal?from_date=2024-06-27&amp;from_meal=3&amp;to_meal=0&amp;username=hermano360">Breakfast</a></li>
                    <li><a rel="nofollow" data-method="post" href="/food/copy_meal?from_date=2024-06-27&amp;from_meal=3&amp;to_meal=1&amp;username=hermano360">Lunch</a></li>
                    <li><a rel="nofollow" data-method="post" href="/food/copy_meal?from_date=2024-06-27&amp;from_meal=3&amp;to_meal=2&amp;username=hermano360">Dinner</a></li>
                    <li><a rel="nofollow" data-method="post" href="/food/copy_meal?from_date=2024-06-27&amp;from_meal=3&amp;to_meal=3&amp;username=hermano360">Snacks</a></li>
                </ul>
              </div>
            </div>
          </td>
              <td>&nbsp;</td>
              <td>
                <span class="macro-value">&nbsp;</span>
                <span class="macro-percentage">
                    &nbsp;
                </span>
              </td>
              <td>
                <span class="macro-value">&nbsp;</span>
                <span class="macro-percentage">
                    &nbsp;
                </span>
              </td>
              <td>
                <span class="macro-value">&nbsp;</span>
                <span class="macro-percentage">
                    &nbsp;
                </span>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
          <td></td>
        </tr>
      <tr class="spacer">
        <td class="first" colspan="6">&nbsp;</td>
      </tr>
      <tr class="total">
        <td class="first">Totals</td>
            <td>1,225</td>
            <td>
              <span class="macro-value">116</span>
              <span class="macro-percentage">
                38
              </span>
            </td>
            <td>
              <span class="macro-value">53</span>
              <span class="macro-percentage">
                39
              </span>
            </td>
            <td>
              <span class="macro-value">73</span>
              <span class="macro-percentage">
                23
              </span>
            </td>
            <td>986</td>
            <td>5</td>
        <td class="empty"></td>
      </tr>
      <tr class="total alt">
        <td class="first">hermano360 Daily Goal </td>
              <td>2,320</td>
              <td>
                <span class="macro-value">203</span>
                <span class="macro-percentage">
                  35
                </span>
              </td>
              <td>
                <span class="macro-value">77</span>
                <span class="macro-percentage">
                  30
                </span>
              </td>
              <td>
                <span class="macro-value">203</span>
                <span class="macro-percentage">
                  35
                </span>
              </td>
              <td>2,300</td>
              <td>87</td>
        <td class="empty"></td>
      </tr>
      <tr class="total remaining">
        <td class="first">Remaining</td>
              <td class="positive">1,095</td>
              <td class="positive">
                <span class="macro-value">87</span>
                <span class="macro-percentage ">
                  32
                </span>
              </td>
              <td class="positive">
                <span class="macro-value">24</span>
                <span class="macro-percentage ">
                  20
                </span>
              </td>
              <td class="positive">
                <span class="macro-value">130</span>
                <span class="macro-percentage ">
                  48
                </span>
              </td>
              <td class="positive">1,314</td>
              <td class="positive">82</td>
        <td class="empty"></td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td class="first"></td>
            <td class="alt nutrient-column">
              Calories
              <div class="subtitle">kcal</div>
            </td>
            <td class="alt nutrient-column">
              Carbs
              <div class="subtitle">g</div>
            </td>
            <td class="alt nutrient-column">
              Fat
              <div class="subtitle">g</div>
            </td>
            <td class="alt nutrient-column">
              Protein
              <div class="subtitle">g</div>
            </td>
            <td class="alt nutrient-column">
              Sodium
              <div class="subtitle">mg</div>
            </td>
            <td class="alt nutrient-column">
              Sugar
              <div class="subtitle">g</div>
            </td>
        <td class="empty"></td>
      </tr>
    </tfoot>
  </table>
      <div id="diary_pie_graphs">
        <div id="chart-1" style="height: 250px; width: 100%; text-align: center; color: #999; line-height: 250px; font-size: 14px; font-family: 'Lucida Grande', 'Lucida Sans Unicode', Verdana, Arial, Helvetica, sans-serif;"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div><canvas width="940" height="250" style="display: block; width: 940px; height: 250px;" class="chartjs-render-monitor"></canvas></div>
       
      </div>
</div><!-- / .table-container -->
<!-- Premium Modals: modals will queue in the order that they are rendered -->
<!-- Variables we pass down to our JS -->
    <div class="block">
      <div class="water-notes-v1">
  <div class="water-consumption">
  <h3>Water Consumption</h3>
  <p>We recommend that you drink at least 8 cups of water a day. Click the arrows to add or subtract cups of water.</p>
</div><!-- / .water-consumption -->
<div class="water-counter" id="water_cups">
  <p style="background:url('https://d34yn14tavczy0.cloudfront.net/assets/glass_image_0-4a5711c347a5d7218754dbcbcaaff68cb4217fea6a05250cbb02d0adeda2d2b3.png') no-repeat scroll center 23px;">
      0
</p>
</div><!-- / .water-counter -->
  <form id="noteform" action="/food/save_note?date=2024-06-27" accept-charset="UTF-8" method="post"><input type="hidden" name="authenticity_token" value="t7vrGGV5kvtlkEceVD9dskavprxhLMjxGRe/9E0fLFnl17zAMy0NHH4w9qeHeASFHS3xTiCM55LiY1mGtdhefQ==" autocomplete="off">
    <div id="notes">
      <div class="notes">
	<h4 class="secondary-title">Today's Food Notes</h4>
  <div id="note">
	
	  <p class="note"></p>
  </div>
</div><!-- / .notes -->
    </div>
</form></div>
    </div>
  <p class="cont-0">
  
    <a class="button style-1" href="/en/reports/printable-diary/hermano360?from=2024-06-27&amp;to=2024-06-27"><span class="full-report">View Full Report (Printable)</span></a>
    
      <a class="button style-1b" href="/exercise/diary/hermano360"><span class="food-diary">View Exercise Diary</span></a>
  </p>
  <div class="ads bottom">
    <p>
        
</p><div id="ad_fooddiary_728x90_bottom" data-network="google" class="ad-wrapper">
</div>
  
    <p></p>
  </div>
</div><!-- / #main -->
<div id="sidebar">
  <div class="ads">
    <div class="ad">
<div id="ad_fooddiary_160x600" data-network="google" class="ad-wrapper">
</div>
</div>
  </div>
</div><!-- / #sidebar -->
    </div><!-- / #content -->
  </div><iframe name="__tcfapiLocator" style="display: none;"></iframe><iframe name="__gppLocator" style="display: none;"></iframe><!-- / #wrap -->
  <section id="footer-wrapper">
  <div id="footer">
    <div id="footerContent">
        <div id="language_select">
          <form class="form settings_form" action="/account/change_language" accept-charset="UTF-8" method="post"><input type="hidden" name="authenticity_token" value="t7vrGGV5kvtlkEceVD9dskavprxhLMjxGRe/9E0fLFnl17zAMy0NHH4w9qeHeASFHS3xTiCM55LiY1mGtdhefQ==" autocomplete="off">
            <input type="hidden" name="originating_path" id="originating_path" autocomplete="off">
            <select name="preference[language_setting]" id="preference_language_setting"><option selected="selected" value="en">English</option>
<option value="de">Deutsch</option>
<option value="es">Español</option>
<option value="fr">Français</option>
<option value="pt">Português (Brasil)</option>
<option value="it">Italiano</option>
<option value="nb">Norsk</option>
<option value="nl">Nederlands</option>
<option value="ru">Pусский</option>
<option value="sv">Svensk</option>
<option value="da">Dansk</option>
<option value="ko">한국어</option>
<option value="ja">日本語</option>
<option value="zh-CN">中文(简体)</option>
<option value="zh-TW">中文(台灣)</option></select>
</form>
        </div>
      <ul class="bars">
  <li>
    <a href="https://www.myfitnesspal.com/">Calorie Counter</a>
  </li>
  <li>
    <a href="http://blog.myfitnesspal.com">Blog</a>
  </li>
  <li>
    <a href="https://www.myfitnesspal.com/terms-of-service">Terms</a>
  </li>
  <li>
    <a href="https://www.myfitnesspal.com/privacy-policy">Privacy</a>
  </li>
  <li>
    <a href="https://www.myfitnesspal.com/welcome/contact_us">Contact Us</a>
  </li>
  <li>
    <a href="https://www.myfitnesspal.com/api">API</a>
  </li>
  <li>
    <a href="https://www.myfitnesspal.com/jobs">Jobs</a>
  </li>
  <li>
    <a href="https://community.myfitnesspal.com/en/categories/feature-suggestions-and-ideas">Feedback</a>
  </li>
  <li>
    <a href="https://www.myfitnesspal.com/welcome/guidelines">Community Guidelines</a>
  </li>
  <br>
  <li>
    <a id="sourcepoint">
    Cookie
    Preferences
</a>
  </li>
  <li>
    <a target="_blank" href="https://www.myfitnesspal.com/privacy-policy#interest-based-advertising">Ad Choices</a>
  </li>
    <li>
      <a href="https://www.myfitnesspal.com/data-usage">Do Not Sell My Personal Information</a>
    </li>
</ul>
      <p class="copy">© 2024 MyFitnessPal, Inc.</p>
      <div style="display:none;">
      </div>
    </div><!-- / #footerContent -->
  </div><!-- / #footer -->
  <div id="loginform" style="display:none;">
  <form id="fancy_login" class="form login" style="margin:0;" action="https://www.myfitnesspal.com/account/login" accept-charset="UTF-8" method="post"><input type="hidden" name="authenticity_token" value="t7vrGGV5kvtlkEceVD9dskavprxhLMjxGRe/9E0fLFnl17zAMy0NHH4w9qeHeASFHS3xTiCM55LiY1mGtdhefQ==" autocomplete="off">
  <div class="member-login">
    <h2>Member Login</h2>
    <ul>
      <li>
          <label>Username:</label>
        <input name="username" type="text" class="text" tabindex="5" value="">
      </li>
      <li>
        <label>Password:</label>
        <input name="password" type="password" class="text" tabindex="6">
      </li>
      <li>
        <input type="checkbox" name="remember_me" id="remember_me" value="1" class="checkbox" tabindex="7" checked="checked">
        <label for="remember_me">Remember me next time</label>
      </li>
      <li>
        <input class="expand-width" type="submit" value="Log In" tabindex="8">
      </li>
      <li>
        <a class="forgot-password-link" href="https://www.myfitnesspal.com/account/forgot_password">Forgot password?</a>
      </li>
      <li class="or">
        - or -
      </li>
      <li>
        <div class="fb-login-button" data-onlogin="MFP.onFBLogin();" data-max-rows="1" data-size="large" data-button-type="login_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="true">Log in with Facebook</div>
      </li>
      <li>
        Not a member yet? <a href="https://www.myfitnesspal.com/account/create?redirect_to=%2F">Sign up now!</a>
      </li>
    </ul>
  </div>
</form></div>
</section>
  <!--[if lte IE 7]></div><![endif]-->
  <!--[if IE 6]></div><![endif]-->
  
  
<iframe height="1" width="1" style="position: absolute; top: 0px; left: 0px; border: none; visibility: hidden;"></iframe>
<div id="fancybox-tmp"></div><div id="fancybox-loading"><div></div></div><div id="fancybox-overlay"></div><div id="fancybox-wrap"><div id="fancybox-outer"><div class="fancybox-bg" id="fancybox-bg-n"></div><div class="fancybox-bg" id="fancybox-bg-ne"></div><div class="fancybox-bg" id="fancybox-bg-e"></div><div class="fancybox-bg" id="fancybox-bg-se"></div><div class="fancybox-bg" id="fancybox-bg-s"></div><div class="fancybox-bg" id="fancybox-bg-sw"></div><div class="fancybox-bg" id="fancybox-bg-w"></div><div class="fancybox-bg" id="fancybox-bg-nw"></div><div id="fancybox-content"></div><a id="fancybox-close"></a><div id="fancybox-title"></div><a href="javascript:;" id="fancybox-left"><span class="fancy-ico" id="fancybox-left-ico"></span></a><a href="javascript:;" id="fancybox-right"><span class="fancy-ico" id="fancybox-right-ico"></span></a></div></div><div class="mfp-modal-overlay"></div><div id="ui-datepicker-div" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div><ins class="adsbygoogle adsbygoogle-noablate" data-adsbygoogle-status="done" style="display: none !important;"><div id="aswift_1_host" style="border: none; height: 0px; width: 0px; margin: 0px; padding: 0px; position: relative; visibility: visible; background-color: transparent; display: inline-block;"></div></ins></body></html>`;
};
export const sampleScrapingEmpty = () => {
  return `333`;
};
