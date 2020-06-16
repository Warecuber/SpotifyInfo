var APIController = (() => {
  function loadMyInfo() {
    console.log("Loading my info");
    $.ajax({
      url: "https://api.spotify.com/v1/me",
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("oAuth")}`,
      },
      success: function (data) {
        UIController.addMe(data);
      },
      error: function (req, err) {
        if (req.status === 400 || req.status === 401) {
          UIController.loginPage();
        } else {
          console.log(err);
        }
      },
    });
  }

  function loadMySongs() {
    console.log("Loading my stats");
    $.ajax({
      url: "https://api.spotify.com/v1/me/top/tracks",
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("oAuth")}`,
      },
      success: function (data) {
        UIController.listSongs(data.items);
      },
      error: function (req, err) {
        if (req.status === 400 || req.status === 401) {
          UIController.loginPage();
        } else {
          console.log(err);
        }
      },
    });
  }

  function loadMyArtists() {
    console.log("Loading my artists");
    $.ajax({
      url: "https://api.spotify.com/v1/me/top/artists",
      method: "GET",
      async: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("oAuth")}`,
      },
      success: function (data) {
        UIController.listArtists(data.items);
      },
      error: function (req, err) {
        if (req.status === 400 || req.status === 401) {
          UIController.loginPage();
        } else {
          console.log(err);
        }
      },
    });
  }

  function generateAPIToken() {
    console.log("Called token gen");
    let myURL = window.location.hash;
    let URLSplit = myURL.split("&");
    token = URLSplit[0].replace("#access_token=", "");
    if (
      window.location.origin == "http://localhost:5500" ||
      window.location.origin == "http://127.0.0.1:5500"
    ) {
      history.pushState(
        { urlPath: window.location.pathname },
        "",
        `http://localhost:5500`
      );
    } else {
      history.pushState(
        { urlPath: window.location.pathname },
        "",
        `https://warecuber.github.io/SpotifyInfo/`
      );
    }

    localStorage.setItem("oAuth", token);
    localStorage.setItem("loggedIn", true);
  }

  return {
    myInfo: () => {
      loadMyInfo();
    },
    mySongs: () => {
      loadMySongs();
    },
    myArtists: () => {
      loadMyArtists();
    },
    genOauth: () => {
      generateAPIToken();
    },
  };
})(UIController);

var UIController = (() => {
  const redirectURI = `https://accounts.spotify.com/en/authorize/?client_id=3a1d09a1778a487ba0a87d74c84a3b51&response_type=token&show_dialog=true&scope=user-top-read%20user-read-recently-played%20user-read-email&redirect_uri=${window.location.href}`;

  // Function to redirect to the Spotify login page
  function logMeIn() {
    window.location.href = redirectURI;
  }
  function logMeOut() {
    console.log("Called logout");
    localStorage.removeItem("oAuth");
    localStorage.removeItem("loggedIn");
    buttonToggle();
    toggleUI();
  }

  function addMyInfo(info) {
    $(".myInfo").html(`<span class='displayName'>${info.display_name}</span>`);
    $("#loggedInButton").html(`Log out ${info.email}`);
    buttonToggle();
  }

  function buttonToggle() {
    document.getElementById("LoginButton").classList.toggle("hidden");
    document.getElementById("loggedInButton").classList.toggle("hidden");
  }

  function listMySongs(list) {
    list.forEach((element) => {
      addAnItem(element, ".mySongs");
    });
  }

  function listMyArtists(list) {
    $(".myArtists").html("");
    changeTabs();
    list.forEach((element) => {
      addAnItem(element, ".myArtists");
    });
  }

  function changeTabs() {
    document.querySelector(".mySongs").classList.toggle("hidden");
    document.querySelector(".myArtists").classList.toggle("hidden");
    document.querySelector(".topSongs").classList.toggle("activeTab");
    document.querySelector(".topSongs").classList.toggle("inactiveTab");
    document.querySelector(".topArtists").classList.toggle("activeTab");
    document.querySelector(".topArtists").classList.toggle("inactiveTab");
  }

  function addAnItem(song, where) {
    let container = document.querySelector(where);
    let newSong = document.createElement("div");
    if (where === ".mySongs") {
      newSong.classList.add("songElement");
      newSong.innerHTML = `<span class='songName'><a href='${song.external_urls.spotify}' target='_Blank' class='songLink'>${song.name}</a></span><span class'songArtist'> - ${song.artists[0].name}</span><br><br><div class='songMedia'><audio controls class='songPreview'><source src='${song.preview_url}'></audio><img src='${song.album.images[0].url}' class='songImg'></div>`;
      container.insertAdjacentElement("beforeend", newSong);
    } else if (where === ".myArtists") {
      newSong.classList.add("artistElement");
      newSong.innerHTML = `<span class='artistName'><a href='${song.external_urls.spotify}' class='artistLink' target="_Blank">${song.name}</a><img src='${song.images[0].url}' class='artistImg'></span>`;
      container.insertAdjacentElement("beforeend", newSong);
    }
  }

  function loadPage() {
    if (window.location.hash) {
      APIController.genOauth();
    }
    if (localStorage.getItem("loggedIn") === 'true') {
      APIController.myInfo();
      APIController.mySongs();
      toggleUI();
    }
    //event listeners
    $(".loginButton").on("click", logMeIn);
    $(".logOutButton").on("click", logMeOut);
    $(".topArtists").on("click", checkArtistContent);
    $(".topSongs").on("click", checkSongContent);
  }

  function checkArtistContent() {
    var content = document.querySelector(".myArtists").innerHTML;
    if (content === "load") {
      APIController.myArtists();
    } else {
      changeTabs();
    }
  }
  function checkSongContent() {
    var content = document.querySelector(".topSongs");
    if (!content.classList.contains("activeTab")) {
      changeTabs();
    }
  }

  function toggleUI() {
    document.querySelector(".infoBody").classList.toggle("hidden");
    document.querySelector(".completedBody").classList.toggle("hidden");
  }

  return {
    loginPage: () => {
      logMeIn();
    },
    addMe: (info) => {
      addMyInfo(info);
    },
    listSongs: (list) => {
      listMySongs(list);
    },
    listArtists: (list) => {
      listMyArtists(list);
    },
    onLoad: () => {
      loadPage();
    },
  };
})(APIController);

UIController.onLoad();
