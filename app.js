var APIController = (() => {
  function loadMyInfo() {
    console.log("Loading my info...");
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
    console.log("Loading my stats...");
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
        } else if (req.status === 429) {
          UIController.error(
            "Error: Too many requests. Please try again in a few minutes."
          );
        } else {
          UIController.error("Sorry, something went wrong. Please try again.");
        }
      },
    });
  }

  function loadMyArtists() {
    console.log("Loading my artists...");
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
        } else if (req.status === 429) {
          UIController.error(
            "Error: Too many requests. Please try again in a few minutes."
          );
        } else {
          UIController.error("Sorry, something went wrong. Please try again.");
        }
      },
    });
  }

  function loadMyPlaylists() {
    console.log("Loading my playlists...");
    $.ajax({
      url: "https://api.spotify.com/v1/me/playlists?limit=20&offset=0",
      method: "GET",
      async: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("oAuth")}`,
      },
      success: function (data) {
        UIController.listPlaylists(data.items);
      },
      error: function (req, err) {
        if (req.status === 400 || req.status === 401) {
          UIController.loginPage();
        } else if (req.status === 429) {
          UIController.error(
            "Error: Too many requests. Please try again in a few minutes."
          );
        } else {
          UIController.error("Sorry, something went wrong. Please try again.");
        }
      },
    });
  }

  function playThisPlaylist(playlistID) {
    console.log("Starting playlist...");
    $.ajax({
      url: `https://api.spotify.com/v1/me/player/play?device_id=${localStorage.getItem(
        "deviceID"
      )}`,
      method: "PUT",
      async: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("oAuth")}`,
      },
      data: JSON.stringify({
        context_uri: playlistID,
      }),
      success: function (data) {
        console.log("Playing new playlist");
      },
      error: function (req, err) {
        if (req.status === 400 || req.status === 401) {
          UIController.loginPage();
        } else if (req.status === 429) {
          UIController.error(
            "Error: Too many requests. Please try again in a few minutes."
          );
        } else {
          UIController.error("Sorry, something went wrong. Please try again.");
        }
      },
    });
  }

  function loadCurrentlyPlaying() {
    console.log("Loading currently playing...");
    $.ajax({
      url: "https://api.spotify.com/v1/me/player/currently-playing",
      method: "GET",
      async: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("oAuth")}`,
      },
      success: function (data) {
        if (data) {
          UIController.currentlyPlaying(data);
        } else {
          UIController.currentlyPlaying({
            is_playing: false,
            item: {
              name: "Nothing is playing",
              artists: [{ name: "None" }],
            },
          });
        }
      },
      error: function (req, err) {
        if (req.status === 400 || req.status === 401) {
          UIController.loginPage();
        } else if (req.status === 429) {
          UIController.togglePlayer();
          UIController.error(
            "Error: Too many requests. Please try again in a few minutes."
          );
        } else {
          UIController.togglePlayer();
          UIController.error("Sorry, something went wrong. Please try again.");
        }
      },
    });
  }

  function pauseSong() {
    console.log("Pause");
    $.ajax({
      url: "https://api.spotify.com/v1/me/player/pause",
      method: "PUT",
      async: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("oAuth")}`,
      },
      success: function (data) {
        // UIController.listCurrentInfo(data.items);
        console.log("Paused");
      },
      error: function (req, err) {
        if (req.status === 400 || req.status === 401) {
          UIController.loginPage();
        } else if (req.status === 429) {
          UIController.error(
            "Error: Too many requests. Please try again in a few minutes."
          );
        } else {
          UIController.error("Sorry, something went wrong. Please try again.");
        }
      },
    });
  }

  function playSong() {
    $.ajax({
      url: "https://api.spotify.com/v1/me/player/play",
      method: "PUT",
      async: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("oAuth")}`,
      },
      success: function (data) {
        console.log("Play");
        // UIController.listCurrentInfo(data.items);
      },
      error: function (req, err) {
        if (req.status === 400 || req.status === 401) {
          UIController.loginPage();
        } else if (req.status === 429) {
          UIController.error(
            "Error: Too many requests. Please try again in a few minutes."
          );
        } else if (req.status === 404 || req.status === 403) {
          changePlayer();
        } else {
          UIController.error("Sorry, something went wrong. Please try again.");
        }
      },
    });
  }

  function changePlayer() {
    console.log("Changed player");
    $.ajax({
      url: "https://api.spotify.com/v1/me/player",
      method: "PUT",
      async: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("oAuth")}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        device_ids: [localStorage.getItem("deviceID")],
      }),
      success: function () {
        playSong();
      },
      error: function (req, err, data) {
        if (req.status === 400 || req.status === 401) {
          UIController.loginPage();
        } else if (req.status === 429) {
          UIController.error(
            "Error: Too many requests. Please try again in a few minutes."
          );
        } else {
          UIController.error("Sorry, something went wrong. Please try again.");
        }
      },
    });
  }

  function checkPlayer() {
    console.log("Checking player...");
    $.ajax({
      url: "https://api.spotify.com/v1/me/player",
      method: "get",
      async: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("oAuth")}`,
        "Content-Type": "application/json",
      },
      success: function (data) {
        if (data) {
          // console.log(data);
          document.querySelector(".playerVolume").value =
            data.device.volume_percent;
        }
        // console.log(data);
        if (data.device.id != localStorage.getItem("deviceId")) {
          let el = document.createElement("div");
          el.innerHTML = `Now playing on ${data.device.name}`;
          el.classList.add("playerName");
          document
            .querySelector(".controls")
            .insertAdjacentElement("afterend", el);
        }
      },
      error: function (req, err, data) {
        if (req.status === 400 || req.status === 401) {
          UIController.loginPage();
        } else if (req.status === 429) {
          UIController.error(
            "Error: Too many requests. Please try again in a few minutes."
          );
        } else {
          UIController.error("Sorry, something went wrong. Please try again.");
        }
      },
    });
  }

  function skipSong() {
    console.log("Skipped Song");
    $.ajax({
      url: `https://api.spotify.com/v1/me/player/next?device_id=${localStorage.getItem(
        "deviceID"
      )}`,
      method: "POST",
      async: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("oAuth")}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        device_ids: [localStorage.getItem("deviceID")],
      }),
      success: function () {
        playSong();
      },
      error: function (req, err, data) {
        if (req.status === 400 || req.status === 401) {
          UIController.loginPage();
        } else if (req.status === 429) {
          UIController.error(
            "Error: Too many requests. Please try again in a few minutes."
          );
        } else {
          UIController.error("Sorry, something went wrong. Please try again.");
        }
      },
    });
  }

  function addSongNext(uri) {
    $.ajax({
      url: `https://api.spotify.com/v1/me/player/queue?uri=${uri}`,
      method: "POST",
      async: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("oAuth")}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      success: function (data) {
        UIController.info("Added song to queue.");
      },
      error: function (req, err) {
        if (req.status === 400 || req.status === 401) {
          UIController.loginPage();
        } else if (req.status === 429) {
          UIController.error(
            "Error: Too many requests. Please try again in a few minutes."
          );
        } else if (req.status === 404) {
          changePlayer();
        } else {
          UIController.error("Sorry, something went wrong. Please try again.");
        }
      },
    });
  }

  function changeVolume(value) {
    $.ajax({
      url: `https://api.spotify.com/v1/me/player/volume?volume_percent=${value}`,
      method: "PUT",
      async: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("oAuth")}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      success: function (data) {
        console.log(`volume set to ${value}%`);
      },
      error: function (req, err) {
        if (req.status === 400 || req.status === 401) {
          UIController.loginPage();
        } else if (req.status === 429) {
          UIController.error(
            "Error: Too many requests. Please try again in a few minutes."
          );
        } else if (req.status === 404) {
          changePlayer();
        } else {
          // UIController.error("Sorry, something went wrong. Please try again.");
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
    myPlaylists: () => {
      loadMyPlaylists();
    },
    playThis: (id) => {
      playThisPlaylist(id);
    },
    genOauth: () => {
      generateAPIToken();
    },
    currentlyPlaying: () => {
      loadCurrentlyPlaying();
    },
    pause: () => {
      pauseSong();
    },
    play: () => {
      playSong();
    },
    check: () => {
      checkPlayer();
    },
    playerSwitch: () => {
      changePlayer();
    },
    playNext: (uri) => {
      addSongNext(uri);
    },
    skip: () => {
      skipSong();
    },
    volume: (value) => {
      changeVolume(value);
    },
  };
})(UIController);

//////////////////////////////////////////////
// UI Controller ////////////////////////////
// Changes the DOM and has event listeners//
///////////////////////////////////////////

var UIController = (() => {
  var miniPlayer;
  var currentURL = window.location.href;
  var splitURL = currentURL.split("?");
  var progressObj = new ProgressBar(0, 0);
  var buttonOBJ = new UIButtons();
  console.log(progressObj);
  const redirectURI = `https://accounts.spotify.com/en/authorize/?client_id=3a1d09a1778a487ba0a87d74c84a3b51&response_type=token&show_dialog=false&scope=user-top-read%20user-read-recently-played%20user-read-email%20user-read-private%20streaming%20user-read-playback-state%20playlist-read-collaborative%20playlist-read-private&redirect_uri=${splitURL[0]}`;
  let progressBarRunning = false;

  // Function to redirect to the Spotify login page
  function logMeIn() {
    window.location.href = redirectURI;
  }

  // clears tokens from localStorage and changes the button
  function logMeOut() {
    console.log("Called logout");
    localStorage.removeItem("oAuth");
    localStorage.removeItem("loggedIn");
    buttonToggle();
    toggleUI();
  }

  // adds info for current user to DOM
  function addMyInfo(info) {
    $(".myInfo").html(`<span class='displayName'>${info.display_name}</span>`);
    $("#loggedInButton").html(`Log out ${info.email}`);
    buttonToggle();
  }

  //  Removes login button and shows the logout button
  function buttonToggle() {
    document.getElementById("LoginButton").classList.toggle("hidden");
    document.getElementById("loggedInButton").classList.toggle("hidden");
  }

  // gets output from top songs API call
  // starts the forEach to loop through the elements
  function listMySongs(list) {
    list.forEach((element) => {
      addAnItem(element, ".mySongs");
    });
  }

  // gets output from top artist API call
  // starts the forEach to loop through the elements
  function listMyArtists(list) {
    $(".myArtists").html("");
    buttonOBJ.switch("myArtistsButton");
    list.forEach((element) => {
      addAnItem(element, ".myArtists");
    });
  }

  // gets output from top artist API call
  // starts the forEach to loop through the elements
  function listMyPlaylists(list) {
    $(".myPlaylists").html("");
    buttonOBJ.switch("myPlaylistsButton");
    console.log(list);
    list.forEach((element) => {
      addAnItem(element, ".myPlaylists");
    });
  }

  // swaps the active tab
  function changeTabs() {
    document.querySelector(".mySongs").classList.toggle("hidden");
    document.querySelector(".myArtists").classList.toggle("hidden");
    document.querySelector(".topSongs").classList.toggle("activeTab");
    document.querySelector(".topSongs").classList.toggle("inactiveTab");
    document.querySelector(".topArtists").classList.toggle("activeTab");
    document.querySelector(".topArtists").classList.toggle("inactiveTab");
  }

  // adds current song info to DOM
  function addCurrentlyPlayingSong(current) {
    miniPlayer = new SpotifyStatsMiniplayer(current);
    if (current.item) {
      $(".songInfo").html(
        `<div class='currentSongName'>${current.item.name}</div><span class='currentArtistName'>${current.item.artists[0].name}</span>`
      );
      if (!current.is_playing) {
        document
          .getElementById("playPauseButton")
          .classList.add("fa-play-circle");
      } else if (current.is_playing) {
        document
          .getElementById("playPauseButton")
          .classList.add("fa-pause-circle");
      }
    } else {
      $(".songInfo").html(
        `<div class='currentSongName'>Nothing is currently playing</div><span class='currentArtistName'>${current.item.artists[0].name}</span>`
      );
      document
        .getElementById("playPauseButton")
        .classList.add("fa-play-circle");
    }
  }

  // adds an item to the DOM list
  function addAnItem(song, where) {
    let container = document.querySelector(where);
    let newSong = document.createElement("div");
    if (where === ".mySongs") {
      newSong.classList.add("songElement");
      newSong.innerHTML = `<span class='songName'><a href='${song.external_urls.spotify}' target='_Blank' class='songLink'>${song.name}</a></span><span class'songArtist'> - ${song.artists[0].name}</span><span id='${song.uri}' data-name='${song.name}' class='playNextButton'>Play next</span><br><br><div class='songMedia'><audio controls class='songPreview'><source src='${song.preview_url}'></audio><img src='${song.album.images[0].url}' class='songImg'></div>`;

      container.insertAdjacentElement("beforeend", newSong);
    } else if (where === ".myArtists") {
      newSong.classList.add("artistElement");
      newSong.innerHTML = `<span class='artistName'><a href='${song.external_urls.spotify}' class='artistLink' target="_Blank">${song.name}</a><img src='${song.images[0].url}' class='artistImg'></span>`;

      container.insertAdjacentElement("beforeend", newSong);
    } else if (where === ".myPlaylists") {
      newSong.classList.add("playlistElement");
      newSong.innerHTML = `<span class='playlistInfoContainer'><span class='playlistName'>${song.name}</span><span class'songArtist'>Owner: ${song.owner.display_name}</span><img src='${song.images[0].url}' class='songImg'></span><br><span id='${song.uri}' data-name='${song.name}' class='playlistStartButton'>Play now</span>`;

      container.insertAdjacentElement("beforeend", newSong);
    }
  }

  // moves the mini player up or down
  function movePlayer() {
    $(".playerInfo").slideToggle(200);
    document.querySelector(".toggleButton").classList.toggle("toggleSwitch");
    if (
      document.querySelector(".toggleButton").classList.contains("toggleSwitch")
    ) {
    }
  }

  // checks to see what functions need to be called based on the URL. If there's a hash, it was just redirected from Spotify.
  function loadPage() {
    if (window.location.hash) {
      APIController.genOauth();
    }
    if (localStorage.getItem("loggedIn") === "true") {
      APIController.myInfo();
      APIController.mySongs();
      toggleUI();
    }

    //////////////////////////////////
    // ===== event listeners ===== //
    ////////////////////////////////

    $(".loginButton").on("click", logMeIn);
    $(".logOutButton").on("click", logMeOut);
    $(".myArtistsButton").on("click", checkArtistContent);
    $(".mySongsButton").on("click", checkSongContent);
    $(".myPlaylistsButton").on("click", checkPlaylistContent);
    $(".playerStatus").on("click", movePlayer);
    $(".playerVolume").on("mouseup", function () {
      APIController.volume(this.value);
    });
    APIController.currentlyPlaying();
    APIController.check();
  }

  // checks to see if an API call is required to load the artists
  function checkArtistContent() {
    var content = document.querySelector(".myArtists").innerHTML;
    if (content === "load") {
      APIController.myArtists();
    } else {
      if (
        document
          .querySelector(".myArtistsButton")
          .classList.contains("inactiveTab")
      ) {
        buttonOBJ.switch("myArtistsButton");
        // changeTabs();
      }
    }
  }

  // checks to see if an API call is required to load the playlists
  function checkPlaylistContent() {
    var content = document.querySelector(".myPlaylists").innerHTML;
    if (content === "load") {
      APIController.myPlaylists();
    } else {
      if (
        document
          .querySelector(".myPlaylistsButton")
          .classList.contains("inactiveTab")
      ) {
        buttonOBJ.switch("myPlaylistsButton");
      }
    }
    setTimeout(() => {
      $(".playlistStartButton").on("click", (that) => {
        APIController.playThis(that.target.id);
        console.log(miniPlayer);
        miniPlayer.playing == true
          ? console.log("already playing")
          : miniPlayer.toggleUIButton();
        console.log(miniPlayer);
        miniPlayer.playing = true;
      });
    }, 500);
  }

  // Looks to see if the top songs tab is active
  function checkSongContent() {
    var content = document.querySelector(".mySongsButton");
    if (!content.classList.contains("activeTab")) {
      buttonOBJ.switch("mySongsButton");
      // changeTabs();
    }
  }

  // switches from the info page to the logged in page
  function toggleUI() {
    document.querySelector(".infoBody").classList.toggle("hidden");
    document.querySelector(".completedBody").classList.toggle("hidden");
  }

  // displays an error on the page and in the console
  function errorBanner(error) {
    console.error(error);
    $(".bannerText").html(error);
    $(".bannerContent").css({
      "background-color": "rgb(156, 26, 26)",
    });
    $(".bannerContainer").fadeIn(200).delay(3000).fadeOut(200);
  }

  // displays an info banner for the data inputted into the function
  function infoBanner(info) {
    $(".bannerText").html(info);
    $(".bannerContent").css({
      "background-color": "#1db954",
    });
    $(".bannerContainer").fadeIn(200).delay(3000).fadeOut(200);
  }

  ///////////////////////////////
  // Prototype for UI Buttons //
  /////////////////////////////

  function UIButtons() {
    this.topSongs = "active";
    this.topArtists = "inactive";
    this.myPlaylists = "inactive";
  }

  UIButtons.prototype.switch = function (activeButton) {
    let activeContainer = activeButton.replace("Button", "");
    this.topSongs = "inactive";
    this.topArtists = "inactive";
    this.myPlaylists = "inactive";
    this.activeButton = "active";
    $(".mySongsButton").removeClass("activeTab");
    $(".myArtistsButton").removeClass("activeTab");
    $(".myPlaylistsButton").removeClass("activeTab");
    $(".mySongsButton").addClass("inactiveTab");
    $(".myArtistsButton").addClass("inactiveTab");
    $(".myPlaylistsButton").addClass("inactiveTab");
    $(`.${activeButton}`).removeClass("inactiveTab");
    $(`.${activeButton}`).addClass("activeTab");
    $(".myArtists").hide();
    $(".myPlaylists").hide();
    $(".mySongs").hide();
    $(`.${activeContainer}`).show();
  };

  /////////////////////////////////
  // Prototype for progress bar //
  ///////////////////////////////

  function ProgressBar(time, progress) {
    this.progress = progress / 1000;
    this.time = time / 1000;
    this.running = false;
    this.interval;
  }

  ProgressBar.prototype.start = function () {
    this.running = true;
    this.interval = setInterval(this.run, 1000);
  };

  ProgressBar.prototype.stop = function () {
    this.running = false;
    clearInterval(this.interval);
  };

  ProgressBar.prototype.run = function () {
    // console.log(progressObj.progress);
    if (progressObj.progress === progressObj.time) {
      progressObj.running = false;
      clearInterval(progressObj.run);
    } else {
      let percentDecimal = progressObj.progress / progressObj.time;
      let percent = percentDecimal * 100;
      console.log(progressObj.progress);
      console.log(progressObj.time);
      $(".progressBar").css({
        width: `${percent}%`,
      });
      progressObj.progress++;
    }
  };

  ////////////////////////////////
  // Prototype for player info //
  //////////////////////////////

  function SpotifyStatsMiniplayer(status) {
    this.playing = status.is_playing;
    this.song = status.item.name;
    this.artist = status.item.artists[0].name;
    document
      .querySelector(".controls")
      .addEventListener("click", this.toggleStatus.bind(this));
    ((that) => {
      setTimeout((that) => {
        $(".playNextButton").on("click", (that) => {
          miniPlayer.addSong(that.target.id);
        });
      }, 500);
    })();
  }

  SpotifyStatsMiniplayer.prototype.toggleStatus = function () {
    this.playing ? miniPlayer.pause() : miniPlayer.play();
    this.toggleUIButton();
  };

  SpotifyStatsMiniplayer.prototype.toggleUIButton = function () {
    document
      .getElementById("playPauseButton")
      .classList.toggle("fa-play-circle");
    document
      .getElementById("playPauseButton")
      .classList.toggle("fa-pause-circle");
  };

  SpotifyStatsMiniplayer.prototype.pause = () => {
    progressObj.stop();
    progressBarRunning = false;
    // clearInterval(changeTime);
    APIController.pause();
    miniPlayer.playing = false;
  };

  SpotifyStatsMiniplayer.prototype.play = () => {
    if (progressObj) {
      progressObj.start();
    }
    APIController.play();
    miniPlayer.playing = true;
    // progressObj.start();
  };

  SpotifyStatsMiniplayer.prototype.addSong = (info) => {
    APIController.playNext(info);
  };

  SpotifyStatsMiniplayer.prototype.updateInfo = (currentStatus) => {
    $(".songInfo").html(
      `<div class='currentSongName'>${currentStatus.track_window.current_track.name}</div><span class='currentArtistName'>${currentStatus.track_window.current_track.artists[0].name}</span>`
    );
  };

  ///////////////////////////////////////
  // Code from Spotify for web player //
  /////////////////////////////////////

  window.onSpotifyWebPlaybackSDKReady = () => {
    const token = localStorage.getItem("oAuth");
    const player = new Spotify.Player({
      name: "Spotify Stats Page",
      getOAuthToken: (cb) => {
        cb(token);
      },
    });

    // Error handling
    player.addListener("initialization_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("authentication_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("account_error", ({ message }) => {
      console.error(message);
    });
    player.addListener("playback_error", ({ message }) => {
      console.error(message);
    });

    // Playback status updates
    player.addListener("player_state_changed", (state) => {
      // console.log(state);
      progressObj.progress = state.position / 1000;
      progressObj.time = state.duration / 1000;
      miniPlayer.updateInfo(state);
      if (!document.querySelector(".playerNext")) {
        let html = document.createElement("div");
        html.classList.add("playerNext");
        document
          .querySelector(".playerInfo")
          .insertAdjacentElement("beforeend", html);
      }
      $(".playerNext").html(
        `Next song: ${state.track_window.next_tracks[0].name}`
      );
      document
        .querySelector(".playerNext")
        .addEventListener("click", APIController.skip);
    });

    // Ready
    player.addListener("ready", ({ device_id }) => {
      localStorage.setItem("deviceID", device_id);
      console.log("Ready with Device ID", device_id);
    });

    // Not Ready
    player.addListener("not_ready", ({ device_id }) => {
      console.log("Device ID has gone offline", device_id);
    });

    // Connect to the player!
    player.connect();
  };

  ////////////////////////////////////////////////
  // Return object to allow use in other IIFEs //
  //////////////////////////////////////////////

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
    listPlaylists: (list) => {
      listMyPlaylists(list);
    },
    onLoad: () => {
      loadPage();
    },
    error: (error) => {
      errorBanner(error);
    },
    info: (info) => {
      infoBanner(info);
    },
    togglePlayer: () => {
      movePlayer();
    },
    currentlyPlaying: (data) => {
      addCurrentlyPlayingSong(data);
    },
    updatePlayerInfo: (data) => {
      miniPlayer.updateInfo(data);
    },
    buttons: buttonOBJ,
  };
})(APIController);

UIController.onLoad();
