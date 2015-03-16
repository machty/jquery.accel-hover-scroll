
/*
# AccelHoverScroll v0.1
# Accelerated Hoverscroll: mouse over the left or right sides
# of a container and the containerw will scroll in that direction,
# the closer to the edge of the container the faster it goes.
#
# Do as thou wilt with this code but send any surplus love
# over to usefulrobot.io
#
# Copyright 2012 Alex Matchneer / Useful Robot
*/


(function() {
  var $,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = jQuery;

  $.AccelHoverScroll = (function() {

    function AccelHoverScroll(element, options) {
      var position;
      if (options == null) {
        options = {};
      }
      this._onMouseMove = __bind(this._onMouseMove, this);

      this._reset = __bind(this._reset, this);

      this._onMouseLeave = __bind(this._onMouseLeave, this);

      this._onMouseEnter = __bind(this._onMouseEnter, this);

      this._onResize = __bind(this._onResize, this);

      this.$outerContainer = $(element);
      this.dimen = {};
      this.options = {
        maxScrollSpeed: 800,
        scrollGutterPercentage: 0.3,
        scrollGutterSlices: 5,
        overrideCursor: true,
	direction:'horizontal',
	includeOffset: false,//If scroll is used inside a iframe the cursor position should subtract from offset top
	includeScroll: null,//If scroll item is placed absolute
	adjustOffsetvalue: 0,//If scroll is used inside a Fixed Postiion Element
      };
      $.extend(this.options, options);
      this.defaultCursor = this.$outerContainer.css('cursor');
      this.$contentContainer = this.$outerContainer.find('.hoverscroll-content');
      if (!this.$contentContainer.length) {
        console.log("accelHoverScroll: Couldn't find required .hoverscroll-content class");
        return;
      }
      position = this.$contentContainer.css('position');
      if (position !== 'relative' && position !== 'absolute') {
        position = 'relative';
      }
      this.$contentContainer.css({
        position: position,
      });

      if(this.options.direction == 'horizontal') {
	  this.dimen['length']  = 'width';
	  this.dimen['start']  = 'left';	
	  this.dimen['end']  = 'right';
	  this.dimen['outer']  = 'outerWidth';
	  this.dimen['cursor']  = 'clientX';	
	  this.dimen['cursor-s'] = 'w-resize';
	  this.dimen['cursor-e'] = 'e-resize';
       } else {
	  this.dimen['length']  = 'height';
	  this.dimen['start']  = 'top';	
	  this.dimen['end']  = 'bottom';	
	  this.dimen['outer']  = 'outerHeight';
	  this.dimen['cursor']  = 'clientY';
	  this.dimen['cursor-s'] = 'n-resize';
	  this.dimen['cursor-e'] = 's-resize';
       }
      this.$contentContainer.css(this.dimen['start'],"0px");
      this.$outerContainer.css({
        overflow: 'hidden'
      });

      this.$contentContainer.orginalHeight =     this.$contentContainer[this.dimen['outer']](true);
      this.$outerContainer.orginalHeight =     this.$outerContainer[this.dimen['length']]();
      if(this.options.adjustOffsetvalue) {
	this.offsetLength = this.options.adjustOffsetvalue;
      } else {
      	this.offsetLength = this.$outerContainer.offset().top;
      }
      this.currentScrollSpeed = 0;
      this.$backArrow = $('.hoverscroll-'+this.dimen['start']);
      this.$frontArrow = $('.hoverscroll-'+this.dimen['end']);
      this.$backArrow.hide();
      this.$outerContainer.hover(this._onMouseEnter, this._onMouseLeave);
      return;
      if ($.event.special.smartresize) {
        $(window).smartresize(this._onResize);
      } else {
        $(window).resize(this._onResize);
      }
    }
   
    AccelHoverScroll.prototype._onResize = function() {
      return console.log("Resizeed!");
    };

    AccelHoverScroll.prototype.pause = function() {
      this._onMouseLeave();
      return this.isPaused = true;
    };

    AccelHoverScroll.prototype.resume = function() {
      return this.isPaused = false;
    };

    AccelHoverScroll.prototype.scrollZero = function() {
      this._reset();
      return this.$contentContainer.css(this.dimen['start'], "0px");
    };

    AccelHoverScroll.prototype._onMouseEnter = function(e) {
      var gutterLength;
      if (this.isPaused) {
        return;
      }
      this.currentScrollSpeed = 0;
      this.contentContainerLength = this.$contentContainer[this.dimen['outer']](true);
      this.outerLength = this.$outerContainer[this.dimen['length']]();
      gutterLength = this.outerLength * this.options.scrollGutterPercentage;
      this.currentSliceSize = Math.ceil(gutterLength / this.options.scrollGutterSlices);
      return this.$outerContainer.mousemove(this._onMouseMove);
    };

    AccelHoverScroll.prototype._onMouseLeave = function(e) {
      if (this.isPaused) {
        return;
      }
      this._reset();
      return this.$contentContainer.unbind('mousemove');
    };

    AccelHoverScroll.prototype._reset = function(jumpToEnd) {
      if (jumpToEnd == null) {
        jumpToEnd = false;
      }
      this.currentScrollSpeed = 0;
      this.$contentContainer.stop(true, jumpToEnd);
      if (this.options.overrideCursor) {
        return this.$outerContainer.css('cursor', this.defaultCursor);
      }
    };

    AccelHoverScroll.prototype._onMouseMove = function(e) {
      var accelPerc, contentContainerStart, distanceToGo, duration, gutterPerc, back, maxScroll, perc, s, sliceIndex, sliceSize, targetScrollSpeed,
        _this = this;
      if (this.isPaused) {
        return;
      }
      gutterPerc = this.options.scrollGutterPercentage;
      var offsetLength = this.offsetLength;
      if(this.options.includeScroll){
	var offset= this.$outerContainer.offset();
	offsetLength = offset[this.dimen['start']] - $(window).scrollTop();

      }
      if(this.options.includeOffset) {
	perc =( e[this.dimen['cursor']] - offsetLength) / this.outerLength;	

      } else {
      	perc = e[this.dimen['cursor']] / this.outerLength;
      }
      targetScrollSpeed = 0;
      if (perc < gutterPerc) {
        back = true;
	console.log('asd');
        accelPerc = 1 - (perc / gutterPerc);
        targetScrollSpeed = accelPerc * this.options.maxScrollSpeed;
      } else if (perc > (1 - gutterPerc)) {
        back = false;
        accelPerc = (perc - 1 + gutterPerc) / gutterPerc;
        targetScrollSpeed = accelPerc * this.options.maxScrollSpeed;
      } else {
        this._reset();
        return;
      }
      sliceSize = 1.0 / this.options.scrollGutterSlices;
      sliceIndex = Math.floor(accelPerc / sliceSize);
      if (sliceIndex === this.oldSliceIndex) {
        return;
      }
      this.oldSliceIndex = sliceIndex;
      targetScrollSpeed = Math.floor(targetScrollSpeed / 10) * 10;
      targetScrollSpeed = Math.max(10, targetScrollSpeed);
      if (back) {
        targetScrollSpeed = -targetScrollSpeed;
      }
      if (targetScrollSpeed === this.currentScrollSpeed) {
        return;
      }
      this.currentScrollSpeed = targetScrollSpeed;
      contentContainerStart = parseInt(this.$contentContainer.css(this.dimen['start']));
      maxScroll = this.contentContainerLength - this.outerLength;
      distanceToGo = back ? Math.abs(contentContainerStart) : maxScroll + contentContainerStart;
      if (distanceToGo < 0) {
        this._reset(true);
        return;
      }
      duration = Math.floor(distanceToGo / targetScrollSpeed * 1000);
      duration = Math.abs(duration);
      if (!duration) {
        return;
      }
      this.$backArrow.fadeIn();
      this.$frontArrow.fadeIn();
      if (this.options.overrideCursor) {
        if (back) {
          this.$outerContainer.css('cursor',  this.dimen['cursor-s']);
        } else {
          this.$outerContainer.css('cursor',  this.dimen['cursor-e']);
        }
      }
      s = back ? "0px" : "-" + (Math.abs(maxScroll)) + "px";
      var opt  = {};
      opt[this.dimen['start']]	= s;
      return this.$contentContainer.stop(true, false).animate(opt, duration, 'linear', function() {
        if (back) {
          _this.$backArrow.fadeOut();
        } else {
          _this.$frontArrow.fadeOut();
        }
        return _this._reset();
      });
    };

    return AccelHoverScroll;

  })();

  $.fn.accelHoverScroll = function(options) {
    var args;
    if (options == null) {
      options = {};
    }
    if (typeof options === 'string') {
      args = Array.prototype.slice.call(arguments, 1);
      this.each(function() {
        var instance;
        instance = $.data(this, 'hoverscroll');
        return instance[options].apply(instance, args);
      });
    } else {
      this.each(function() {
        return $.data(this, 'hoverscroll', new $.AccelHoverScroll(this, options));
      });
    }
    return this;
  };

}).call(this);
