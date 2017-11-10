/*global google*/
/*global $*/
(function () {
    'use strict';
    var loc = { lat: 54.32955871538203, lng: 20.526312500000014 },
        infoList = document.getElementById('ul'),
        inputBox = $('#input'),
        map = new google.maps.Map(document.getElementById('map'),
            {
                center: loc,
                zoom: 3,
            }
        );
    var markers = [],
        latLngBounds = new google.maps.LatLngBounds(),
        infoWindow = new google.maps.InfoWindow({
            maxWidth: 250
        });
    $('button').click(function () {
        infoList.innerHTML = "";
        if (markers) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
        }
        var input = inputBox.val();
        $.getJSON('http://api.geonames.org/wikipediaSearch?maxRows=30&username=sheateitelbaum&type=json&callback=?', { q: input }, function (infos) {
            console.log('input', input);
            console.log(infos);
            infos.geonames.forEach(function (geoname) {
                var li = document.createElement("li"),
                    titleButton = document.createElement("button"),
                    list = document.createElement("div"),
                    deleteButton = document.createElement("button");
                titleButton.innerHTML = geoname.title;
                list.appendChild(titleButton);
                li.appendChild(list);
                deleteButton.innerHTML = 'x';
                deleteButton.className = 'delete';
                list.appendChild(deleteButton);
                titleButton.className = 'titleButton';
                li.className = 'list';
                infoList.appendChild(li);

                var marker = new google.maps.Marker({
                    position: { lat: geoname.lat, lng: geoname.lng },
                    map: map,
                });
                console.log('marker.position', { lat: geoname.lat, lng: geoname.lng });
                latLngBounds.extend({ lat: geoname.lat, lng: geoname.lng });

                marker.addListener('click', function () {
                    infoWindow.setContent(geoname.summary + '</br> <a target="_blank" href="' + 'https://' + geoname.wikipediaUrl + '"/>wikipedia</a>');
                    infoWindow.open(map, this);
                });
                titleButton.addEventListener('click', function () {
                    console.log('testing');
                    map.panTo({ lat: geoname.lat, lng: geoname.lng });
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    // setTimeout(function () { map.setZoom(6); }, 2000);
                    // setTimeout(function () { map.setZoom(3); }, 10000);
                    setTimeout(function () { marker.setAnimation(null); }, 15000);
                });//setTimeout(function() {  marker.setAnimation(google.maps.Animation.BOUNCE); }, 2000);

                deleteButton.addEventListener('click', function () {
                    console.log('deleting');
                    //var ul = document.getElementById("ul");
                    li.parentNode.removeChild(li);
                    marker.setMap(null);
                });
                markers.push(marker);
            });
            map.fitBounds(latLngBounds);
        });
    });
} ());