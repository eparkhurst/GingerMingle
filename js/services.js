app.service('Authorization', function($state) {
  this.authorized = false;
  this.memorizedState = null;

  var
  clear = function() {
    this.authorized = false;
    this.memorizedState = null;
  },

  go = function(fallback) {
    this.authorized = true;
    var targetState = this.memorizedState ? this.memorizedState : fallback;
    $state.go(targetState);
  };

  return {
    authorized: this.authorized,
    memorizedState: this.memorizedState,
    clear: clear,
    go: go
  };
});

app.factory('Members', function($http){
  return{
    getMembers:function(){
      return $http.get('http://galvanize-student-apis.herokuapp.com/gdating/members').then(function(data){
        this.allMembers = data.data.data
        console.log(this.allMembers);
        return data
      },function error(data){
        console.log("an error occurred",data);
      })
    },
    allMembers:[],
    currentMember:{}
  }
})
