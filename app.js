var APIController = (() => {
  let myURL = window.location.hash;
  let URLSplit = myURL.split("&");
  let token = URLSplit[0].replace("#access_token=", "");

  function loadMyInfo() {
    $.ajax({
      url: "https://api.spotify.com/v1/me",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: function (data) {
        UICtl.addMe(data);
      },
    });
  }

  function loadMySongs() {
    $.ajax({
      url: "https://api.spotify.com/v1/me/top/tracks",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: function (data) {
        console.log(data);
      },
      error: function (req) {
        if(req.status === 400){
          UICtl.loginPage();
        }
      },
    });
  }

  return {
    myInfo: () => {
      loadMyInfo();
    },
    mySongs: () => {
      loadMySongs();
    },
  };
})(UICtl);

var UIController = (() => {
  const redirectURI = `https://accounts.spotify.com/en/authorize/?client_id=3a1d09a1778a487ba0a87d74c84a3b51&response_type=token&show_dialog=true&scope=user-top-read%20user-read-recently-played%20user-read-email&redirect_uri=http:%2F%2Flocalhost:5500`;

  // Function to redirect to the Spotify login page
  function logMeIn() {
    console.log("redirectURI");
    window.location.href = redirectURI;
  }

  function addMyInfo(info) {
    console.log(info);
  }

  return {
    loginPage: () => {
      logMeIn();
    },
    addMe: (info) => {
      addMyInfo(info);
    },
  };
})();

$(".loginButton").on("click", UIController.loginPage);
