//console.log('Testing main app configuration');

angular.module('userApp',['appRoutes','userControllers','userServices','ngAnimate','mainController','authServices','managementController']) //5

/*.config(function(){
    console.log('testing user application');
});*/
.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptors');
});