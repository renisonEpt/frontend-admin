import angular from 'angular';
import _ from 'lodash';
export default angular.module('eptAdmin.service.util',[])
	.service('UtilService',[function(){
		// given a string filename and an array of array (rows)
		// perform download csv
		function exportToCsv(filename, rows) {
		        var processRow = function (row) {
		            var finalVal = '';
		            for (var j = 0; j < row.length; j++) {
		                var innerValue = row[j] === null ? '' : row[j].toString();
		                if (row[j] instanceof Date) {
		                    innerValue = row[j].toLocaleString();
		                };
		                var result = innerValue.replace(/"/g, '""');
		                if (result.search(/("|,|\n)/g) >= 0)
		                    result = '"' + result + '"';
		                if (j > 0)
		                    finalVal += ',';
		                finalVal += result;
		            }
		            return finalVal + '\n';
		        };

		        var csvFile = '';
		        for (var i = 0; i < rows.length; i++) {
		            csvFile += processRow(rows[i]);
		        }

		        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
		        if (navigator.msSaveBlob) { // IE 10+
		            navigator.msSaveBlob(blob, filename);
		        } else {
		            var link = document.createElement("a");
		            if (link.download !== undefined) { // feature detection
		                // Browsers that support HTML5 download attribute
		                var url = URL.createObjectURL(blob);
		                link.setAttribute("href", url);
		                link.setAttribute("download", filename);
		                link.style.visibility = 'hidden';
		                document.body.appendChild(link);
		                link.click();
		                document.body.removeChild(link);
		            }
		        }
		}

		// given array of objects, return an array of array
		// put all keys in the first object as the header
		// the corresponding values are subsequent rows
		// e.g. [{'price':1}] -> [['price'],[1]]
		function convertToRows(objs){
			if (objs.length === 0){
				return [];
			}

			var header = _.keys(objs[0]);
			var values = _.map(objs,function(o){
				return _.values(o);
			});
			return [header].concat(values);
		}
		this.downloadAsCsv = function(fileName,rows) {
			if(rows.length === 0){
				return;
			}
			if(typeof rows[0] === 'object') {
				return exportToCsv(fileName,convertToRows(rows));
			}else{
				return exportToCsv(fileName,rows);
			}
		}
		this.formatDate = function(date){
			return date.toISOString().slice(0, 10);
		};
	}])
	.name;
	