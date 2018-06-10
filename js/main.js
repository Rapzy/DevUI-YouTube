document.getElementById('search').onclick = function(event){
      var query = document.getElementById("query").value;
      event.preventDefault();
      if (query.trim()){
        search(query);
        return;
      }
      else {
        alert('Введите запрос для поиска!')
        return;
      }
    }
function start() {
    gapi.client.init({
      'apiKey': 'AIzaSyDnYv2YoUO7jp87pyYjGcyhcQVv-dfBv40',
      'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
    });
};
function loadClient() {
  gapi.load('client', start);
}
function search(query) {
      return gapi.client.request({
      'method': 'GET',
      'path': '/youtube/v3/search',
      'params': {'maxResults': '20',
                 'part': 'snippet',
                 'q': query,
                 'type': 'video'
                }
    }).then(function(response) {
          console.log(response.result);
          var container = document.getElementById('content');
          var block, title, img, video, url, a, card;
          video = response.result.items;
          for (var i = 0; i < video.length; i++) {
            card = `
            <div class="card">
              <a href="https://www.youtube.com/watch?v="${video[i].id.videoId}">
                <img class="thumbnail" src="${video[i].snippet.thumbnails.medium.url}" />
              </a>
              <div class="card-bottom">
                <h2>${video[i].snippet.title}</h2>
                <p>${video[i].snippet.description}</p>
              </div>
            </div>`;      
            container.innerHTML += card;
          }
        }, function(reason) {
          console.log('Error: ' + reason.result.error.message);
        });
}
loadClient();