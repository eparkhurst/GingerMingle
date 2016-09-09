app.controller('HomeController', function($scope){
  $scope.myInterval = 3000;
    $scope.slides = [
      {
        image: 'http://lorempixel.com/400/200/'
      },
      {
        image: 'http://lorempixel.com/400/200/food'
      },
      {
        image: 'http://lorempixel.com/400/200/sports'
      },
      {
        image: 'http://lorempixel.com/400/200/people'
      }
    ];
})


app.controller('SignUpController', function($scope, Authorization, Members){
  $scope.showLoading = false;
  $scope.submitSignUp = function(){
    $scope.showLoading = true
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(showPosition);
   }
  }

  function showPosition(position){
    sendRegister(position.coords.latitude, position.coords.longitude)
  }

  function sendRegister(lat, long){
    $scope.signUpForm.slug = $scope.signUpForm.username
    $scope.signUpForm.address = {geo:{}}
    $scope.signUpForm.address.geo.lat = lat
    $scope.signUpForm.address.geo.lng = long
    console.log($scope.signUpForm);
    $http.post('http://galvanize-student-apis.herokuapp.com/gdating/auth/register', $scope.signUpForm)
    .then(function(data){
      $scope.showLoading = false

      if(data.data.data.token){
        sessionStorage.setItem('token', data.data.data.token)
        console.log("Session Storage?!?");
        console.log(sessionStorage.token);
        Members.currentMember = data.data.data
        Authorization.go('members')
      }
      console.log("What did we get back?");
      console.log(data);
    }, function errorCallback(response) {
      $scope.showLoading = false
      console.log(response);
    })
  }
})


app.controller('LogInController', function($scope, $http, Authorization,Members){
  $scope.login = function(){
    console.log($scope.loginForm);
    $http.post('http://galvanize-student-apis.herokuapp.com/gdating/auth/login', $scope.loginForm)
    .then(function(data){
      if(data.data.data.token){
        sessionStorage.setItem('token', data.data.data.token)
        Members.currentMember = data.data
        Authorization.go('members')
      }
    })
  }
})


app.controller('MembersController', function($scope, Authorization, Members){
  console.log(Members.currentMember);
  $scope.toOrder = ''
  if(Members.allMembers.length == 0){
    Members.getMembers().then(function(data){
      Members.allMembers = data.data.data
      $scope.members = Members.allMembers
    })
  }else{
    $scope.members = Members.allMembers
  }
  $scope.distance = function(){
    var location = 
  }
  $scope.logout = function(){
    sessionStorage.clear()
    Authorization.clear()
    console.log("all clear");
  }

})
