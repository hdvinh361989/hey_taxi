/**
 * Created by vinhhoang on 29/12/2015.
 */
//private Properties
var _$corGeo = null,
  _watchGeoObj = null,
  _curPosition = null,
  _googleMaps = null,
  _$timeout = null,
  _$log = null;

export class MapController {

  static toString() {
    return 'MapController'
  };

  gotoCurPosition() {
    _panTo(this, _curPosition);
  }

  constructor($scope, uiGmapApi, $cordovaGeolocation, $ionicPlatform, $timeout, curPosition, $log) {

    //Save injected service to use later
    _$corGeo = $cordovaGeolocation;
    _$timeout = $timeout;
    _$log = $log;


    var ctrl = this;


    //Properties
    ctrl.gMapConfig = {
      coords: _getCoords(curPosition),
      zoom: 12
    };
    ctrl.markers = {
      user: {
        id: 1,
        coords: _getCoords(curPosition)
      }
    };


    //Start watching user's geo location in milliseconds
    _watchUserPos(ctrl, 5000);


    //Get google.maps object
    uiGmapApi.then(function (maps) {
      //Cache google.maps object
      _googleMaps = maps;
    })
  }
}


/**
 * Use google.maps object to invoke _panTo method
 * */
function _panTo(ctrl, position) {
  //var latlng = new _googleMaps.LatLng(position.coords.latitude, position.coords.longitude);
  //ctrl.gMapConfig.getGMap()._panTo(latlng);
  ctrl.gMapConfig.coords = _getCoords(position);
  _zoom(ctrl, 15);
}


/**
 * Get coordinate from position object that returned
 * from cordovaGeoLocation.watchposition
 * */
function _getCoords(position) {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
  };
}


/**
 * Set timeout to improve performance and render
 * */
function _zoom(ctrl, value) {
  _$timeout(function () {
    ctrl.gMapConfig.zoom = value;
  }, 100);
}


//Start watch user geolocation in n milliseconds
function _watchUserPos(ctrl, milliseconds) {
  var watchOptions = {
    timeout: 3000,
    enableHighAccuracy: false
  };

  _$timeout(function () {

    _watchGeoObj = _$corGeo.watchPosition(watchOptions);
    _watchGeoObj.then(
      null,
      function (error) {
        _$log.info(error);
      },
      function (position) {
        //Cache returned position
        _curPosition = position;

        //Initialize gMapConfig(model for google map directive)
        //          markers.user(model for marker directive)
        ctrl.gMapConfig.coords = _getCoords(position);
        ctrl.markers.user.coords = _getCoords(position);
      });

  }, milliseconds);
}


//Injecting services
MapController.$inject = ['$scope', 'uiGmapGoogleMapApi',
  '$cordovaGeolocation', '$ionicPlatform', '$timeout',
  'curPosition', '$log'];
