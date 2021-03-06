/**
 * Created by Ascarbek on 02.12.2015.
 */
(function(){
    'use strict';

    angular
        .module('azSuggestBox')
        .directive('sbTypeAhead', [function(){
            return {
                restrict: 'A',
                link: function(scope, element, attrs, ctrl){

                    element.on('keydown', function(e){
                        switch (e.keyCode) {
                            case 40:
                            {
                                // down
                                scope.openDropDown();
                                scope.highlightNextItem();
                                e.preventDefault();
                            }
                                break;

                            case 38:
                            {
                                // up
                                scope.highlightPrevItem();
                                e.preventDefault();
                            }
                                break;

                            case 13:
                            case 9:
                            {
                                if (scope.highlightedItem > -1) {
                                    scope.toggleItemSelection(scope.highlightedItem);
                                }
                                else {
                                    if((scope.sbAllowFreeText)&&(element.val().length > 0)){
                                        var newObj = {};
                                        newObj[scope.sbNewItemField] = element.val();
                                        newObj['$isNew'] = true;

                                        if(scope.sbAllowAddItem){
                                            scope.list.splice(scope.list.length, 0, newObj);
                                            scope.toggleItemSelection(scope.list.length - 1);
                                        }
                                        else{
                                            scope.model.push(newObj);
                                        }
                                    }
                                    else{

                                    }
                                }
                                if(e.keyCode == 13){
                                    scope.closeDropDown();
                                    scope.highlightNone();
                                    scope.$broadcast('clearSearch');
                                }
                                if(e.keyCode == 9){
                                    scope.closeDropDown();
                                    scope.highlightNone();
                                    scope.$broadcast('clearSearch');
                                }
                            }
                                break;

                            case 27:
                            {
                                scope.closeDropDown();
                                scope.$emit('clearSearch');
                                scope.highlightNone();
                                e.preventDefault();
                            }
                                break;

                            case 8:
                            {
                                //backspace
                                if ((element.val().length == 0)&&(scope.model.length>0)) {
                                    if(scope.model[scope.model.length-1].$isNew){
                                        scope.model.pop();
                                    }
                                    else {
                                        scope.unSelectListItem(scope.indexes.pop());
                                        scope.model.pop();
                                    }
                                }
                            }
                                break;
                        }

                        scope.$apply();
                    });

                    element.on('input', function(){
                        performSearch();
                    });

                    scope.$on('clearSearch', function(){
                        element.val('');

                        for(var i=0; i<scope.list.length; i++){
                            scope.showListItem(i);
                        }
                        if(!scope.sbAllowDuplicates) {
                            scope.indexes.forEach(function (i) {
                                scope.selectListItem(i);
                            });
                        }
                    });

                    function performSearch(){
                        scope.openDropDown();

                        var text = element.val().toLowerCase();

                        var foundCount = 0, lastId = -1;

                        scope.highlightNone();

                        for(var i=0; i<scope.list.length; i++){
                            if(text.length == 0){   // show all if search is empty
                                scope.showListItem(i);
                                foundCount++;
                                lastId = i;
                            }
                            else{
                                var listItem = scope.list[i];

                                for(var sf=0; sf<scope.sbSearchFields.length; sf++){
                                    var obj, key=scope.sbSearchFields[sf];
                                    if(typeof listItem[key] == 'string') {
                                        obj = listItem[key].toLowerCase();
                                    }
                                    else if(typeof listItem[key] == 'number'){
                                        obj = listItem[key].toString();
                                    }
                                    else{
                                        continue;
                                    }

                                    if(obj.search(new RegExp(text)) > -1){
                                        scope.showListItem(i);
                                        if(scope.indexes.indexOf(i) == -1) {
                                            foundCount++;
                                            lastId = i;
                                        }

                                       break;
                                    }
                                    else{
                                        scope.hideListItem(i);
                                    }
                                }
                            }
                        }

                        if(!scope.sbAllowDuplicates) {
                            scope.indexes.forEach(function (i) { // hide selected items
                                scope.selectListItem(i);
                                if (lastId == i) {
                                    lastId = -1;
                                    foundCount = 2;
                                }
                            });
                        }

                        if(foundCount == 1){
                            scope.highlightListItem(lastId);  // highlight the only item
                        }
                    }
                }
            }
        }]);
})();
