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
const container = document.getElementById('content');
let isDown = false;
let startX;
let scrollLeft;

container.addEventListener('mousedown', (event) => {
  isDown = true;
  startX = event.pageX - container.offsetLeft;
  scrollLeft = container.scrollLeft;
});

container.addEventListener('mouseleave', () => isDown = false);

container.addEventListener('mouseup', () => {
  isDown = false;
  let card = document.getElementsByClassName('card')[0];
  var width = card.offsetWidth + parseInt(getComputedStyle(card).marginRight) * 2;
  if (container.scrollLeft < width/2) {
    container.scrollLeft = 0;
  }
  else {
    if (container.scrollLeft > width/2 && container.scrollLeft < width){
      container.scrollLeft = width;
    }
    else{
      if(container.scrollLeft%width < width/2){
        container.scrollLeft -= container.scrollLeft%width;
      }
      else{
        container.scrollLeft += width-container.scrollLeft%width;
      }
    }
  }
});

container.addEventListener('mousemove', (event) => {
  if(!isDown) return;
  event.preventDefault();
  const x = event.pageX - container.offsetLeft;
  let delta = x - startX;
  container.scrollLeft = scrollLeft - delta * 2;
});

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
          let block, title, img, video, url, a, card;
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