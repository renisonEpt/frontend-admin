import core from "renison-ept-frontend-core";
// import 'materialize-css';
// import 'materialize-css/bin/materialize.css';
import angular from 'angular';

import uirouter from 'angular-ui-router'; // by  default importing angular-ui-router would not 
// return an object, but would rather return the name of the module 'ui.router'
// so that we can directly include it in angular.module
import routing from './app.config';
import test from "./features/test";
import auth from "./features/auth";
angular.module('EPTAdmin', [uirouter, core,test,auth])
	.config(routing)
    .run(['$rootScope','$document',function($rootScope,$document){
        $rootScope.loadingbarShown = false;
        $rootScope.showLoader = function(){
            $rootScope.loadingbarShown = true;
        };
        $rootScope.hideLoader = function(){
            $rootScope.loadingbarShown = false;
        };
        $rootScope.$on('$stateChangeStart',function(){
            $rootScope.showLoader();
        });
        $rootScope.$on('$stateChangeSuccess',function(){
            $rootScope.hideLoader();
        });
        $rootScope.$on('$stateNotFound',function(){
            $rootScope.hideLoader();
        });
        $rootScope.$on('$stateChangeError',function(){
            $rootScope.hideLoader();
        });
        $rootScope.$on('loadingStart',function(){
            $rootScope.showLoader();
        });
        $rootScope.$on('loadingEnd',function(){
            $rootScope.hideLoader();
        });
    }])

