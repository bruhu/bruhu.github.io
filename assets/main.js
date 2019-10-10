// const tracksEl = document.querySelector('.tracks')

class TrackList {
  // Creating our Class
  constructor(domSelector) {
    // Getting a dom element
    this.container = document.querySelector(domSelector);
    // Store my data
    this.data = null;
    // Represents the currently displayed data
    this.viewData = null;

    // Show stuff
    this.render();
  }

  modViewData(newData) {
    this.viewData = newData;
    this.render();
  }

  template(music) {
    // Mapping over data and returning HTML String
    // For now we just assume that all data is there and that it is
    // from datatype string
    // TODO: create a template function
    return music
      .map(track => {
        // !!! -> figure out later how to make "Album only" show up
        let singleTrackPrice = track.trackPrice + "" + track.currency;
        if (track.trackPrice <= 0) {
          singleTrackPrice = "Album Only";
        }

        return `
        <div class="row rowEffect">
          <div class="coverimgcontainer"><img class="coverimg" src="${track.artworkUrl100}"</img></div>
          <div>${track.trackName}</div>
          <div>${track.artistName}</div>
          <div>${singleTrackPrice}</div>
          <div class="playPauseContainer">          
          <i class="far fa-play-circle" id="${track.trackId} playButton"></i>
          <i class="far fa-pause-circle" id="${track.trackId} pauseButton"></i>
          </div>
        </div>
    `;
      })
      .join("");
  }

  updateData(data) {
    // Store my data
    this.data = data;
    // Represents the currently displayed data
    this.viewData = data;

    this.render();
  }

  defaultTemplate() {
    return `
    <div class="defTemplateMessage">Type something to find your music!</div>
    `;
  }

  //SORT: method - doesn't need function here bc it's inside the class

  /*
    sortPricing(sortType) {
      // TODO: Create a Method to sort by pricing
      if (sortType === "trackSort") {
        // actual sorting
        this.modViewData(this.sortByAlphabet(this.data, "trackName"))
      } else if (sortType === "priceSort") {
        this.modViewData(this.sortByPrice(this.data, "trackPrice"))
      } else if (sortType === "artistSort") {
        this.modViewData(this.sortByAlphabet(this.data, "artistName"))
      }
    }
    */

  sortArtist() {
    const isAlphabetic = this.isSorted(this.viewData, "artistName");
    console.log(
      !isAlphabetic
        ? "Not Alphabetically -> sort Alphabetically"
        : isAlphabetic
        ? "It's Alphabetically -> reverse order"
        : ""
    );
    const newData = !isAlphabetic
      ? this.sortByAlphabet(this.data, "artistName")
      : isAlphabetic
      ? this.viewData.reverse()
      : "";
    this.modViewData(newData);
  }

  sortTrack() {
    const isAlphabetic = this.isSorted(this.viewData, "trackName");
    console.log(
      !isAlphabetic
        ? "Not Alphabetically -> sort Alphabetically"
        : isAlphabetic
        ? "It's Alphabetically -> reverse order"
        : ""
    );
    const newData = !isAlphabetic
      ? this.sortByAlphabet(this.data, "trackName")
      : isAlphabetic
      ? this.viewData.reverse()
      : "";
    this.modViewData(newData);
  }

  isSorted(array, prop) {
    //change 1 for another number and it will magically work
    return array.slice(6).every((item, i) => array[i][prop] <= item[prop]);
  }

  sortPrice() {
    // Sort by trackPrice
    // sorts the Array if all the tracks have the same price, don't let it confuse you, the function works
    const isAscending = this.isSorted(this.viewData, "trackPrice");
    console.log(
      !isAscending
        ? "Not ASC -> sort ASC"
        : isAscending
        ? "It's ASC -> sort Desc"
        : ""
    );
    const newData = !isAscending
      ? this.viewData.sort((a, b) => a.trackPrice - b.trackPrice)
      : isAscending
      ? this.viewData.reverse()
      : "";
    this.modViewData(newData);
  }

  sortByPrice(data) {
    // data = data || []
    // //console.log(data)
    // const sorted = data.sort((a, b) => {
    //   a[property] - b[property]
    // })
    // return sorted

    // Sort by trackPrice
    const isAscending = this.isSorted(this.viewData, "trackPrice");
    console.log(
      !isAscending
        ? "Not ASC -> sort ASC"
        : isAscending
        ? "It's ASC -> sort Desc"
        : ""
    );
    const sorted = !isAscending
      ? data.sort((a, b) => a.trackPrice - b.trackPrice)
      : isAscending
      ? this.viewData.reverse()
      : "";
    return sorted;
  }

