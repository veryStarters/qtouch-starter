export default (function() {

    function initialize() {
        let traferData = qt.getTransferData();

        let point = new google.maps.LatLng(traferData.point.lat, traferData.point.lng),
            mapOptions = {
                zoom: 16,
                center: point
            },
            map = new google.maps.Map(document.getElementById('map'), mapOptions),
            infowindow = new google.maps.InfoWindow({
                content: `<div>${traferData.title}</div><div>${traferData.address}<br/></div>`,
                size : new google.maps.Size(310, 100)
            }),
            marker = new google.maps.Marker({
                position: point,
                map: map
            });

        infowindow.open(map, marker);

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
        });
    }

    let load = () => {
        initialize();
    };

    return {
        load: load
    };

})();
