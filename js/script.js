'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTagLink: Handlebars.compile(document.querySelector('#template-article-tag-link').innerHTML),
  articleAuthorLink: Handlebars.compile(document.querySelector('#template-article-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorsListLink: Handlebars.compile(document.querySelector('#template-authors-list-link').innerHTML),
};

const optTitleSelector = '.post-title',
  optArticleAuthorSelector = '.post .post-author',
  optCloudClassPrefix  = 'tag-size-',
  authorsListSelector = '.authors';

/* Drzewo kodu */

const opts = {
  tagSizes: {
    count: 5,
    classPrefix: 'tag-size-',
  },
};

const select = {
  all: {
    articles: '.post',
    linksTo: {
      title: '.post-title',
      tags: 'a[href^="#tag-"]',
      authors: 'a[href^="#author-"]',
    },
  },
  article: {
    tags: '.post-tags .list',
    author: '.post-author',
  },
  listOf: {
    titles: '.titles',
    tags: '.tags.list',
    authors: '.authors.list',
  },
};

const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');
  console.log(event);

  /*remove class 'active' from all article links*/
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  /*add class 'active' to the clicked link*/
  clickedElement.classList.add('active');

  console.log('clickedElement (with plus): ' + clickedElement);

  /*remove class 'active' from all articles*/
  const activeArticles = document.querySelectorAll(select.all.articles);

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /*get 'href' attribute from the clicked link*/
  const articleSelector = clickedElement.getAttribute('href');
  console.log(articleSelector);

  /*find the correct article using the selector (value of 'href' attribute)*/
  const targetArticle = document.querySelector(articleSelector);
  console.log(targetArticle);

  /*add class 'active' to the correct article*/
  targetArticle.classList.add('active');
  console.log('clickedElement (with plus): ' + targetArticle);

};

function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList */
  const titleList = document.querySelector(select.listOf.titles);
  function clearTitleList() {
    titleList.innerHTML = '';
  }
  clearTitleList();

  /* for each article */
  const articles = document.querySelectorAll(select.all.articles + customSelector);
  console.log(select.all.articles + customSelector);

  let html = '';

  for(let article of articles) {
    console.log(article);

    /*get the article id*/
    const articleId = article.getAttribute('id');
    console.log(articleId);

    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    console.log(articleTitle);

    /* get the title from the title element */

    /* create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    console.log(linkHTML);

    /* insert link into titleList */
    html = html + linkHTML;
    console.log(html);
  }
  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');
  console.log(links);

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }

}

generateTitleLinks();

function calculateTagsParams(tags) {

  const params = {
    max: 0,
    min: 999999
  };

  console.log(params);

  for (let tag in tags) {
    if(tags[tag] > params.max) {
      params.max = tags[tag];
    }

    if(tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;

}

calculateTagsParams();

function generateTags(){

  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  console.log(allTags);

  /* find all articles */
  const articles = document.querySelectorAll(select.all.articles);
  console.log(articles);

  /* START LOOP: for every article: */
  for(let article of articles) {

    /* find tags wrapper */
    const tagsWrapper = article.querySelector(select.article.tags);
    console.log(tagsWrapper);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    console.log(articleTags);

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    console.log(articleTagsArray);

    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){

      /* generate HTML of the link */
      const tagHTMLData = {id: tag, title: tag};
      const linkHTML = templates.articleTagLink(tagHTMLData);
      //const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      console.log(linkHTML);

      /* add generated code to html variable */
      html = html + linkHTML + ' ';

      /* [NEW] check if this link is NOT already in allTags */

      if(!allTags[tag]) {

        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

    /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;

  /* END LOOP: for every article: */
  }

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(select.listOf.tags);
  console.log(tagList);

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);

  /* [NEW] create variable for all links HTML code */
  const allTagsData = {tags: []};
  console.log(allTagsData);

  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){

    /* [NEW] generate code of a link and add it to allTagsHTML */
    //allTagsHTML += '<li><a href="#tag-' + tag + '" class="' + optCloudClassPrefix + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + ' (' + allTags[tag] + ') ' + '</a></li>';
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });

    /* [NEW] END LOOP: for each tag in allTags: */
  }

  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);

}

