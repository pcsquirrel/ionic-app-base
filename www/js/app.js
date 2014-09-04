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

 .controller('MainCtrl', function($scope, $ionicSideMenuDelegate, PflanzenService) {
      $scope.tech = [
        'node',
        'graphics',
        'es6',
        'mv'
      ];


     
     PflanzenService.getPflanzen(function (results){
        $scope.allEpisodes = results;
      
          $scope.groups = _.groupBy(results, "FamilieDeutsch");

        $scope.episodes = results;
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

.controller('PflanzeCtrl', function($scope, $stateParams, PflanzenService, $ionicPopover, $ionicScrollDelegate) {
    $scope.id = $stateParams.id;
    PflanzenService.getPflanze($stateParams.id,function (result){
        $scope.pflanze = result;
     });
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });
  $scope.openPopover = function($event, text) {
      $scope.text=text
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
    
$scope.$watch('$viewContentLoaded', function( ){
    setTimeout(function(){
        var delegate = $ionicScrollDelegate.$getByHandle('pflanzenbilderscroll');
        var a = delegate.getScrollView().__clientHeight / delegate.getScrollView().options.getContentHeight();
        delegate.zoomTo(a);
          delegate.getScrollView().options.minZoom = a;
        var delegate = $ionicScrollDelegate.$getByHandle('fundortbilderscroll');
        var a = delegate.getScrollView().__clientHeight / delegate.getScrollView().options.getContentHeight();
        delegate.zoomTo(a);
         delegate.getScrollView().options.minZoom = a;
       // alert(a)
    },1000)
   
 });
  
    })



.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('main', {
      url: "/main",
      templateUrl: "main.html",
      controller: 'MainCtrl'
    })
    .state('pflanze', {
      url: "/pflanze/:id",
      templateUrl: "pflanze.html",
      controller: 'PflanzeCtrl'
    })

  // if none of the above are matched, go to this one
    $urlRouterProvider.otherwise("/main");
})

.factory('PflanzenService', function($http) {
  var allePflanzen = null
  var pflanzen = []
  var familien = []
  //todo verbessern
  //http://stackoverflow.com/questions/23923770/angularjs-combine-results-from-json-into-one-controller-view
  function getPflanzenInt(callback){
          if(allePflanzen == null){
//              $http.get('./js/pflanzen_auswahl.json').success(
              $http.get('./js/herbarium_pflanzen.json').success(
                  function(pflanzenDl,status){
    //  alert(status);
                    allePflanzen = pflanzenDl.Pflanzen.Pflanze
                    for (var i = 0; i < allePflanzen.length; i++) {
                        if(allePflanzen[i].Namen.length > 1){
                            allePflanzen[i].NameDeutsch = allePflanzen[i].Namen[0].Name
                        }else{
                            allePflanzen[i].NameDeutsch = allePflanzen[i].Namen.Name
                        }
                    }
                      
                    allePflanzen = _.indexBy(allePflanzen, 'FNL_ID');

                    callback(allePflanzen)
          /*    $http.get('./js/nur_pflanzen.json').success(
                  function(nur_pflanzenDl,status){
                  $http.get('./js/bilder.json').success(
                      function(bilderDl,status){
                          $http.get('./js/fundort.json').success(
                            function(fundortDl,status){
                            allePflanzen = extendDeep(  bilderDl,  fundortDl,nur_pflanzenDl);
                            callback(allePflanzen)
                  }
              )  
                  }
              )  */

                  }
              ).
    error(function(data, status, headers, config) {
      alert(data);
      alert(status);
    })
             /* allePflanzen = [{"FNL_ID":"9908","NameLatein":"Taraxacum officinale","NameDroge":[],"Seite":"99","geschuetzt":"false","FamilieDeutsch":"Korbbl?tler","FamilieLatein":"Asteraceae","Nummer":"13","Namen":{"Name":"L?wenzahn","Sort":"1"},"Synonym":"Leontodon taraxacum","Entwicklung":"m","Giftigkeit":[],"FamilieSynonym":"false"},
{"FNL_ID":"6807","NameLatein":"Marchantia polymorpha","NameDroge":[],"Seite":"68","geschuetzt":"false","FamilieDeutsch":"Leberkrautgew?chse","FamilieLatein":"Marchantiaceae","Nummer":"14","Namen":[{"Name":"Sternlebermoos","Sort":"1"},{"Name":"Brunnenleber-kraut","Sort":"2"}],"Synonym":[],"Entwicklung":"m","Giftigkeit":[],"FamilieSynonym":"false"},
{"FNL_ID":"10303","NameLatein":"Tulipa gesneriana","NameDroge":[],"Seite":"103","geschuetzt":"false","FamilieDeutsch":"Liliengew?chse","FamilieLatein":"Liliaceae","Nummer":"15","Namen":{"Name":"Garten-Tulpe","Sort":"1"},"Synonym":[],"Entwicklung":"m","Giftigkeit":"!","FamilieSynonym":"false"}];
              callback(allePflanzen);*/
          }else{
          callback(allePflanzen);
              }
  }
  return {
      getPflanzen: function(callback) {
          getPflanzenInt(callback)
      },
      getPflanze: function(FNL_ID, callback){
          getPflanzenInt(function(allePflanzen){
              var pflanze = allePflanzen[FNL_ID];
               if(pflanze.Bilder[0] == null){
                       var temp = pflanze.Bilder
                       pflanze.Bilder = []
                       pflanze.Bilder[0] = temp
                    }
                    
                   if(pflanze.Fundorte[0] == null){
                       var temp = pflanze.Fundorte
                       pflanze.Fundorte = []
                       pflanze.Fundorte[0] = temp
                    }
                    
                    pflanze.GiftNummer = -1
                    pflanze.GiftText = ""
                    if(pflanze.Giftigkeit.indexOf("(!)") == 0){
                        pflanze.GiftNummer = 0
                        pflanze.GiftText = pflanze.Giftigkeit.substr(4)
                    }else if(pflanze.Giftigkeit.indexOf("!!!") == 0){
                        pflanze.GiftNummer = 3
                        pflanze.GiftText = pflanze.Giftigkeit.substr(4)
                    }else if(pflanze.Giftigkeit.indexOf("!!") == 0){
                        pflanze.GiftNummer = 2
                        pflanze.GiftText = pflanze.Giftigkeit.substr(3)
                    }else if(pflanze.Giftigkeit.indexOf("!") == 0){
                        pflanze.GiftNummer = 1
                        pflanze.GiftText = pflanze.Giftigkeit.substr(2)
                    }
                        
            callback(pflanze)  
          })
      }
      
  }
})

function extendDeep(dst) {
  angular.forEach(arguments, function(obj) {
    if (obj !== dst) {
      angular.forEach(obj, function(value, key) {
        if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
          extendDeep(dst[key], value);
        } else {
          dst[key] = value;
        }     
      });   
    }
  });
  return dst;
};
