/**
 * Created by vinhhoang on 29/12/2015.
 */
export class Configuration {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  constructor($stateProvider, $urlRouterProvider, uiGmapApiProvider, $ionicConfigProvider) {

    uiGmapApiProvider.configure({
      key: 'AIzaSyDo0kZXQYLevduL7ffansIOEJpp3Hi45Eg',
      libraries: 'weather, geometry'
    });

    //Set to use ionic scroll instead native scroll(overflow scroll)
    $ionicConfigProvider.scrolling.jsScrolling(true);

    $stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })
      .state('tab.map', {
        url: '/map',
        views: {
          'tab-map': {
            templateUrl: './pages/map/map.template.html',
            controller: 'MapController',
            controllerAs: 'mapCtrl',
            resolve: {
              curPosition:getWatchPosition
            }
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/map');


    function getWatchPosition($cordovaGeolocation,$log) {
      var watchOptions = {
        timeout: 10000,
        enableHighAccuracy: false
      };
      return $cordovaGeolocation.getCurrentPosition(watchOptions);
    }
    getWatchPosition.$inject = ['$cordovaGeolocation', '$log'];
  }

}

Configuration.$inject = ['$stateProvider', '$urlRouterProvider', 'uiGmapGoogleMapApiProvider', '$ionicConfigProvider'];
