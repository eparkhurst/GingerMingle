app.controller('HomeController', function($scope){
  $scope.myInterval = 5000;
    $scope.slides = [
      {
        image: 'https://scdailymakeover.files.wordpress.com/2012/12/emma_stone_red.jpg',
        comment:"Ginger Mingle is the best place to meet fellow gingers like me",
        user:"Emma Stone"
      },
      {
        image: 'http://www.peency.com/images/2015/06/04/red-hair-girl.jpg',
        comment:"I love Ginger Mingle",
        user:"Hot Girl"
      },
      {
        image: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/CarrotTop.jpg',
        comment:"At Ginger Mingle, I'm not just 'Carrot Top', I'm Scott",
        user:"Scott Thompson"
      },
      {
        image: 'public/images/eliPic.JPG',
        comment:"I'm not just the founder of Ginger Mingle, I'm a user too!",
        user:"Eli"
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
    $http.post('http://galvanize-student-apis.herokuapp.com/gdating/auth/login', $scope.loginForm)
    .then(function(data){
      if(data.data.data.token){
        sessionStorage.setItem('token', data.data.data.token)
        sessionStorage.setItem('lat', data.data.data.user.address.geo.lat)
        sessionStorage.setItem('long', data.data.data.user.address.geo.lng)
        Members.currentMember = data.data.data
        Authorization.go('members')
      }
    })
  }
})


app.controller('MembersController', function($scope, Authorization, Members){
  $scope.modal = false;
  $scope.showMe = function(member){
    $scope.modal = true;
    $scope.member = member
  }
  $scope.toOrder = ''
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
  $scope.like = function(member){
    
  }

})


function calcDistance(members, currentMember){
  for (var i = 0; i < members.length; i++) {
    if(members[i].address.geo){
      var latDiff = Number(members[i].address.geo.lat) - Number(sessionStorage.lat)
      var lngDiff = Number(members[i].address.geo.lng) - Number(sessionStorage.long)
      var distance = Math.sqrt((latDiff*latDiff)+(lngDiff+lngDiff))
      members[i].distance = distance
    }else{
      members[i].distance = 10000;
    }
  }
  console.log("changed Members?", members);
}
