/**
 * Created by hangeonho on 2018. 8. 14..
 */
import fs from "fs";
import * as showdown from "showdown";

import "./style.scss";

// parsers
const markdownToHTMLStringParser = new showdown.Converter();
const stringToHTMLparser = new DOMParser();

// util
const getTimeText = raw => {
  let textList = raw.split(" ~ ");
  let result = "";
  for (let i = 0; i < textList.length; i++) {
    if (i !== 0) {
      result += " ~ ";
    }
    result += textList[i].slice(0, 4);
    result += ". ";
    result += textList[i].slice(4, 6);
    result += ". ";
    result += textList[i].slice(6, 8);
  }
  return result;
};

// fixed article length
const article_length = 8;

// resume sections
const resume_section_ids = [
  "resume_section_experiences",
  "resume_section_educations",
  "resume_section_projects",
  "resume_section_skill_sets"
];
const resume_sections = [];
for (let resume_section_id of resume_section_ids) {
  resume_sections.push(document.getElementById(resume_section_id));
}

// resume articles
const resume_articles = [];
for (let resume_section of resume_sections) {
  resume_articles.push(resume_section.getElementsByTagName("article")[0]);
  resume_articles.push(resume_section.getElementsByTagName("article")[1]);
}

// read resume data from file
const resume = fs.readFileSync(__dirname + "/resume articles.md", "utf8");
const parsedResume = stringToHTMLparser.parseFromString(
  markdownToHTMLStringParser.makeHtml(resume),
  "text/html"
);
const article_titles = parsedResume.getElementsByTagName("h3");
const article_contents = parsedResume.getElementsByTagName("ul");

for (let i = 0; i < article_length; i++) {
  let article_title = article_titles[i].innerText;
  let article_content = article_contents[i].getElementsByTagName("li");
  let article_time = getTimeText(article_content[0].innerText);
  let article_first_explanation = article_content[1].innerText;
  let article_second_explanation = article_content[2].innerText;
  let article_link = article_contents[i].getElementsByTagName("a")[0];

  let article_innerHTML = "";
  article_innerHTML += `<h1>${article_title}</h1>`;
  article_innerHTML += `<time>${article_time}</time>`;
  article_innerHTML += `<p>${article_first_explanation}</p>`;
  article_innerHTML += `<p>${article_second_explanation}</p>`;
  if (article_link) {
    article_innerHTML += `<a href="${article_link.href}">${
      article_link.innerText
    }</a>`;
  }

  resume_articles[i].getElementsByTagName(
    "main"
  )[0].innerHTML += article_innerHTML;
}
