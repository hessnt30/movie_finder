// Watchmode API Key: LvE3hROZqEHgjksOuWuf8cE031aTxLUKv9xRPNM9 
// https://api.watchmode.com/v1/search/?apiKey=YOUR_API_KEY&search_field=name&search_value=Ed%20Wood

const API_KEY = 'LvE3hROZqEHgjksOuWuf8cE031aTxLUKv9xRPNM9';

var searchButton = document.getElementById('search-button');
searchButton.onclick = function(){
    searchMovie(document.getElementById('movie-search').value);
};

// reconfigure to work with just regular search. people or movies
function searchMovie(movieTitle){

    var resultsContainer = document.getElementById("results");
    resultsContainer.style.display = "flex";

    fetch('https://api.watchmode.com/v1/autocomplete-search/?apiKey=' + API_KEY + 
    '&search_value=' + movieTitle + '&search_type=1')
    .then(response => response.json())
    .then(data => handleData(data));

    function handleData(data){
        document.getElementById("num-results").innerHTML = "";
        document.getElementById("search-results").innerHTML = "";
        console.log(data);
        if (data.results.length == 0){
            const textnode = document.createTextNode("No results.");
            document.getElementById("num-results").appendChild(textnode);
            return;
        }
        // total results 
        const numberOfResults = document.createTextNode(data.results.length.toString() + " results");
        document.getElementById("num-results").appendChild(numberOfResults);

        for (var i = 0; i < data.results.length; i++){
            
            // create card element for current movie result
            const card = document.createElement("div");
            card.classList.add("movie-card");
            card.id = i;

            // add image element
            const movieImage = new Image();
            if (data.results[i].image_url == "https://cdn.watchmode.com/posters/blank.gif"){
                movieImage.src = "./missingimage.jpg"
                movieImage.classList.add("missing-image");
            } else {
                movieImage.src = data.results[i].image_url;
                movieImage.classList.add("movie-image");
            }

            // add title element
            var title;
            if (data.results[i].name != null){
                title = data.results[i].name;
                var fullTitle = title;
            } else {
                title = "Unknown";
            }

            if (title.length > 15){
                var shortenedTitle = "";
                for(var j = 0; j < 15; j++){
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
            fullTitleNode.classList.add('movie-full-title');
            fullTitleNode.style.display = "none";

            // add year 
            var year;
            if (data.results[i].year != null){
                year = data.results[i].year.toString();
            } else {
                year = "Unknown";
            }

            const resultYear = document.createElement("span");
            resultYear.textContent = year;
            resultYear.classList.add("movie-year");

            // add type
            var type;

            if (data.results[i].type == 'tv_series'){
                type = "TV Series";
            } else if (data.results[i].type == 'movie'){
                type = "Movie";
            } else if (data.results[i].type == "tv_movie"){
                type = "TV Movie";
            } else if (data.results[i].type == "short_film"){
                type = "Short Film";
            } else {
                type = "Unknown"
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
            movieID.classList.add('movie-id');
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
            card.addEventListener('click', function(){
                // save title
                const clickedTitle = this.querySelector('.movie-full-title').textContent;
                // save movie id
                const clickedID = this.querySelector('.movie-id').textContent;
                // save movie year
                const clickedYear = this.querySelector('.movie-year').textContent;
                // save movie type
                const clickedType = this.querySelector('.movie-type').textContent;
                inDepthMovie(clickedTitle, clickedID, clickedYear, clickedType);
            });

            // add card to list of results
            document.getElementById("search-results").appendChild(card);
        }
    }
}

function inDepthMovie(movieTitle, movieID, movieYear, movieType){
    console.log(movieID);

    fetch("https://api.watchmode.com/v1/title/" + movieID + "/details/?apiKey=" + API_KEY +"&regions=US")
    .then(response => response.json())
    .then(data => makeModal(data));

    // add all info to modal
    function makeModal(data){
        console.log(data);
        // Get the modal
        var modal = document.getElementById("myModal");

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // open the modal
        modal.style.display = "flex";

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
        modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        // assign movieImage
        const modalImage = document.getElementById("modal-backdrop");
        modalImage.src = data.backdrop;

        // assign movie title
        document.getElementById("modal-movie-title").innerHTML = movieTitle;

        // assign movie info (year, type, rating, score)
        document.getElementById("modal-movie-year").innerHTML = movieYear;
        document.getElementById("modal-movie-type").innerHTML = movieType;
        if (data.critic_score != null) { document.getElementById("modal-rating").innerHTML = data.us_rating; }
        if (data.us_rating != null) { document.getElementById("modal-score").innerHTML = data.critic_score; }

        var genres = "";

        // assign movie genres
        if (data.genre_names.length > 0){
            for (var i = 0; i < data.genre_names.length; i++){
                genres += data.genre_names[i].toString();
                if (i < data.genre_names.length - 1){
                    genres += ", ";
                }
            }
        }

        var genresElement = document.getElementById("modal-genres");

        genresElement.innerHTML = genres;

        // assign plot overview
        if (data.plot_overview != null){
            document.getElementById("movie-summary").innerHTML = data.plot_overview;
        } else {
            document.getElementById("movie-summary").innerHTML = "No overview.";
        }

        // modal movie id
        document.getElementById("modal-movie-id").innerHTML = movieID;

        document.getElementById("modal-movie-id").style.display = "none";

        const whereToWatch = document.getElementById("where-to-watch-wrapper");

        // add event listener
        whereToWatch.addEventListener('click', function(){
            // save movie id
            const modalClickedID = document.querySelector('.modal-movie-id').innerHTML;

            whereToWatchModal(modalClickedID);
        });
    }
}

function whereToWatchModal(modalClickedID){
    fetch("https://api.watchmode.com/v1/title/" + modalClickedID + "/sources/?apiKey=" + API_KEY)
    .then(response => response.json())
    .then(data => makeWhereToWatchModal(data));

    function makeWhereToWatchModal(data){
        var services = new Set();

        for (var i = 0; i < data.length; i++){
            if (!services.has(data[i].name)){
                services.add(data[i].name);
            }
        }
        
        services.forEach((element) => {
            console.log(element);
        });
    }
}