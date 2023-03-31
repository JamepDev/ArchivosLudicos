/* Custom search engine by nanom */

const $ = e => document.getElementById(e);
const create = e => document.createElement(e);

const JSON_PATH = '/ArchivosLudicos/js/siteIndex.json';
var siteIndex = {};
var searchResults;

function addResult(result) {
  let resultEl = create('div');

  let articleURL = result.filename
    .replace('content', '/ArchivosLudicos')
    .replace('.md', '')
    .replace('_index', '')
    .replace(/ /g, '-');

  resultEl.innerHTML = `
    <h3 style="color: #fff; font-size: 1.25rem;">
    <a href="${articleURL}" style="border-bottom: 1px dotted;">
      ${result.metadata.title}
    </a>
    </h3>
    <p style="color: #bfbfbf;">
      ${result.metadata.description}
    </p>`;
  searchResults.appendChild(resultEl);
}

function clearResults() {
  while(searchResults.firstChild)
    searchResults.removeChild(searchResults.firstChild);
}

function onInput(e) {
  clearResults();
  
  let query = this.value.toLowerCase();
  let resultArr = siteIndex.filter(result =>
    result.metadata.title.toLowerCase().includes(query) ||
    result.metadata.description.toLowerCase().includes(query) ||
    result.content.toLowerCase().includes(query));
  for (result of resultArr)
    addResult(result);
}

function reloadJSON() {
  let request = new XMLHttpRequest();
  request.overrideMimeType('application/json');
  request.open('GET', JSON_PATH, true);
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status == "200")
      siteIndex = JSON.parse(request.responseText);
  };
  request.send(null);
}

function createSearchUI() {
  reloadJSON();

  let searchScreen = create('div');
  searchScreen.style.backgroundColor = 'rgba(0, 0, 0, .75)';
  searchScreen.style.zIndex = '999';
  searchScreen.style.display = 'flex';
  searchScreen.style.flexFlow = 'column';
  searchScreen.style.position = 'fixed';
  searchScreen.style.width = '100%';
  searchScreen.style.height = '100%';
  searchScreen.style.alignItems = 'center';
  searchScreen.style.justifyContent = 'center';
  searchScreen.style.padding = "1rem";

  let searchInput = create('input');
  searchInput.placeholder = 'Buscar...';
  searchInput.style.backgroundColor = 'rgba(0, 0, 0, .35)';
  searchInput.style.color = '#bfbfbf';
  searchInput.style.fontSize = '1.5rem';
  searchInput.style.borderRadius = '5px';
  searchInput.oninput = onInput;

  searchResults = create('div');
  searchResults.style.overflow = "scroll";
  searchResults.style.marginTop = "1.5em";

  document.body.addEventListener('keydown', e => {
    if (e.keyCode === 27)
      destroySearchUI(searchScreen);
    else
      searchInput.focus();
  }, true);
  searchScreen.appendChild(searchInput);
  searchScreen.appendChild(searchResults);

  document.body.appendChild(searchScreen);
  searchInput.focus();
}

const destroySearchUI = e => document.body.removeChild(e);

function initSearch() {
  let searchBtn = create('div');
  searchBtn.href = '#';
  searchBtn.style.display = 'inline-block';
  searchBtn.style.padding = '8px';
  searchBtn.style.backgroundColor = '#000';
  searchBtn.style.color = '#7c7c7c';
  searchBtn.style.borderRadius = '5px';
  searchBtn.style.fontSize = '.75rem';
  searchBtn.style.marginRight = '.5em';
  searchBtn.style.minWidth = '20em';
  searchBtn.style.cursor = 'text';
  searchBtn.style.userSelect = 'none';
  searchBtn.innerHTML = '🔍 Buscar';
  searchBtn.addEventListener('click', createSearchUI);

  let themeBtn = $('lightDarkMode');
  themeBtn.parentElement.insertBefore(searchBtn, themeBtn);
  themeBtn.style.display = 'inline';
}

window.onload = initSearch;
