var APIController = (() => {
  var oauthToken = localStorage.getItem("oAuth");

  function loadMyInfo() {
    $.ajax({
      url: "https://api.spotify.com/v1/me",
      method: "GET",
      headers: {
        Authorization: `Bearer ${oauthToken}`,
      },
      success: function (data) {
        UIController.addMe(data);
      },
      error: function (req, err) {
        if (req.status === 400 || req.status === 401) {
          UIController.loginPage();
        } else console.log(err);
      },
    });
  }

  function loadMySongs() {
    $.ajax({
      url: "https://api.spotify.com/v1/me/top/tracks",
      method: "GET",
      headers: {
        Authorization: `Bearer ${oauthToken}`,
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

  function generateAPIToken() {
    let myURL = window.location.hash;
    let URLSplit = myURL.split("&");
    token = URLSplit[0].replace("#access_token=", "");
    history.pushState(
      { urlPath: window.location.pathname },
      "",
      window.location.origin
    );
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
    genOauth: () => {
      generateAPIToken();
    },
  };
})(UIController);

var UIController = (() => {
  const redirectURI = `https://accounts.spotify.com/en/authorize/?client_id=3a1d09a1778a487ba0a87d74c84a3b51&response_type=token&show_dialog=true&scope=user-top-read%20user-read-recently-played%20user-read-email&redirect_uri=http:%2F%2Flocalhost:5500`;

  // Function to redirect to the Spotify login page
  function logMeIn() {
    console.log("redirectURI");
    window.location.href = redirectURI;
  }

  function addMyInfo(info) {
    $(".myInfo").html(`<span class='displayName'>${info.display_name}</span>`);
    $("#LoginButton").html(`Logged in as ${info.email}`);
    document.getElementById("LoginButton").classList.remove("button");
    document.getElementById("LoginButton").classList.remove("loginButton");
    document.getElementById("LoginButton").classList.add("loggedInInfo");
    console.log(info);
  }

  function listMySongs(list) {
    list.forEach((element) => {
      addASong(element);
    });
    console.log(list);
  }

  function addASong(song) {
    let container = document.querySelector(".mySongs");
    let newSong = document.createElement("div");
    newSong.classList.add("songElement");
    newSong.innerHTML = `<span class='songName'>${song.name}</span><span class'songArtist'> - ${song.artists[0].name}</span><br><br><div class='songMedia'><audio controls class='songPreview'><source src='${song.preview_url}'></audio><img src='${song.album.images[0].url}' class='songImg'></div>`;
    container.insertAdjacentElement("beforeend", newSong);
  }

  function loadPage() {
    if (window.location.hash) {
      APIController.genOauth();
    }
    if (localStorage.getItem("loggedIn")) {
      APIController.myInfo();
      APIController.mySongs();
      document.querySelector('.infoBody').classList.add('hidden');
      document.querySelector('.completedBody').classList.remove('hidden');
    }
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
    onLoad: () => {
      loadPage();
    },
  };
})(APIController);

$(".loginButton").on("click", UIController.loginPage);
UIController.onLoad();
