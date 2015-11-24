﻿(function () {

    'use strict';

    angular.module('modules.common.services.service.mediator', [
        'modules.common.services.value.constantes'
    ])

    .service('mediatorService', mediatorService);

    //Injeta dependencias
    mediatorService.$inject = ['constEventosDb', '$rootScope'];

    function mediatorService (constEventosDb, $rootScope) {

        //Variaveis privadas
        var _eventListenQueue = [];
        
        //Api Publica
        this.sendEvent =  sendEvent;
        this.listenEvent =  {
            all: listenEventAll,
            inserted: listenEventInserted,
            removed: listenEventRemoved,
            updated: listenEventUpdated
        };

        //Funções
        function listenEventAll(resource, callbackFunction){
            _listenEventAdd(resource, constEventosDb.INSERIDO, callbackFunction);
            _listenEventAdd(resource, constEventosDb.REMOVIDO, callbackFunction);
            _listenEventAdd(resource, constEventosDb.ATUALIZADO, callbackFunction);
        }
        function listenEventInserted(resource, callbackFunction){
            _listenEventAdd(resource, constEventosDb.INSERIDO, callbackFunction);
        }
        function listenEventRemoved(resource, callbackFunction){
            _listenEventAdd(resource, constEventosDb.REMOVIDO, callbackFunction);
        }
        function listenEventUpdated(resource, callbackFunction){
            _listenEventAdd(resource, constEventosDb.ATUALIZADO, callbackFunction);
        }
        function _listenEventAdd(resource, type, callbackFunction) {
            var hashValue = hashFunction(callbackFunction);

            //Add new Subscriber if it is not already in the list
            if (_.findIndex(_eventListenQueue, { hash: hashValue }) == -1) {
                var listenItem = { resource: resource, type: type, callback: callbackFunction, hash: hashValue };
                _eventListenQueue.push(listenItem);
            }
            //Return an Unsubscribe Event
            return function () {
                var indexItem = _eventListenQueue.indexOf(listenItem);
                if (indexItem > -1) {
                    _eventListenQueue.splice(indexItem, 1);
                }
            }
            //Helper Function
            function hashFunction(data) {
                var value = data.toString();
                var hash = 0;
                if (value.length == 0) return hash;
                for (var i = 0; i < value.length; i++) {
                    var char = value.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash; // Convert to 32bit integer
                }
                return hash;
            }
        };
        
        function sendEvent(resource, type, data, applyScope) {

            var serviceName = resource + "Service";
            var broadcastMessage = { type: type, data: data };

            if (applyScope) {
                broadcastMessage.needScopeApply = true
            }

            //Send event through rootscope
            $rootScope.$broadcast(serviceName, broadcastMessage);

            //Call users who subscribed to event
            var lengthEvent = _eventListenQueue.length;
            for (var e = 0; e < lengthEvent; e++) {
                if (_eventListenQueue[e].resource == resource && _eventListenQueue[e].type == type) {
                    _eventListenQueue[e].callback(broadcastMessage);
                }
            }

            //Apply scope when it comes from hub
            if (!!applyScope) {
                setTimeout(function () {
                    $rootScope.$apply();
                }, 4);
            }
        }
    }
})();