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
        comment:"I'm not just the founder of Ginger Mingle, I'm also a member!",
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
        sessionStorage.setItem('user', JSON.stringify(data.data.data.user))

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
        sessionStorage.setItem('user', JSON.stringify(data.data.data.user))
        Authorization.go('members')
      }
    })
  }
})


app.controller('MembersController', function($scope, Authorization, Members){
  var user = JSON.parse(sessionStorage.user)
  console.log(user);
  $scope.modal = false;
  $scope.filterMatches = false;
  $scope.member = {}


  $scope.showMe = function(member){
    $scope.modal = true;
    $scope.member = member;
  }
  $scope.toOrder = ''
  if(Members.allMembers.length == 0){
    Members.getMembers().then(function(data){
      Members.allMembers = data.data.data
      $scope.members = Members.allMembers
      calcDistance(Members.allMembers)
    })
  }else{
    $scope.members = Members.allMembers
    calcDistance(Members.allMembers)
  }
  $scope.logout = function(){
    sessionStorage.clear()
    Authorization.clear()
    console.log("all clear");
  }

  $scope.like = function(member){
    Members.match(user._id, member._id)
    user.matches.push(member._id)
    sessionStorage.setItem('user', JSON.stringify(user))

  }
  $scope.checkMatch= function(member){
    return checkMatchInt(user._matches, member._id)
  }
  $scope.matchFilter = function(val){
    if($scope.filterMatches){
      var matches = user._matches
      for (var i = 0; i < matches.length; i++) {
        if(matches[i] == val._id){
          return val
        }
      }
    }else{
      return val
    }
  }

})

function checkMatchInt(userMatches, memberId){
  if(userMatches.includes(memberId)){
    return true
  }else{
    return false
  }

}

function calcDistance(members){
  for (var i = 0; i < members.length; i++) {
    if(members[i].address.geo){
      var user= JSON.parse(sessionStorage.user)
      var latDiff = Number(members[i].address.geo.lat) - Number(user.address.geo.lat)
      var lngDiff = Number(members[i].address.geo.lng) - Number(user.address.geo.lng)
      var distance = Math.sqrt((latDiff*latDiff)+(lngDiff+lngDiff))
      members[i].distance = distance
    }else{
      members[i].distance = 10000;
    }
  }
  console.log("changed Members?", members);
}
