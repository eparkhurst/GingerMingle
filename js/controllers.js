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
        sessionStorage.setItem('token', data.data.data.token)
        Members.currentMember = data.data.data
        console.log("Session Storage?!?");
        console.log(sessionStorage.token);
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
    $http.post('http://galvanize-student-apis.herokuapp.com/gdating/auth/login', $scope.loginForm)
    .then(function(data){
      if(data.data.data.token){
        sessionStorage.setItem('token', data.data.data.token)
        Members.currentMember = data.data.data
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
      console.log("current member", Members.currentMember);
      calcDistance(Members.allMembers, Members.currentMember.user)
    })
  }else{
    console.log("current member",Members.currentMember.user);
    $scope.members = Members.allMembers
    calcDistance(Members.allMembers, Members.currentMember.user)
  }

  $scope.logout = function(){
    sessionStorage.clear()
    Authorization.clear()
    console.log("all clear");
  }

})


function calcDistance(members, currentMember){
  for (var i = 0; i < members.length; i++) {
    if(members[i].address.geo){
      var latDiff = Number(members[i].address.geo.lat) - Number(currentMember.address.geo.lat)
      var lngDiff = Number(members[i].address.geo.lng) - Number(currentMember.address.geo.lng)
      var distance = Math.sqrt((latDiff*latDiff)+(lngDiff+lngDiff))
      members[i].distance = distance
    }else{
      members[i].distance = 10000;
    }
  }
  console.log("changed Members?", members);
}
