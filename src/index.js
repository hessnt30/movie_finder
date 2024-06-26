// Watchmode API Key: LvE3hROZqEHgjksOuWuf8cE031aTxLUKv9xRPNM9
// https://api.watchmode.com/v1/search/?apiKey=YOUR_API_KEY&search_field=name&search_value=Ed%20Wood

const API_KEY = "LvE3hROZqEHgjksOuWuf8cE031aTxLUKv9xRPNM9";

var searchButton = document.getElementById("search-button");
searchButton.onclick = function () {
  searchMovie(document.getElementById("movie-search").value);
  const featured = document.getElementById("featured-movies");
  featured.style.display = "none";
};

var searchBar = document.getElementById("movie-search");
// Execute a function when the user presses a key on the keyboard
searchBar.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter" && searchBar.value.length > 0) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    console.log("clicked enter");
    searchMovie(searchBar.value);
  }
});

featuredMovies();
swapWords();

const uniqueNumsSet = new Set();

while (uniqueNumsSet.size !== 8) {
  uniqueNumsSet.add(Math.floor(Math.random() * 19) + 1);
}

const uniqueNums = Array.from(uniqueNumsSet);

// load 4 featured movies
function featuredMovies() {
  fetch(
    "https://api.watchmode.com/v1/releases/?apiKey=" + API_KEY + "&limit=20"
  )
    .then((response) => response.json())
    .then((data) => showFeaturedMovies(data));

  function showFeaturedMovies(data) {
    console.log(data);

    for (var i = 0; i < 4; i++) {
      console.log(uniqueNums);

      // create card element for current movie result
      const card = document.createElement("div");
      card.classList.add("featured-movie-card");
      card.id = "featured-" + uniqueNums[i];

      // add image element
      const movieImage = new Image();
      if (data.releases[uniqueNums[i]].poster_url == "") {
        movieImage.src = "../public/missingimage.jpg";
        movieImage.classList.add("featured-movie-image");
        movieImage.id = "featured-missing-image";
      } else {
        movieImage.src = data.releases[uniqueNums[i]].poster_url;
        movieImage.classList.add("featured-movie-image");
        movieImage.id = "featured-movie-image-actual";
      }

      // add title element
      var title;
      if (data.releases[uniqueNums[i]].title != null) {
        title = data.releases[uniqueNums[i]].title;
        var fullTitle = title;
      } else {
        title = "Unknown";
      }

      if (title.length > 15) {
        var shortenedTitle = "";
        for (var j = 0; j < 15; j++) {
          shortenedTitle += title.charAt(j);
        }
        title = shortenedTitle + "...";
      }

      const resultTitle = document.createElement("span");
      resultTitle.textContent = title;
      resultTitle.classList.add("featured-movie-title");
      resultTitle.id = "featured-title" + uniqueNums[i];

      // get id of movie/show
      const fullTitleNode = document.createElement("span");
      fullTitleNode.textContent = data.releases[uniqueNums[i]].title;
      fullTitleNode.classList.add("featured-movie-full-title");
      fullTitleNode.style.display = "none";

      // add year
      var year;
      if (data.releases[uniqueNums[i]].source_release_date != null) {
        year = data.releases[uniqueNums[i]].source_release_date;
      } else {
        year = "Unknown";
      }

      const resultYear = document.createElement("span");
      resultYear.textContent = year;
      resultYear.classList.add("featured-movie-year");

      // add type
      var type;

      if (data.releases[uniqueNums[i]].type == "tv_series") {
        type = "TV Series";
      } else if (data.releases[uniqueNums[i]].type == "movie") {
        type = "Movie";
      } else if (data.releases[uniqueNums[i]].type == "tv_movie") {
        type = "TV Movie";
      } else if (data.releases[uniqueNums[i]].type == "short_film") {
        type = "Short Film";
      } else if (data.releases[uniqueNums[i]].type == "tv_miniseries") {
        type = "TV Miniseries";
      } else if (data.releases[uniqueNums[i]].type == "tv_special") {
        type = "TV Special";
      } else {
        type = "Unknown";
      }

      const resultType = document.createElement("span");
      resultType.textContent = type;
      resultType.classList.add("featured-movie-type");

      // create container for title and year
      const infoContainer = document.createElement("div");
      infoContainer.classList.add("featured-movie-info");

      infoContainer.appendChild(resultYear);
      infoContainer.appendChild(resultType);

      // get id of movie/show
      const movieID = document.createElement("span");
      movieID.textContent = data.releases[uniqueNums[i]].id;
      movieID.classList.add("featured-movie-id");
      movieID.style.display = "none";

      // add image to card
      card.appendChild(movieImage);
      // add text to card
      card.appendChild(resultTitle);
      // add year and type
      card.appendChild(infoContainer);
      // add the movie id
      card.appendChild(movieID);
      // add the full title
      card.appendChild(fullTitleNode);

      // add event listener
      card.addEventListener("click", function () {
        // save title
        const clickedTitle = this.querySelector(
          ".featured-movie-full-title"
        ).textContent;
        // save movie id
        const clickedID = this.querySelector(".featured-movie-id").textContent;
        // save movie year
        const clickedYear = this.querySelector(
          ".featured-movie-year"
        ).textContent;
        // save movie type
        const clickedType = this.querySelector(
          ".featured-movie-type"
        ).textContent;
        // same movie image
        const clickedImage = this.querySelector(".featured-movie-image").src;
        inDepthMovie(
          clickedTitle,
          clickedID,
          clickedYear,
          clickedType,
          clickedImage
        );
      });

      // add card to list of results
      document.getElementById("featured-movies-list").appendChild(card);
    }
  }
}

