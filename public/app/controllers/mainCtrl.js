 //console.log('testing user main controller');
 angular.module('mainController',['authServices'])

 .controller('mainCtrl',function(Auth,$timeout,$location,$rootScope,User){
     //console.log('testing main ctrl');
     var app=this;

   app.loadme=false;

   $rootScope.$on('$routeChangeStart',function(){
        
        if(Auth.isLoggedIn()){
           // console.log('Success:User is logged in.');
           app.isLoggedIn=true;
            Auth.getUser().then(function(data){
               // console.log(data.data.username);
                //console.log(data);
                app.username=data.data.username;
                app.useremail=data.data.email;

                User.getPermission().then(function(data){//12
                   //console.log(data);
                    if(data.data.permission==='admin' || data.data.permission=== 'moderator'){
                        console.log("data");
                        app.authorized=true;
                        app.loadme=true;
                    }
                    //else{
                        app.loadme=true;
                    //}
                });

            });
        }
        else{
           // console.log('Failure: User is Not logged in.');
           app.isLoggedIn=false;
            app.username='';
            app.loadme=true;
        }
   });



 this.doLogin =function(loginData){
        app.loading=true;
        app.errorMsg=false;
     //  console.log('form submitted');

        Auth.login(app.loginData).then(function(data){
            if(data.data.success){
                app.loading=false;
                //Create success message
                app.successMsg=data.data.message + '...Redirecting';
            //Redirect to home page
                $timeout(function(){
                    $location.path('/about');
                    app.loginData={};
                    app.successMsg=false;
                },2000); 
            }
            else{
               //Create an error message
                app.loading=false;
                app.errorMsg=data.data.message;
            }
            
        });
    };

    this.logout=function(){
        Auth.logout();
        $location.path('/logout');
        $timeout(function(){
            $location.path('/');
        },2000);
    };
});

 



 