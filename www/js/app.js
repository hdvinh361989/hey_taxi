import './../lib/angular-google-maps/dist/angular-google-maps'

import {Configuration} from './configuration';
import {MapController} from './../pages/map/map.controler';


(function () {
  'use strict';

  angular
    .module('starter',
      [
        'ionic',
        'uiGmapgoogle-maps',
        'ngCordova'
      ])
    .run(function ($ionicPlatform) {
      $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
      });
    })
    .config(Configuration)


    .controller(MapController, MapController)


  ;


})();
