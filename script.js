function changeVisibility(elementsToShow, elementsToHide) {

     for (let i = 0; i < elementsToHide.length; i++) {
          $(elementsToHide[i]).fadeOut("fast");
          elementsToHide[i].style.zIndex = -1;
          elementsToHide[i].style.display = 'none';
     }

     for (let i = 0; i < elementsToShow.length; i++) {
          $(elementsToShow[i]).fadeIn("slow");
          elementsToShow[i].style.zIndex = 100;
          elementsToShow[i].style.display = 'block';
     }

}

function activateButtons() {
     const regionButtons1 = document.querySelector('.region-buttons-1');

     regionButtons1.addEventListener('click', (event) => {
          if (event.target.dataset.region === undefined) {
               var region = "dataEast";

          } else {
               var region = event.target.dataset.region;
          }
          var region = event.target.dataset.region;
          const localStorageKey = 'powerRegionV2';
          localStorage.setItem(localStorageKey, region + '.json');
          updateContent(localStorage.getItem('powerRegionV2'));
     });

     const regionButtons2 = document.querySelector('.region-buttons-2');

     regionButtons2.addEventListener('click', (event) => {
          if (event.target.dataset.region === undefined) {
               var region = "dataEast";

          } else {
               var region = event.target.dataset.region;
          }
          const localStorageKey = 'powerRegionV2';
          localStorage.setItem(localStorageKey, region + '.json');
          updateContent(localStorage.getItem('powerRegionV2'));

     });
}

function updateContent() {

     const elementWelcomeScreen = document.getElementById('welcomeScreen');
     const elementContent = document.getElementById('content');

     const iconForContent = document.getElementById('content').querySelector('#icon');
     const msgForContent = document.getElementById('content').querySelector('#msg');

     const msgForContentClock = document.getElementById('content').querySelector('#clockMsg');

     var powerRegion = localStorage.getItem('powerRegionV2');

     var now = new Date();
     var currentHour = now.getHours();

     if (powerRegion == null) {

          changeVisibility([], [elementWelcomeScreen, elementContent]);
          changeVisibility([elementWelcomeScreen], [elementContent]);

     } else {

          changeVisibility([elementContent], [elementWelcomeScreen]);

          fetch(powerRegion)
               .then(response => response.json())
               .then(data => {
                    document.body.style.transition = 'background-color 1s';
                    document.body.style.backgroundColor = data[currentHour]['background-color'];
                    if (data[currentHour]['icon'] === 'on') {
                         iconForContent.className = 'icon fa-sharp fa-solid fa-power-off fa-bounce';
                    } else {
                         iconForContent.className = 'icon fa-sharp fa-solid fa-power-off fa-shake';
                    }
                    msgForContent.innerHTML = data[currentHour]['msg'];

                    timestamps = data["timeToUse"]

                    let hasFutureTimestamp = false;
                    var myList = [];

                    for (var timestamp of timestamps) {
                         var date = new Date(timestamp);
                         var now = new Date();
                         var diffInMs = date - now;
                         var diffInHours = diffInMs / (1000 * 60 * 60);

                         if (diffInHours > -1 && diffInHours <= 15) {
                              var hours = date.getHours().toString().padStart(2, "0");
                              var minutes = date.getMinutes().toString().padStart(2, "0");
                              var time = `${hours}:${minutes}`;
                              myList.push(time);
                              hasFutureTimestamp = true;
                         }
                    }

                    if (!hasFutureTimestamp) {
                         listString = "Strømmen bliver ikke billig de næste mange timer";
                         msgForContentClock.innerHTML = listString;
                    } else {
                         let listString = myList.join(', ');
                         listString = "Tænd kl. " + listString;
                         msgForContentClock.innerHTML = listString;
                    }


               })
               .catch(error => {
                    document.body.style.transition = 'background-color 1s';
                    document.body.style.backgroundColor = "#ddd";
                    iconForContent.className = 'icon fa-sharp fa-solid fa-power-off fa-spin-pulse';
                    msgForContent.innerHTML = "Fejl. Prøv igen senere.";
               });

          changeVisibility([elementContent], [elementWelcomeScreen]);

     }

}

document.addEventListener('DOMContentLoaded', function () {

     activateButtons();
     updateContent();
     setInterval(updateContent, 300000);

});