// reconfigure to work with just regular search. people or movies
function searchMovie(movieTitle) {

  // make featured movies invisible
  var featuredMoviesContainer = document.getElementById("feature-div");
  featuredMoviesContainer.style.display = "none";

  var resultsContainer = document.getElementById("results");
  resultsContainer.style.display = "flex";

  fetch(
    "https://api.watchmode.com/v1/autocomplete-search/?apiKey=" +
      API_KEY +
      "&search_value=" +
      movieTitle +
      "&search_type=1"
  )
    .then((response) => response.json())
    .then((data) => handleData(data));

  function handleData(data) {
    document.getElementById("num-results").innerHTML = "";
    document.getElementById("search-results").innerHTML = "";
    console.log(data);
    if (data.results.length == 0) {
      const textnode = document.createTextNode("No results.");
      document.getElementById("num-results").appendChild(textnode);
      return;
    }
    // total results
    const numberOfResults = document.createTextNode(
      data.results.length.toString() + " results"
    );
    document.getElementById("num-results").appendChild(numberOfResults);

    for (var i = 0; i < data.results.length; i++) {
      // create card element for current movie result
      const card = document.createElement("div");
      card.classList.add("movie-card");
      card.id = i;

      // add image element
      const movieImage = new Image();
      if (
        data.results[i].image_url ==
        "https://cdn.watchmode.com/posters/blank.gif"
      ) {
        movieImage.src = "../public/missingimage.jpg";
        movieImage.classList.add("movie-image");
        movieImage.id = "missing-image";
      } else {
        movieImage.src = data.results[i].image_url;
        movieImage.classList.add("movie-image");
        movieImage.id = "movie-image-actual";
      }

      // add title element
      var title;
      if (data.results[i].name != null) {
        title = data.results[i].name;
        var fullTitle = title;
      } else {
        title = "Unknown";
      }

      if (title.length > 15) {
        var shortenedTitle = "";
        for (var j = 0; j < 15; j++) {
          shortenedTitle += title.charAt(j);
        }
        title = shortenedTitle + "...";
      }

      const resultTitle = document.createElement("span");
      resultTitle.textContent = title;
      resultTitle.classList.add("movie-title");
      resultTitle.id = "title" + i;

      // get id of movie/show
      const fullTitleNode = document.createElement("span");
      fullTitleNode.textContent = data.results[i].name;
      fullTitleNode.classList.add("movie-full-title");
      fullTitleNode.style.display = "none";

      // add year
      var year;
      if (data.results[i].year != null) {
        year = data.results[i].year.toString();
      } else {
        year = "Unknown";
      }

      const resultYear = document.createElement("span");
      resultYear.textContent = year;
      resultYear.classList.add("movie-year");

      // add type
      var type;

      if (data.results[i].type == "tv_series") {
        type = "TV Series";
      } else if (data.results[i].type == "movie") {
        type = "Movie";
      } else if (data.results[i].type == "tv_movie") {
        type = "TV Movie";
      } else if (data.results[i].type == "short_film") {
        type = "Short Film";
      } else {
        type = "Unknown";
      }

      const resultType = document.createElement("span");
      resultType.textContent = type;
      resultType.classList.add("movie-type");

      // create container for title and year
      const infoContainer = document.createElement("div");
      infoContainer.classList.add("movie-info");

      infoContainer.appendChild(resultYear);
      infoContainer.appendChild(resultType);

      // get id of movie/show
      const movieID = document.createElement("span");
      movieID.textContent = data.results[i].id;
      movieID.classList.add("movie-id");
      movieID.style.display = "none";

      // add image to card
      card.appendChild(movieImage);
      // add text to card
      card.appendChild(resultTitle);
      // add year and type
      card.appendChild(infoContainer);
      // add the movie id
      card.appendChild(movieID);
      // add the full title
      card.appendChild(fullTitleNode);

      // add event listener
      card.addEventListener("click", function () {
        // save title
        const clickedTitle =
          this.querySelector(".movie-full-title").textContent;
        // save movie id
        const clickedID = this.querySelector(".movie-id").textContent;
        // save movie year
        const clickedYear = this.querySelector(".movie-year").textContent;
        // save movie type
        const clickedType = this.querySelector(".movie-type").textContent;
        // same movie image
        const clickedImage = this.querySelector(".movie-image").src;
        inDepthMovie(
          clickedTitle,
          clickedID,
          clickedYear,
          clickedType,
          clickedImage
        );
      });

      // add card to list of results
      document.getElementById("search-results").appendChild(card);
    }
  }
}

