//console.log('Testing routes file');

var app=angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider, $locationProvider){
    //console.log('testing user application');

    $routeProvider
    
    .when('/', {
    templateUrl:'app/views/pages/home.html'
    })

    .when('/about',{
            templateUrl:'app/views/pages/about.html'
    })

    .when('/register',{
        templateUrl: 'app/views/pages/users/register.html',
        controller: 'regCtrl',
        controllerAs: 'register',
        authenticated:false
    })

    .when('/login',{
        templateUrl:'app/views/pages/users/login.html',
        // controller : 'mainCtrl',
        // controllerAs : 'main'
        authenticated:false
    })

    .when('/logout',{
        templateUrl:'app/views/pages/users/logout.html',
        authenticated:true
    })

    .when('/profile',{
        templateUrl:'app/views/pages/users/profile.html',
        authenticated:true
    })

    .when('/management',{ //2
        templateUrl:'app/views/pages/management/management.html',
        controller : 'managementCtrl',
        controllerAs : 'management',
        authenticated:true,
        permission:['admin','moderator']
        
    })

    .when('/edit/:id',{ //32
        templateUrl:'app/views/pages/management/edit.html',
        controller : 'editCtrl',
        controllerAs : 'edit',
        authenticated:true,
        permission:['admin','moderator']
        
    })

    .otherwise({redirectTo: '/'}); //If user tries to access any other route,redirect to home page

    $locationProvider.html5Mode({
        enabled:true,
        requireBase:false
    });
});

app.run(['$rootScope','Auth', '$location','User', function($rootScope,Auth,$location,User){ //10 User
    $rootScope.$on('$routeChangeStart',function(event,next,current){
        //console.log(Auth.isLoggedIn());
       // console.log(next.$$route.authenticated);
       if(next.$$route.authenticated==true){
          // console.log('needs to be authenticated');
          if(!Auth.isLoggedIn()){
              event.preventDefault();
              $location.path('/');
          }
          else if(next.$$route.permission){ //7
              User.getPermission().then(function(data){ //11
               // console.log(data);
               if(next.$$route.permission[0]!==data.data.permission){
                   if(next.$$route.permission[1]!==data.data.permission){
                    event.preventDefault();
                    $location.path('/');
                   }
               }
              });

          }
       }
       else if(next.$$route.authenticated==false)
       {
           //console.log('should not be authenticated');
            if(Auth.isLoggedIn()){
              event.preventDefault();
              $location.path('/profile');
            }
        }
    //    else{
    //        console.log('authentication does not matter');
    //    }
    });
}]);