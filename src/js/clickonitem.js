/**
 * Created by LuigiDaVinci on 12.10.2019.
 */
(function() {
    'use strict';

    angular
        .module('azSuggestBox')
        .directive('sbClickItem', [function() {
            return {
                restrict: 'E',
                scope: {
                    sbSelectionItemData: '=?'
                },
                link: function($scope, $element) {

                    $element.on('click', function() {
                        $scope.$emit('callback', $scope.sbSelectionItemData);
                    });

                }
            }
        }])
})();
