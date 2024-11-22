export function getMap(latitude, longitude, mapID){
    var map;

    DG.then(function () {
        map = DG.map(`${mapID}`, {
            center: [latitude, longitude],
            zoom: 11
        });
    
        DG.marker([latitude, longitude]).addTo(map).bindPopup('Вы кликнули по мне!');
    });
}

