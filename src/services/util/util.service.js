import angular from 'angular';
import _ from 'lodash';
export default angular.module('eptAdmin.service.util',[])
	.service('UtilService',[function(){
		var service = this;
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
		service.downloadAsCsv = function(fileName,rows) {
			if(rows.length === 0){
				return;
			}
			if(typeof rows[0] === 'object') {
				return exportToCsv(fileName,convertToRows(rows));
			}else{
				return exportToCsv(fileName,rows);
			}
		}
		service.formatDate = function(date){
			return date.toISOString().slice(0, 10);
		};
		// format 600 to 10:00
		service.formatSeconds = function(seconds){
			var min = Math.floor(seconds/60);
			var sec = seconds%60;
			if(min < 10){
				min = "0"+min;
			}else{
				min = min+"";
			}
			if(sec < 10){
				sec = "0" + sec;
			}else{
				sec = sec +""; //make sure sec is string
			}
			return min+":"+sec;
		}
		// given an array, including indices `from` but excluding `to`
		// randomly shuffle elements in between,
		// e.g. shuffleArray([1,2,3,4],0,4) => [4,3,1,2] all elements shuffled
		service.shuffleArray = function(array,from,to){
			for (var i = from; i < to; i++) {
				var r = Math.floor(Math.random()*(to - i)) + i;
				service.swap(array,i,r);
			};
		};

		service.swap = function(array,i,j){
			var temp = array[i];
			array[i] = array[j];
			array[j] =  temp;
		};
	}])
	.name;
	