function inDepthMovie(movieTitle, movieID, movieYear, movieType, movieImage) {
  console.log(movieID);

  fetch(
    "https://api.watchmode.com/v1/title/" +
      movieID +
      "/details/?apiKey=" +
      API_KEY +
      "&regions=US"
  )
    .then((response) => response.json())
    .then((data) => makeModal(data));

  // add all info to modal
  function makeModal(data) {
    console.log(data);
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // open the modal
    modal.style.display = "flex";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
      modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };

    // assign movieImage
    const modalImage = document.getElementById("modal-backdrop");
    if (data.backdrop != null) {
      modalImage.src = data.backdrop;
    } else {
      modalImage.src = movieImage;
    }

    // assign movie title
    document.getElementById("modal-movie-title").innerHTML = movieTitle;

    // assign movie info (year, type, rating, score)
    document.getElementById("modal-movie-year").innerHTML = movieYear;
    document.getElementById("modal-movie-type").innerHTML = movieType;
    if (data.critic_score != null) {
      document.getElementById("modal-rating").innerHTML = data.us_rating;
    }
    if (data.us_rating != null) {
      document.getElementById("modal-score").innerHTML = data.critic_score;
    }

    var genres = "";

    // assign movie genres
    if (data.genre_names.length > 0) {
      for (var i = 0; i < data.genre_names.length; i++) {
        genres += data.genre_names[i].toString();
        if (i < data.genre_names.length - 1) {
          genres += ", ";
        }
      }
    }

    var genresElement = document.getElementById("modal-genres");

    genresElement.innerHTML = genres;

    // assign plot overview
    if (data.plot_overview != null) {
      document.getElementById("movie-summary").innerHTML = data.plot_overview;
    } else {
      document.getElementById("movie-summary").innerHTML = "No overview.";
    }

    // modal movie id
    document.getElementById("modal-movie-id").innerHTML = movieID;

    document.getElementById("modal-movie-id").style.display = "none";

    const whereToWatch = document.getElementById("where-to-watch-wrapper");

    // add event listener
    whereToWatch.addEventListener("click", function () {
      // save movie id
      const modalClickedID =
        document.querySelector(".modal-movie-id").innerHTML;

      whereToWatchModal(modalClickedID, modal);
    });
  }
}

