/**
 * This script provides the functionality of fetching and render a specific Youtube-API @API_URL.
 * The result is a single video which corresponds to the user search input.
 * The video is only displayed if it has 5 million or more views. 
 */
const API_URL = "https://abhi-api.vercel.app/api/search/yts?text=";

// boolean if true ignore further requests
let loading = false;

/**
 * fetch data from API @url
 */ 
async function fetchData(url) {
    try {
        const response = await fetch(url);
        let jsObject = await response.json();
        return jsObject;
    } catch (e) {
        console.log(e);
        container.innerHTML = "<p>Error by fetching resource</p>";
        return [];
    }
}

/**
 * Render results from API request.
 * @param node // HTML DIV node
 * @param data // API results
 */
function renderResults(node, data) {
  // render the fetched results if the video has more than 5 million views
  if (data?.status && data.result) {
    const { title, views, uploaded, duration, description, channel, url, thumbnail } = data.result;
    if (views >= 5000000) {
     node.innerHTML = `
     <div class="results">
        <h2 class="title">${title}</h2>
        <div class="results_details_thumbnail">
          <div class="results_details">
          <p><strong>Views:</strong> ${views.toLocaleString()}</p>
          <p><strong>Channel:</strong> ${channel}</p>
          <p><strong>Uploaded:</strong> ${uploaded}</p>
          <p><strong>Duration:</strong> ${duration}</p>
        </div>
        <a href="${url}" target="_blank">
        <img class="thumbnail" src="${thumbnail}" alt="Video thumbnail" style="max-width: 100%; margin-top: 10px;"></a>
       </div>
      </div>

          <a href="/"><img src="images/switch back icon_yellow.png" alt="go back icon" class="go-back-icon-corner"></a>
    `;
    } else {
      // append HTML template
      let temp = document.querySelector("#notEnoughViews_template");
      let clon = temp.content.cloneNode(true);
      document.querySelector("main").appendChild(clon);
    }
  } else {
    node.innerHTML = "<p>No data found.</p>";
  }
}

/**
 * main function triggered by the search
 */
async function searchVid() {
    // check if already loading
    if (loading) return;
    loading = true;

    // get the search input value
    let search_string = document.querySelector("#search-input").value
    
    const main = document.querySelector("main");

    // display loading GIF
    const loadingImage = document.createElement('img');
    loadingImage.src = "/images/Loading.gif";
    loadingImage.alt = "Loading";
    loadingImage.classList.add("loading");
    main.appendChild(loadingImage);
    
    const data = await fetchData(API_URL+search_string);

    // new positions of the images
    const search_image = document.querySelector('.titel_rose');
    if (search_image) {
      search_image.classList.remove('titel_rose');
      search_image.classList.add('titel_yellow');
    }
    const fiveMillion_image = document.querySelector('.img_views');
    if (fiveMillion_image) {
      fiveMillion_image.classList.remove('img_views');
      fiveMillion_image.classList.add('img_views_after');
    }

    document.body.style.backgroundImage = "url(\"images/backround_yellow.png\")";
    // document.body.style.backgroundColor = "var(--color-light-light-yellow)";

    // remove all nodes inside the main node
    while (main.firstChild) {
        main.removeChild(main.lastChild);
    }
    // create a new node and append it inside the main node
    const node = document.createElement('article');
    main.appendChild(node);

    renderResults(node, data);

    // reset boolean - ready for new requests
    loading = false;
}

// trigger search by click or enter
document.querySelector('#search-btn').addEventListener("click", searchVid)
document.querySelector('#search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      searchVid()
    }
});
