(function ($) {
    "use strict";

    google.maps.Map.prototype.positions = [];

    var maps = [];
    var mapCount = 0;

    $.fn.jMapMarkers = function (options) {
        if (typeof (google) === 'undefined' || typeof (google.maps) === 'undefined') {
            $.error('Google Maps API hasn\'t been successfully loaded yet.');
        }

        var fitBounds = function (map) {
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < map.positions.length; i++) {
                bounds.extend(map.positions[i]);
            }
            map.fitBounds(bounds);
        };

        var settings = $.extend({
            "mapOptions": {
                "mapTypeId": google.maps.MapTypeId.ROADMAP
            },
            "markers": [],
            "fitBounds": true
        }, options);

        return this.each(function (index, item) {
            var map;

            var $this = $(this);
            var id = $this.attr('data-jmm-id');
            if (id) {
                map = maps[id];
            } else {
                $this.attr('data-jmm-id', mapCount);
                map = new google.maps.Map(this, settings.mapOptions);

                maps[id] = map;
                mapCount = mapCount + 1;
            }

            var mapMarkerClickEvent = function (e) {
                this.infoWindow.open(map, this);
            };

            for (var i = 0; i < settings.markers.length; i++) {
                var marker = settings.markers[i];

                var lat = parseFloat(marker.lat);
                var long = parseFloat(marker.long);
                var position = new google.maps.LatLng(lat, long);
                map.positions.push(position);

                var infoWindow;

                if (marker.desc) {
                    infoWindow = new google.maps.InfoWindow({
                        content: marker.desc,
                        position: position
                    });
                }

                var mapMarker = new google.maps.Marker({
                    map: map,
                    position: position,
                    title: marker.title,
                    infoWindow: infoWindow
                });

                if (infoWindow) {
                    google.maps.event.addListener(mapMarker, 'click', mapMarkerClickEvent);
                }
            }

            // Fit to markers
            if (settings.fitBounds) {
                fitBounds(map);
            }
        });
    };
})(jQuery);