let whereToWatchModalTriggered = false;
let page1Shown = false;
let page2Shown = false;

function whereToWatchModal(modalClickedID, modal) {
  if (!whereToWatchModalTriggered) {
    whereToWatchModalTriggered = true;
    page1Shown = true;
    fetch(
      "https://api.watchmode.com/v1/title/" +
        modalClickedID +
        "/sources/?apiKey=" +
        API_KEY
    )
      .then((response) => response.json())
      .then((data) => makeWhereToWatchModal(data));
  }

  function makeWhereToWatchModal(data) {
    // add all unique instances of services to a set
    whereToWatchModalTriggered = false;
    console.log("function called");
    console.log(data);
    var services = new Set();
    var correspondingURL = new Array();
    var correspondingPrice = new Array();

    var URLindex = 0;
    for (var i = 0; i < data.length; i++) {
      if (!services.has(data[i].name)) {
        services.add(data[i].name);
        correspondingURL[URLindex] = data[i].web_url;
        if (data[i].price != null) {
          correspondingPrice[URLindex] = "Buy $" + data[i].price;
        } else {
          correspondingPrice[URLindex] = "Subscription";
        }

        URLindex++;
      }
    }

    // convert set to array
    const servicesList = Array.from(services);

    console.log(servicesList);

    // split array if greater than 5
    var services1 = new Array(); // array of services to be displayed on first page
    var services2 = new Array(); // array of services to be displayed on second page
    for (var i = 0; i < servicesList.length; i++) {
      if (i < 5) {
        services1[i] = servicesList[i];
      } else {
        services2[i - 5] = servicesList[i];
      }
    }

    for (var index = 0; index < 10; index++) {
      if (index < 5) {
        console.log(services1[index] + ", " + correspondingURL[index]);
      } else {
        console.log(services2[index - 5] + ", " + correspondingURL[index]);
      }
    }

    function addServices(upperBound, servicelist) {
      for (var serviceIndex = 0; serviceIndex < upperBound; serviceIndex++) {
        var currService = servicelist[serviceIndex];

        // wrapper for this service
        const thisServiceWrapper = document.createElement("div");
        thisServiceWrapper.classList.add("service-div-wrapper");
        thisServiceWrapper.id = "service-wrapper-" + i;

        // div for this service
        const thisService = document.createElement("div");
        thisService.classList.add("service-div");
        thisService.id = "service-" + i;

        thisServiceWrapper.appendChild(thisService);

        // add service icon
        const serviceIcon = new Image();
        serviceIcon.src = "../public/service-icon.png";
        serviceIcon.alt = currService;
        serviceIcon.classList.add("service-icon");
        serviceIcon.id = currService;

        thisService.appendChild(serviceIcon);

        // add Service title and if u gotta buy it or nah
        const serviceInfo = document.createElement("div");
        serviceInfo.classList.add("service-info");
        serviceInfo.id = currService + "-info";

        // add service title
        const serviceTitle = document.createElement("span");
        serviceTitle.classList.add("service-title");
        serviceTitle.id = currService + "-title";
        serviceTitle.innerHTML = currService;
        serviceInfo.appendChild(serviceTitle);

        // price
        const servicePrice = document.createElement("span");
        servicePrice.classList.add("service-price");
        servicePrice.id = currService + "-price";
        servicePrice.innerHTML = correspondingPrice[serviceIndex];
        serviceInfo.appendChild(servicePrice);

        thisService.appendChild(serviceInfo);

        // add watch button and text below
        const watchWrapper = document.createElement("div");
        watchWrapper.classList.add("service-watch-wrapper");
        watchWrapper.id = "service-watch-wrapper-" + i;

        const watchLink = document.createElement("a");
        watchLink.id = currService + "-watch-link";
        watchLink.href = correspondingURL[serviceIndex];
        watchWrapper.appendChild(watchLink);

        const watchButton = document.createElement("button");
        watchButton.classList.add("watch-button");
        watchButton.id = currService + "-watch-button";
        watchButton.textContent = "Watch";
        watchLink.appendChild(watchButton);

        thisService.appendChild(watchWrapper);

        // add new service div to list of services
        const serviceWrapper = document.getElementById("service-list");
        serviceWrapper.appendChild(thisServiceWrapper);

        const hr = document.createElement("hr");
        hr.classList.add("service-hr");
        serviceWrapper.appendChild(hr);
      }

      if (services1.length == 0) {
        // wrapper for this service
        const thisServiceWrapper = document.createElement("div");
        thisServiceWrapper.classList.add("service-div-wrapper");
        thisServiceWrapper.id = "service-wrapper-" + i;

        // div for this service
        const thisService = document.createElement("div");
        thisService.classList.add("service-div");
        thisService.id = "service-" + i;

        thisServiceWrapper.appendChild(thisService);

        // add Service title and if u gotta buy it or nah
        const serviceInfo = document.createElement("div");
        serviceInfo.classList.add("service-info");

        // add service title
        const serviceTitle = document.createElement("span");
        serviceTitle.classList.add("service-title");
        serviceTitle.id = currService + "-title";
        serviceTitle.innerHTML = "No Results";
        serviceInfo.appendChild(serviceTitle);

        thisService.appendChild(serviceInfo);

        // add new service div to list of services
        const serviceWrapper = document.getElementById("service-list");
        serviceWrapper.appendChild(thisServiceWrapper);
      }
    }

    addServices(services1.length, services1);

    // Get the modal
    var wtwModal = document.getElementById("my-wtw-modal");

    // Get the <span> element that closes the modal
    var closeButton = document.getElementsByClassName("close")[1];

    // open the modal
    wtwModal.style.display = "flex";

    const serviceWrapper = document.getElementById("service-list");

    // When the user clicks on <span> (x), close the modal
    closeButton.onclick = function () {
      wtwModal.style.display = "none";
      serviceWrapper.innerHTML = "";
      page1Shown = false;
      page2Shown = false;
      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      };
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == wtwModal) {
        wtwModal.style.display = "none";
        serviceWrapper.innerHTML = "";
        page1Shown = false;
        page2Shown = false;
        window.onclick = function (event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        };
      }
    };

    // show more button
    var showMore = document.getElementsByClassName("wtw-show-more-text")[0];

    if (servicesList.length < 6) {
      showMore.style.display = "none";
    } else {
      var showMore1 = document.getElementById("show-more-1");
      var showMore2 = document.getElementById("show-more-2");

      showMore.onclick = function (event) {
        console.log("show more clicked");
        if (page1Shown) {
          showMore2.style.color = "#108bb1";
          showMore1.style.color = "#000";
          page1Shown = false;
          page2Shown = true;
          serviceWrapper.innerHTML = "";
          addServices(services2.length, services2);
        } else if (page2Shown) {
          showMore2.style.color = "#000";
          showMore1.style.color = "#108bb1";
          page1Shown = true;
          page2Shown = false;
          serviceWrapper.innerHTML = "";
          addServices(services1.length, services1);
        }
      };
    }
  }
}

// swap words in search bar
function swapWords() {
  const words = ["Actors", "Shows", "Documentaries", "Miniseries", "Movies"];

  var favorite = document.getElementById("favorite");

  var counter = -1;

  setInterval(() => {
    counter = counter + 1;
    if (counter == 4) counter = 1;
    favorite.innerHTML = words[counter];
  }, 5000);
}