generateTags();

function calculateTagClass(count, params) {
  console.log(count, params);

  const normalizedCount = count - params.min;

  const normalizedMax = params.max - params.min;

  const percantage = normalizedCount / normalizedMax;

  const classNumber = Math.floor( percantage * (opts.tagSizes.count - 1) + 1);

  return classNumber;

}

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log(clickedElement);

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  console.log(activeTags);

  /* START LOOP: for each active tag link */
  for(let activeTag of activeTags){

    /* remove class active */
    activeTag.classList.remove('active');

  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]' );
  console.log(tagLinks);
  /* START LOOP: for each found tag link */
  for(let tagLink of tagLinks){

    /* add class active */
    tagLink.classList.add('active');

  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const allTagsLinks = document.querySelectorAll(select.all.linksTo.tags);
  console.log(allTagsLinks);

  /* START LOOP: for each link */
  for(let allTagLink of allTagsLinks){

    /* add tagClickHandler as event listener for that link */
    allTagLink.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors(){

  /* [NEW] create a new variable allAuthors with an empty object */
  let allAuthors = {};
  console.log(allAuthors);

  // Wyszukanie wszystkich artykułów
  const articles = document.querySelectorAll(select.all.articles);

  // Pętla dla artykułów
  for(let article of articles) {

    /* [DONE] make html variable with empty string */
    let html = '';

    // Wrapper dla autorów
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    console.log(authorWrapper);

    // Tagi dla autorów
    const authorTag = article.getAttribute('data-author');
    console.log(authorTag);

    // Zbudowanie linku
    const authorLink = '<p class="post-author">by <a href="#author-' + authorTag + '">' + authorTag + '</a></p>';
    console.log(authorLink);

    /* [DONE] add generated code to html variable */
    html = html + authorLink;

    /* [NEW] check if this link is NOT already in allAuthors */

    if(!allAuthors[authorTag]) {

      /* [NEW] add author to allAuthors object */

      allAuthors[authorTag] = 1;
    }
    else {
      allAuthors[authorTag]++;
    }

    // Dodanie linku z autorem
    authorWrapper.innerHTML=authorLink;

  // Koniec pętli
  }

  /* [NEW] find list of authors in right column */
  const authorList = document.querySelector(authorsListSelector);
  console.log(authorsListSelector);

  /* [NEW] create variable fo allAuthors links */
  const allAuthorsHtml = {authors: []};

  /* [NEW] start loop for each author in allAuthors */
  for(let author in allAuthors) {

    /*[NEW] generate code of a link and add it to allAuthorsHtml */
    allAuthorsHtml.authors.push({
      author: author,
      count: allAuthors[author],
    });

    //allAuthorsHtml += '<li><a href="#author-' + author + '"><span class="author-name">' + author + '('+ allAuthors[author] + ')</span></a><li>';

    /* [NEW] END LOOP: for each author in allAuthors: */
  }

  /*[NEW] add HTML from allAuthorsHtml to authorList */
  authorList.innerHTML = templates.authorsListLink(allAuthorsHtml);
  console.log(allAuthorsHtml);

}

generateAuthors();

function authorClickHandler(event){

  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  console.log(clickedElement);

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */
  const author = href.replace('#author-', '');

  /* find all tag links with class active */
  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
  console.log(activeAuthors);

  /* START LOOP: for each active tag link */
  for(let activeAuthor of activeAuthors){

    /* remove class active */
    activeAuthor.classList.remove('active');

  /* END LOOP: for each active tag link */
  }

  /* find all author links with "href" attribute equal to the "href" constant */
  const authorLinks = document.querySelectorAll('a[href="' + href + '"]' );
  console.log(authorLinks);

  /* START LOOP: for each found tag link */
  for(let authorLink of authorLinks){

    /* add class active */
    authorLink.classList.add('active');

  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {

  /* find all links to authors */
  const authorLinks = document.querySelectorAll('a[href^="#author-"]');

  /* START LOOP: for each link */
  for (let authorLink of authorLinks) {

    /* add tagClickHandler as event listener for that link */
    authorLink.addEventListener('click', authorClickHandler);

    /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();
