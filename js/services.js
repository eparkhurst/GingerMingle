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
        return data
      },function error(data){
      })
    },
    match:function(id,match_id){
      return $http.post('http://galvanize-student-apis.herokuapp.com/gdating/members/'+id+'/matches',{_match:match_id}).then(function(data){
        console.log(data);
        return data
      },function error(data){
      })
    },
    allMembers:[],
  }
})
