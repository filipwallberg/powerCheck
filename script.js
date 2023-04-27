function changeVisibility(elementsToShow, elementsToHide) {

     for (let i = 0; i < elementsToHide.length; i++) {
          $(elementsToShow[i]).fadeOut("800", function () {
               setTimeout(function () {
               }, 1000);
          });
          elementsToHide[i].style.zIndex = -1;
          elementsToHide[i].style.display = 'none';
     }

     for (let i = 0; i < elementsToShow.length; i++) {
          $(elementsToShow[i]).fadeIn("800", function () {
               setTimeout(function () {
               }, 1000);
          });
          elementsToShow[i].style.zIndex = 100;
          elementsToShow[i].style.display = 'block';
     }

}

function activateButtons() {

     const regionButtons = document.querySelector('.region-buttons');

     regionButtons.addEventListener('click', (event) => {
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

}

function updateContent() {

     const elementContent = document.getElementById('content');
     const iconForContent = document.getElementById('content').querySelector('#icon');
     const msgForContent = document.getElementById('content').querySelector('#msg');
     const msgForContentClock = document.getElementById('content').querySelector('#clockMsg');

     var powerRegion = localStorage.getItem('powerRegionV2');

     var now = new Date();
     var currentHour = now.getHours();

     if (powerRegion == null) {

          changeVisibility([], [elementContent]);

          document.body.style.transition = 'background-color 1s';
          document.body.style.backgroundColor = "#ddd";
          iconForContent.className = 'icon fa-solid fa-compass fa-spin fa-spin-reverse';
          msgForContent.innerHTML = "Vælg landsdel";
          msgForContentClock.innerHTML = "Jylland + Fyn = vest | Sjælland = øst";

          changeVisibility([elementContent], []);

     } else {

          changeVisibility([], [elementContent]);

          fetch(powerRegion)
               .then(response => response.json())
               .then(data => {

                    let hasFutureTimestamp = false;
                    var timeToUseList = [];

                    for (var timestamp of data["timeToUse"]) {

                         var date = new Date(timestamp);
                         var now = new Date();
                         var diffInMs = date - now;
                         var diffInHours = diffInMs / (1000 * 60 * 60);

                         if (diffInHours > 1 && diffInHours <= 15) {
                              var hours = date.getHours().toString().padStart(2, "0");
                              var minutes = date.getMinutes().toString().padStart(2, "0");
                              var time = `${hours}:${minutes}`;
                              timeToUseList.push(time);
                              hasFutureTimestamp = true;
                         }

                    }

                    if (!hasFutureTimestamp) {

                         if (data[currentHour]['icon'] === 'off') {
                              msgForContent.innerHTML = "Strømmen er dyr...";
                              msgForTimeToUse = "...og bliver ikke billig de næste mange timer.";
                         } else {
                              msgForTimeToUse = "Strømmen bliver ikke billig de næste mange timer.";
                         }

                         msgForContentClock.innerHTML = msgForTimeToUse;

                    } else {

                         if (data[currentHour]['icon'] === 'off') {
                              msgForTimeToUse = "Du kan tænde kl. " + timeToUseList.slice(0, 1) + ".";
                         } else {
                              msgForTimeToUse = "Du kan også tænde kl. " + timeToUseList.slice(0, 1) + ".";
                         }

                         msgForContentClock.innerHTML = msgForTimeToUse;

                    }

                    document.body.style.transition = 'background-color 1s';
                    document.body.style.backgroundColor = data[currentHour]['background-color'];

                    if (data[currentHour]['icon'] === 'on') {

                         iconForContent.className = 'icon fa-sharp fa-solid fa-power-off fa-bounce';

                    } else {

                         iconForContent.className = 'icon fa-sharp fa-solid fa-power-off fa-shake';

                    }

                    msgForContent.innerHTML = data[currentHour]['msg'];


               })
               .catch(error => {

                    document.body.style.transition = 'background-color 1s';
                    document.body.style.backgroundColor = "#ddd";
                    iconForContent.className = 'icon fa-sharp fa-solid fa-power-off fa-spin-pulse';
                    msgForContent.innerHTML = "Fejl. Prøv igen senere.";

               });

          changeVisibility([elementContent], []);

     }

}

document.addEventListener('DOMContentLoaded', function () {

     activateButtons();
     updateContent();
     setInterval(updateContent, 300000);

});