  sortByAlphabet(data, property) {
    data = data || [];
    //console.log(data)
    const sorted = data.sort((a, b) => {
      //a[property] instead of a.trackName so it can be both track and artist - we used square brackets because in sortByAlphabet("artistName") the thing between brackets is a string and not a variable

      let nameA;
      let nameB;
      if (a[property] && b[property]) {
        nameA = a[property].toUpperCase();
        nameB = b[property].toUpperCase();
      } else {
        nameA = a[property];
        nameB = b[property];
      }

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    return sorted;
  }

  render() {
    // Out put will hold the complete view
    let output = "";

    // Setting up data for our view
    const header = "<h3>Data from iTunes Library</h3>";
    // template method accepts data to view and returns html string
    const template =
      this.viewData &&
      (Array.isArray(this.viewData) && this.viewData.length > 0)
        ? this.template(this.viewData)
        : this.defaultTemplate();
    // Adding data in to our view !Order Matters!
    output += header;
    // counter
    output +=
      this.viewData &&
      (Array.isArray(this.viewData) && this.viewData.length > 0)
        ? `<p><i class="fab fa-itunes-note"></i> Your search has ${this.viewData.length} results.</p>`
        : " ";
    output +=
      '<div class="row th"><div id="cover" >Cover</div><div id="track" >Track</div><div id="artist">Artist</div><div id="price">Price</div><div id="preview" >Preview</div></div>';
    output += template;
    // Assigning view in to innerHTML of our domElement form the constructor
    this.container.innerHTML = output;

    // EventListener for the toggle filters
    document
      .querySelector("#price")
      .addEventListener("click", () => this.sortPrice());
    document
      .querySelector("#artist")
      .addEventListener("click", () => this.sortArtist());
    document
      .querySelector("#track")
      .addEventListener("click", () => this.sortTrack());

    // Create event listeners for any play-button
    let playLinks = document.querySelectorAll(".fa-play-circle");
    let data = this.data;
    playLinks.forEach(function(link) {
      link.addEventListener("click", function(event) {
        console.log(`Playing ${event.target.id}`);
        // Retrieve the data for the selected track
        let myTrack = data.filter(track => track.trackId == event.target.id);
        // Create an audio player for the selected track
        document.querySelector(
          "#play"
        ).innerHTML = `<audio id="player_${event.target.id}" src="${myTrack[0].previewUrl} "></audio>`;
        document.querySelector(`#player_${event.target.id}`).play();
      });
    });

    // Create event listeners for any pause button
    let pauseLinks = document.querySelectorAll(".fa-pause-circle");
    pauseLinks.forEach(link => {
      link.addEventListener("click", () => {
        //Select and stop the running audio player
        let sounds = document.querySelector("audio");
        sounds.pause();
        console.log("Stop music!");
      });
    });
  }
}

const myTrackList = new TrackList("#tracks");

// input changes
const search = event => {
  // prevent default is explicit for submitting
  event.preventDefault();
  // getting the value from input
  const searchQuery = searchInput.value;
  console.log(searchQuery);
  //starts searching when sbd types more than 3 characters in a row
  if (searchQuery.length > 3) {
    getDataFromServer(searchQuery);
  }
};

const searchInput = document.querySelector("#searchInput");
const searchForm = document.querySelector("#searchForm");
searchForm.onsubmit = search;

// searchInput.onkeypress = search

const getDataFromServer = search => {
  console.log("Search for: ", search);

  const url = `https://dci-fbw12-search-itunes.now.sh/?term=${search}&media=music`;
  // const req = new XMLHttpRequest()
  // req.open("GET", url, true)
  // req.responseType = "json"
  // req.onload = function() {
  //   var jsonResponse = req.response
  //   // console.log(jsonResponse.results)
  // myTrackList.updateData(jsonResponse.results)
  fetch(url)
    .then(response => {
      console.log(response);
      return response.json();
    })
    .then(data => {
      //we passed data.results in the updateData function so it fetches the data from the URL and renders
      //data is the object, data.results is an array where the information we want is living
      myTrackList.updateData(data.results);
    })
    .catch(function(err) {
      console.log("Something went wrong!", err);
    });

  // do something with jsonResponse
};
//we don't need that with the promise
// req.send(null)

/*SORT:
const sortDropDown = document.querySelector("#pickSortValue")
sortDropDown.oninput = function (e) {
  const typeOfSorting = e.target.value
  myTrackList.sortPricing(typeOfSorting)
}*/
