var app = angular.module('myApp', ['ngRoute', 'ngAnimate', 'toaster', 'ngSanitize', 'mgcrea.ngStrap']);

app.config(['$locationProvider', '$routeProvider', '$httpProvider', function ($locationProvider, $routeProvider, $httpProvider) {

    var modulesPath = 'modules';

    $routeProvider

        .when('/', {
            templateUrl: modulesPath + '/site/views/main.html'
        })

        .when('/country', {
            templateUrl: modulesPath + '/country/views/index.html',
            controller: 'CountryIndex'
        })

        .when('/404', {
            templateUrl: '404.html'
        })

        .otherwise({ redirectTo: '/404' })
    ;

    //$httpProvider.interceptors.push('authInterceptor');

}]);

//進行頁面驗證,假如無法通過驗證,需要重新登入
app.factory('authInterceptor', function ($q, $window) {
    return {
        request: function (config) {
            if ($window.sessionStorage._auth) {
                config.headers.Authorization = 'Basic ' + $window.sessionStorage._auth;
            }
            return config;
        },
        responseError: function (rejection) {
            if (rejection.status === 401) {
                $window.location = 'login';
            }
            return $q.reject(rejection);
        }
    };
});

app.value('app-version', '1.0.0');

//RESTful Api
app.service('rest', function ($http, $location, $routeParams) {

    return {

        url: undefined,

        models: function () {
            return $http.get(this.url + location.search);
        },

        model: function () {
            return $http.get(this.url + "/" + $routeParams.id + "?expand=comments");
        },

        get: function () {
            return $http.get(this.url);
        },

        postModel: function (model) {
            return $http.post(this.url, model);
        },

        putModel: function (model) {
            return $http.put(this.url + "/" + $routeParams.id, model);
        },

        deleteModel: function (model) {
            return $http.delete(this.url + "/" + $routeParams.id, model);
        }
    };

});

//登入套件
app.directive('login', ['$http', function ($http) {
    return {
        transclude: true,
        link: function (scope, element, attrs) {
            if (window.sessionStorage._auth != undefined) {
                var loginurl = '';
                $http.get('loginurl').success(
                    function (data) {
                        scope.username = data[0].username;
                    }
                );
            }
        },

        template: '<a href="#login" ng-if="!username">Login</a><a href="#logout" ng-if="username">Logout ({{username}})</a>'
    };
}]);
