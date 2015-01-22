
/*
	Philipp Gfeller @ Maxomedia AG, 22.01.2015


	Equalize the height of elements in a specific 
	container based on the row they are in.

	Requirements:
		- jQUery
		- Elements of equal width

	Features:
		- Waits for images to be loaded
		- Per row euqalization
*/

+function ($){

	// Shared variables (accross modules)
	var DEFAULT = {
		updateEventName: 'resize'
	};
	var equalizeAgain;

	// Initialize module
	function equalize(userOptions) {

		// Merge options
		var options = $.extend({}, DEFAULT, userOptions);
		
		// Module variables
		var $scope = $(this);
		var $children = $scope.find(options.childSelector);
		var $images = $scope.find('img');

		// Escape if it is not worth it
		if ($children.length == 0) return;

		// On resize
		$(window).on(options.updateEventName, updateRows);

		// Initialize
		updateRows();

		// Initializer function
		function updateRows(){
			imagesLoaded($images, function () {
				var rows = getRows($scope, $children);
				for (var i = 0; i < rows.length; i++) {
					recalculate( rows[i] );
				}
			});
		}

		// Make initializer function available to the plugin definition
		equalizeAgain = updateRows;
	};

	// Wait for images to be loaded, then callback
	function imagesLoaded($images, callback) {

		imagesLoaded.counter = 0;

		if($images.length <= 0) {
			callback();
		} else {
			$images.each(function() {
				var img = new Image();
				img.onload = img.onerror = function() {
					imagesLoaded.counter++;
					if(imagesLoaded.counter >= $images.length){
						callback();
					}
				};

				img.src = $(this).attr('src') + '?' + new Date().getTime();
			});
		}
	};

	// Update height on $elements
	function recalculate(elements){
		var height = getHeight(elements);
		setHeight(elements, height);
	};

	// Get array of rows
	function getRows ($scope, $elements) {
		var rows = [];
		var row = [];
		var elementsPerRow = Math.round($scope.width() / $elements.eq(0).width());

		$elements.each(function (index, element) {

			var index = getIndex(element);

			// Save and reset
			if (index % elementsPerRow == 0 && index > 0) {
				rows.push(row);
				row = [];
			}

			row.push(element);
		});

		// Save the last elements as well
		if (row.length > 0) rows.push(row);

		return rows;
	}

	// Vanilla JS version of $element.index();
	function getIndex (element) {

	    var self = element;
	    var parent = self.parentNode;
	    var i = 0;

	    while (self.previousElementSibling) {
	        i++;
	        self = self.previousElementSibling;
	    }

	    return element === parent.children[i] ? i : -1;
	}

	// Get highest height
	function getHeight(elements){
		var maxHeight = 0;
		for (var i = 0; i < elements.length; i++) {

			elements[i].style.height = 'auto';

			if(maxHeight < elements[i].offsetHeight){
				maxHeight = elements[i].offsetHeight;
			}
		}

		return maxHeight;
	};

	// Set heights and height: auto
	function setHeight(elements, height){
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.height = height + 'px';
		}
	};

	// Extend jQuery
	$.fn.extend({
		equalize: function (options) {
			this.each(function () {
				equalize.apply($(this), [options]);
			});

			return this;
		},
		equalizeAgain: function () {
			this.each(function () {
				equalizeAgain.apply($(this));
			});

			return this;
		}
	});
}(
	// Inject dependencies
	jQuery
);