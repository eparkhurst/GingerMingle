app.controller('HomeController', function($scope){
  console.log('from the Home Controller');
  $scope.test = "this is a test"
})
app.controller('SignUpController', function($scope, $http){
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
        localStorage.setItem('token', data.data.data.token)
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
        localStorage.setItem('token', data.data.data.token)
        //Members.get()
        Authorization.go('members')
      }
    })
  }
})


app.controller('MembersController', function($scope, Authorization, Members){
  if(Members.allMembers.length == 0){
    Members.getMembers().then(function(data){
      Members.allMembers = data.data.data
      $scope.members = Members.allMembers
    })
  }else{
    $scope.members = Members.allMembers
  }

  $scope.logout = function(){
    localStorage.clear()
    Authorization.clear()
    console.log("all clear");
  }

})
