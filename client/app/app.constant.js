(function(angular, undefined) {
  angular.module("nodeApp.constants", [])

.constant("appConfig", {
	"userRoles": [
		"guest",
		"user",
		"admin"
	]
})

;
})(angular);