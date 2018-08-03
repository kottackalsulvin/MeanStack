angular.module('managementController',[]) //3
.controller('managementCtrl',function(User){
   console.log('test');
   var app=this; //17

   app.loading=true;
   app.accessDenied=true;
   app.errorMsg=false;
   app.editAccess=false;
   app.deleteAccess=false;
   app.limit=5; //21

 function getUsers(){
    User.getUsers().then(function(data){
        if(data.data.success){
            console.log(data);
            if(data.data.permissions === 'admin' || data.data.permissions==='moderator'){
            console.log('d');
             app.users=data.data.users;
             app.loading=false;
             app.accessDenied=false;
                 if(data.data.permissions==='admin'){
                     app.editAccess=true;
                     app.deleteAccess=true;
                 }else if(data.data.permissions==='moderator'){
                    
                     app.editAccess=true;
             }
            }else{
                app.errorMsg='Insufficient Permissions';
                app.loading=false;
            }
        }
        else{
            app.errorMsg=data.data.message;
            app.loading=false;
        }
 
    });
 }
  
 getUsers();

   app.showMore=function(number){ //23
    app.showMoreError=false;

    if(number>0){
        app.limit=number;
    }
    else{
        app.showMoreError="Please enter a valid number";
    }

   };
   app.showAll=function(){
    app.limit=undefined; //25
    app.showMoreError=false;
    
   };

   app.deleteUser=function(username){ //29
       User.deleteUser(username).then(function(data){
           if(data.data.success){
                getUsers();
           }else{
               app.showMoreError=data.data.message;
           }
       });
   };

})

