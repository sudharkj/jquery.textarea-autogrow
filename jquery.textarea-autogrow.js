/**
 * 
 */

"use_strict";

(function($) {
  /**
   * @constructor
   * @param {HTMLElement}
   *          element DOM element which is going to autogrow
   * @param {Object}
   *          options option map
   */
  Watcher = function(element, options) {
    this.element = $(element);
    this.options = $.extend({}, Watcher.defaults, options);
  };

  Watcher.defaults = {
    minRows: 2,
    onUpdateFixed: null
  };

  Watcher.prototype = {
    element: null,
    options: null,
    attached: false,

    /**
     * Attach the watcher
     */
    attach: function() {
      if (this.attached) { throw new Error('Already attached'); }

      var that = this;

      this.updateEventHandler = function(event) {
        that.pulse(event);
      };

	  this.element.unbind('keyup');
	  this.element.css('resize', 'none');
	  this.element.css('height', 'auto');
      this.element.keyup(this.updateEventHandler);

      this.attached = true;
      this.pulse();
    },

    /**
     * Detach the watcher
     */
    detach: function() {
      if (!this.attached) { throw new Error('Not attached'); }

      this.element.unbind('keyup', this.updateEventHandler);

      this.attached = false;
    },

    /**
     * Pulse the watcher
     */
    pulse: function(event) {
      if (event && (event.which == 8 || event.which == 13 || event.which == 46)) {
        this.element.attr("rows", Math.max(this.options.minRows, this.element
                .val().split("\n").length));
      }
    }
  };

  // jQuery methods

  /**
   * Attach a watcher to the matched element
   * 
   * @param {Object}
   *          options watcher option map
   * @returns {Array(autogrow.Watcher)} array of created watchers
   */
  $.fn.autogrow = function(options) {

    return this.each(function(index, element) {

      var watcher = new Watcher(element, options);
      watcher.attach();

      return watcher;
    });
  };
})(jQuery);