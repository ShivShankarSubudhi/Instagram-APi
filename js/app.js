var instagram = angular.module('instagram', []);
instagram.factory('activeWindow', ['$rootScope',function($rootScope){
	return function(selector){
		var _activeWindow = this;
		_activeWindow.selector = (angular.isDefined(selector))? selector : "";
		_activeWindow.ele = null;
		_activeWindow.onEvents = "scroll";
		_activeWindow.activeHeight = 200;

		_activeWindow.setElement = function(){
			if(_activeWindow.selector != "" && document.querySelector(_activeWindow.selector))
				_activeWindow.ele = angular.element(document.querySelector(_activeWindow.selector));
			return _activeWindow.ele;
		}
		_activeWindow.setEvent  = function(evt){
			_activeWindow.onEvents = evt;
		}
		_activeWindow.setHeight  = function(ht){
			_activeWindow.activeHeight = ht;
		}
		_activeWindow.is_active  = function(){
			var isActive = false;
			var state = _activeWindow.ele.attr('active-state');
			if(angular.isDefined(state) && state == "true" ){
				isActive = true;
			}
			return isActive;
		}
		_activeWindow.mark_active  = function(){
			_activeWindow.ele.attr('active-state','true');
		}
		_activeWindow.unmark_active  = function(){
			_activeWindow.ele.attr('active-state','false');
		}

		_activeWindow.showElement  = function(callBack){
			_activeWindow.setElement();
			if(_activeWindow.ele != null){
				angular.element(window).on(_activeWindow.onEvents, function () {
					var rect = _activeWindow.ele[0].getBoundingClientRect();
					var clw = (window.innerWidth || document.documentElement.clientWidth);
					var clh = (window.innerHeight || document.documentElement.clientHeight) ;
					if((rect.top >= _activeWindow.activeHeight && rect.bottom <= clh + _activeWindow.activeHeight) && (rect.left >= 0 && rect.right <= clw) && !_activeWindow.is_active()){
						_activeWindow.ele.removeClass('active-window');
						if(callBack != null){
							try{
								_activeWindow.mark_active();
								callBack();
							}catch(ex){
								$rootScope.cblog.exception(ex,"Active Window");
							}
						}
					}
				});
				$rootScope.$on("active-window-active", function(event,data) {
					if(data == _activeWindow.selector){
						_activeWindow.mark_active();
					}
				});
				$rootScope.$on("active-window-inactive", function(event,data) {
					if(data == _activeWindow.selector){
						_activeWindow.unmark_active();
					}
				});
			}
		}
	}
}]);
instagram.controller('instCtrl', ['$rootScope','$scope','$http','$timeout','activeWindow',function($rootScope,$scope,$http,$timeout,activeWindow){

    $scope.response = "";
    $scope.limits = 4;
	$scope.check_redirected = false;
    $scope.fetch_url =function (){
        var url = window.location.href;
		if(url.indexOf('=') != -1){
			$scope.check_redirected = true;
	        var url_parts = url.split('=');
	        var code = url_parts[1];
	        form_params = new FormData();
			form_params.append('uCode',code);
	        if(!angular.isUndefined(code)){
	            $.ajax({
	                method  : 'POST',
	                url     : 'login.php',
	                data    : form_params,
	                processData: false,
	                contentType: false
	            }).success(function(data) {
	                if (!data.success) {
	                    $("#not_reg").show();
					} else {
	                    $scope.$apply(function () {
	                        $scope.response = data;
							$('#logoutBtn').show();
							if($scope.response.image_related.data.length  == 0){
								  $('#load_more').hide();
								  $('#no_photos').show();
							}
	                    });
					}
	         });
	      }
		}

    }

    var load_more = "#load_more";
    var loader_img = '<img src="images/ajax-loader.gif" class="text-center"/>';
    $(load_more).html(loader_img);
    var images_aw = new activeWindow(load_more);
    var timeout_id = 0;
    images_aw.setHeight(100);
    images_aw.showElement(function(){
        if($scope.limits  < 20){
            $timeout.cancel(timeout_id);
            timeout_id = $timeout(function(){
                images_aw.unmark_active();
                $scope.limits +=2;
            }, 500);
        }else{
            images_aw.mark_active();
            $('#load_more').hide();
        }
    });
}]);