.controller('editCtrl',function($scope,$routeParams,User,$timeout){ //34 ,39
    var app=this;
    $scope.nameTab="active";
    //$scope.emailTab="active";
    app.phase1=true;
    
    User.getUser($routeParams.id).then(function(data){ //39
        if(data.data.success){
            console.log(data);
            $scope.newName=data.data.user.name;
           
            $scope.newEmail=data.data.user.email; //43
            $scope.newUsername=data.data.user.username;
            $scope.newPermission=data.data.user.permission;
            app.currentUser=data.data.user._id; //42
            console.log(app.currentUser);
            console.log($scope.newEmail);
            console.log($scope.newName + ' nameNew');

        }
        else{
            app.errorMsg=data.data.message;
        }
    });

    app.namePhase=function(){
        $scope.nameTab='active';
        $scope.permissionsTab='default';
        $scope.emailTab='default';
        $scope.usernameTab='default';
        app.phase1=true;
        app.phase3=false;
        app.phase2=false;
        app.phase4=false;
        app.errorMsg=false;
    };

    app.emailPhase=function(){
        $scope.nameTab='default';
        $scope.emailTab='active';
        $scope.usernameTab='default';
        $scope.permissionsTab='default';
        app.phase1=false;
        app.phase3=true;
        app.phase2=false;
        app.phase4=false;
        app.errorMsg=false;
    };

    app.usernamePhase=function(){
        $scope.nameTab='default';
        $scope.usernameTab='active';
        $scope.emailTab='default';
        $scope.permissionsTab='default';
        app.phase1=false;
        app.phase3=false;
        app.phase2=true;
        app.phase4=false;
        app.errorMsg=false;
    };

    app.permissionsPhase=function(){
        $scope.nameTab='default';
        $scope.permissionsTab='active';
        $scope.emailTab='default';
        $scope.usernameTab='default';
        app.phase1=false;
        app.phase3=false;
        app.phase2=false;
        app.phase4=true;
        app.disableUser=false;
        app.disableModerator=false;
        app.disableAdmin=false;
        app.errorMsg=false;

        if($scope.newPermission === 'user'){
            app.disableUser=true;
        } else if($scope.newPermission === 'moderator'){
            app.disableModerator=true;
        } else if($scope.newPermission === 'admin'){
            app.disableAdmin=true;
        }
    };

    app.updateName=function(newName,valid){ //36
        app.errorMsg=false;
        app.disabled=true;
        var userObject={}; //42

        console.log("name");
        console.log("newname"+ newName);

        if(valid){
            userObject._id=app.currentUser; //42
            userObject.name=$scope.newName;
            console.log(userObject._id + 'id');
            console.log(userObject.name + 'nameObject');
            User.editUser(userObject).then(function(data){ 
                if(data.data.success){
                    app.successMsg=data.data.message;
                    $timeout(function(){
                        app.nameForm.name.$setPristine();
                        app.nameForm.name.$setUntouched();
                        app.successMsg=false;
                        app.disabled=false;
                    },2000);
                }else{
                    app.errorMsg=data.data.message;
                    app.disabled=false;
                }
            }); 
            
        }else{ //36
            app.errorMsg='Please ensure form is filled out properly';
            app.disabled=false;
        }
    };

    app.updateEmail=function(newEmail,valid){ //43
        app.errorMsg=false;
        console.log("enter");
        console.log("newemil"+newEmail);
        app.disabled=true;
        var userObject={}; 

        if(valid){
            userObject._id=app.currentUser; 
            userObject.email=$scope.newEmail;
            console.log(userObject.email);
            User.editUser(userObject).then(function(data){ 
                if(data.data.success){
                    app.successMsg=data.data.message;
                    $timeout(function(){
                        app.emailForm.email.$setPristine();
                        app.emailForm.email.$setUntouched();
                        app.successMsg=false;
                        app.disabled=false;
                    },2000);
                }else{
                    app.errorMsg=data.data.message;
                    app.disabled=false;
                }
            }); 
            
        }else{ 
            app.errorMsg='Please ensure form is filled out properly';
            app.disabled=false;
        }
    };

    app.updateUsername=function(newUsername,valid){ //45
        app.errorMsg=false;
        console.log("enter");
        console.log("newusername"+newUsername);
        app.disabled=true;
        var userObject={}; 

        if(valid){
            userObject._id=app.currentUser; 
            userObject.username=$scope.newUsername;
            console.log(userObject.username);
            User.editUser(userObject).then(function(data){ 
                if(data.data.success){
                    app.successMsg=data.data.message;
                    $timeout(function(){
                        app.usernameForm.username.$setPristine();
                        app.usernameForm.username.$setUntouched();
                        app.successMsg=false;
                        app.disabled=false;
                    },2000);
                }else{
                    app.errorMsg=data.data.message;
                    app.disabled=false;
                }
            }); 
            
        }else{ 
            app.errorMsg='Please ensure form is filled out properly';
            app.disabled=false;
        }
    };

    app.updatePermissions=function(newPermission,valid){ //47
        app.errorMsg=false;
        //console.log("enter");
        //console.log("newpermission"+newPermission);
        app.disableUser=true;
        app.disableModerator=true;
        app.disableAdmin=true;
        var userObject={}; 

            userObject._id=app.currentUser; 
            userObject.permission=newPermission;
            //console.log(userObject.permission);
            User.editUser(userObject).then(function(data){ 
                if(data.data.success){
                    app.successMsg=data.data.message;
                    $timeout(function(){
                        app.successMsg=false;
                      
                        if(newPermission === 'user'){
                            $scope.newPermission='user';
                            app.disableUser=true;
                            app.disableModerator=false;
                            app.disableAdmin=false;
                        } else if(newPermission === 'moderator'){
                            $scope.newPermission='moderator';
                            app.disableUser=false;
                            app.disableModerator=true;
                            app.disableAdmin=false;
                        } else if(newPermission === 'admin'){
                            $scope.newPermission='admin';
                            app.disableUser=false;
                            app.disableAdmin=true;
                            app.disableModerator=false;
                        }

                    },2000);
                }else{
                    app.errorMsg=data.data.message;
                    app.disabled=false;
                }
            }); 
     };

});