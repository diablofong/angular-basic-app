app
    .controller('CountryIndex', ['$scope', 'rest', 'toaster', function ($scope, rest, toaster) {

        rest.url = 'http://localhost/yii2-RESTful-Template/api/web/v1/countries';

        var errorCallback = function (data) {
            toaster.clear();
            toaster.pop('error', "status: " + data.status + " " + data.name, data.message);
        };

        rest.get().success(function (data) {
            $scope.posts = data;
        }).error(errorCallback);

    }]);