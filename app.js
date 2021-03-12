(function () {
    'use strict';
  
    angular.module('report', ['ngMaterial', 'mdDataTable', 'googlechart', 'ngAnimate', 'ngSanitize', 'ui.bootstrap']);
    angular.module('report')
    .controller('ReportController', function ($scope, $location, $anchorScroll, $sce) {
        $scope.models;
        $scope.activeModel;
        $scope.orderList;
        $scope.total_diff_value; 
        $scope.aver_diff_proc; 
        $scope.showChart = false;
        $scope.showBar = false;
        $scope.item_name = "";
        $scope.item_description = "";
        $scope.item_img = "https://toekick.ctechmanufacturing.com/BOMDB/GetLineItemImage?transaction=66979&itemid=Copy of C_11997";
        var file;

        var data = {
            "type": "ColumnChart",
            "displayed": false,
            "cssStyle": "height:600px;width: 100%",
            "data": {
                "cols": [
                {
                    "label": "Model",
                    "type": "string"
                },
                {
                    "label": "Old value",
                    "type": "number"
                },
                {
                    "label": "New value",
                    "type": "number"
                }
            ],
            "rows": [            
            ]
            },
            "options": {
                "title": "Report chart",
                "isStacked": "false",
                "fill": 20,
                "displayExactValues": true,
                "vAxis": {
                    "title": "Value",
                    "gridlines": {
                        "count": 10
                    }
                },
                "hAxis": {
                    "title": "Model"
                }
            }
        };

        function showBar() {        
            $scope.showBar = true;
        }

        $scope.bar = async function tasks() {
            showBar();
            $scope.readModels();
        }

        $scope.readModels = function() {
            file = JSON.parse(fileInput);   
            $scope.orderList = file.body;   
            $scope.total_diff_value = file.total_diff_value; 
            $scope.aver_diff_proc = file.aver_diff_proc; 
            $scope.showBar = false;
        };

        $scope.gotoBottom = function(value) {
            $scope.showChart = true;
            var s = file.body.find(b => b.id === value);
            data.data.rows = s.chart;  
            data.options.title = 'Order: '+ s.order_name;
            $scope.item_name = 'Order: '+ s.order_name;
            $scope.item_description = $sce.trustAsHtml(s.description);
            $scope.item_img = s.image;
            $scope.chart = data; 
            $location.hash('bottom');
            $anchorScroll();

        };

        $scope.gotoTop = function() {
            $location.hash('top');
            $anchorScroll();
            $scope.showChart = false;
        };


        $scope.chartReady = function() {
            fixGoogleChartsBarsBootstrap();
        };

        function fixGoogleChartsBarsBootstrap() {
            $(".google-visualization-table-table img[width]").each(function(index, img) {
                $(img).css("width", $(img).attr("width")).css("height", $(img).attr("height"));
            });
        };

        $scope.selectedRowCallback = function(value){
            $scope.selectModel(value);      
        };
    });

    var fileInput;
    
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('file').addEventListener('change', function onChange(event) {
            var reader = new FileReader();
            reader.onload = function(event){
                    fileInput = event.target.result;
                };
                reader.readAsText(event.target.files[0]);
        });
    }, false);
})();