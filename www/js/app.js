// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
})

 .controller('MainCtrl', function($scope, $ionicSideMenuDelegate, $http) {
      $scope.tech = [
        'node',
        'graphics',
        'es6',
        'mv'
      ];


      $http.get('js/pflanzen.json')
      .success(function(episodes){
        $scope.allEpisodes = episodes;
      
          $scope.groups = _.groupBy(episodes, "FamilieLatein");

        $scope.episodes = episodes;
      });

      $scope.filterBy = function(filter){
        if(filter === 'all'){
          return $scope.episodes = $scope.allEpisodes;
        }
        $scope.episodes = $scope.allEpisodes.filter(function(ep){return ep.tech.indexOf(filter) > -1;})
      }



      $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
      };
    })