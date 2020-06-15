let myURL = window.location.hash;
let URLSplit = myURL.split("&");
let token = URLSplit[0].replace("#access_token=", "");

$.ajax({
  url: "https://api.spotify.com/v1/me",
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`,
  },
  success: function (data) {
    console.log(data);
  },
});

$.ajax({
    url: "https://api.spotify.com/v1/me/top/tracks",
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    success: function (data) {
      console.log(data);
    },
  });
  