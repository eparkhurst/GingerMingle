var app = angular.module('GingerMingle',['ui.router'])
console.log("hey");

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('home',{
    url: '/home',
    templateUrl: 'partials/home',
    controller: 'HomeController'
  })
  .state('register',{
    url: '/register',
    templateUrl: 'partials/register.html',
    controller:'SignUpController'
  })
  .state('login',{
    url: '/login',
    templateUrl: 'partials/login.html',
    controller:'LogInController',
  })
  .state('members',{
    url: '/members',
    templateUrl: 'partials/members.html',
    controller:'MembersController',
    data: {
      authorization: true,
      redirectTo: 'login'
    }
  })

  $urlRouterProvider.otherwise('/home')

}).run(function( $rootScope, $state, Authorization,Members) {
  if(localStorage.token){
      Authorization.authorized = true;
  }

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if (!Authorization.authorized && toState.data) {
      $state.go(toState.data.redirectTo);
    }
  });
});
