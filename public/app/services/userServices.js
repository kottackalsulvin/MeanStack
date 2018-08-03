//console.log('testing user services');
angular.module('userServices',[])
/*.config(function(){
    console.log('testing user services');
});*/
.factory('User',function($http){
    userFactory={};

   // User.create(regData)
//Provide the user with a new token
userFactory.create=function(regData){
    return $http.post('/api/users',regData);
};
userFactory.getPermission=function(){ //9
    return $http.get('/api/permission');
};
userFactory.getUsers=function(){ //16
    return $http.get('/api/management');
};

userFactory.getUser =function(id){ //38
    return $http.get('/api/edit/' + id);
}

userFactory.deleteUser=function(username){ //28
    return $http.delete('/api/management/' + username);
}  

userFactory.editUser=function(id){ //41
    return $http.put('/api/edit',id);
}

    return userFactory; //Return userFactory object
});