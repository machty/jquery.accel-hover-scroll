###
# AccelHoverScroll v0.1
# Accelerated Hoverscroll: mouse over the left or right sides
# of a container and the containerw will scroll in that direction,
# the closer to the edge of the container the faster it goes.
#
# Do as thou wilt with this code but send any surplus love
# over to usefulrobot.io
#
# Copyright 2012 Alex Matchneer / Useful Robot
###

$ = jQuery

class $.AccelHoverScroll
  constructor: (element, options = {}) ->
    @$outerContainer = $(element)

    @options =
      maxScrollSpeed: 800
      scrollGutterPercentage: 0.3
      scrollGutterSlices: 5
      overrideCursor: true
    $.extend @options, options

    # Store the default cursor style type for the outer container.
    @defaultCursor = @$outerContainer.css('cursor')

    @$contentContainer = @$outerContainer.find('.hoverscroll-content')

    unless @$contentContainer.length
      console.log "accelHoverScroll: Couldn't find required .hoverscroll-content class"
      return

    # Set up positioning on content container (needs to be relative or absolute)
    position = @$contentContainer.css('position')
    if position isnt 'relative' and position isnt 'absolute'
      position = 'relative'
    @$contentContainer.css
      position: position
      left: "0px"

    # Set up the outer container to get rid of any scroll bars.
    @$outerContainer.css overflow: 'hidden'

    @currentScrollSpeed = 0

    @$leftArrow = $('.arrow-left')
    @$rightArrow = $('.arrow-right')

    # We start off scrolled all the way to the left, so left arrow should be invisible.
    @$leftArrow.hide()


    @$outerContainer.hover(@_onMouseEnter, @_onMouseLeave)

    return
    # TODO: handle resize
    if $.event.special.smartresize
      $(window).smartresize @_onResize
    else
      $(window).resize @_onResize

  _onResize: =>
    console.log "Resizeed!"

  pause: ->
    @_onMouseLeave()
    @isPaused = true

  resume: ->
    @isPaused = false

  _onMouseEnter: (e) =>
    return if @isPaused

    # Capture current widths:
    # TODO: integrate this with resize event?
    @currentScrollSpeed = 0
    @contentContainerWidth = @$contentContainer.outerWidth(true)
    @outerWidth = @$outerContainer.outerWidth(true)

    # Set current slice size
    gutterWidth = @outerWidth * @options.scrollGutterPercentage
    @currentSliceSize = Math.ceil(gutterWidth / @options.scrollGutterSlices)

    @$outerContainer.mousemove @_onMouseMove

  _onMouseLeave: (e) =>
    return if @isPaused
    @_reset()
    @$contentContainer.unbind('mousemove')

  _reset: (jumpToEnd = false) =>
    @currentScrollSpeed = 0
    @$contentContainer.stop(true, jumpToEnd)
    if @options.overrideCursor
      @$outerContainer.css 'cursor', @defaultCursor

  _onMouseMove: (e) =>
    return if @isPaused

    # Mouse has moved, so we need to figure out the ideal
    # speed of the scroll, kick off the animation if it hasn't been
    # started yet, or stop and restart it if there's enough of speed change requested.

    gutterPerc = @options.scrollGutterPercentage

    perc = e.clientX / @outerWidth
    targetScrollSpeed = 0

    if perc < gutterPerc
      left = true
      accelPerc = ( 1 - (perc / gutterPerc))
      targetScrollSpeed = accelPerc * @options.maxScrollSpeed
    else if perc > (1 - gutterPerc)
      left = false
      accelPerc = ((perc - 1 + gutterPerc) / gutterPerc)
      targetScrollSpeed = accelPerc * @options.maxScrollSpeed
    else
      @_reset()
      return

    # Figure out the current slice index
    sliceSize = 1.0 / @options.scrollGutterSlices
    sliceIndex = Math.floor(accelPerc / sliceSize)

    return if sliceIndex == @oldSliceIndex
    @oldSliceIndex = sliceIndex

    # Round off scroll speed
    targetScrollSpeed = Math.floor(targetScrollSpeed / 10) * 10
    targetScrollSpeed = Math.max(10, targetScrollSpeed)
    targetScrollSpeed = -targetScrollSpeed if left

    # Don't reset animation if scroll speed is the same.
    if targetScrollSpeed == @currentScrollSpeed
      return
    @currentScrollSpeed = targetScrollSpeed

    # Figure out the distance to the edge.
    contentContainerLeft = parseInt @$contentContainer.css('left')

    maxScroll = @contentContainerWidth - @outerWidth
    distanceToGo = if left
      # Going left. Figure out distance from here to left: 0
      Math.abs contentContainerLeft
    else
      maxScroll + contentContainerLeft

    if distanceToGo < 0
      @_reset(true)
      return

    # Figure out how long it'll take to get there.
    duration = Math.floor(distanceToGo / targetScrollSpeed * 1000)
    duration = Math.abs(duration)
    return unless duration

    @$leftArrow.fadeIn()
    @$rightArrow.fadeIn()

    # Set cursor overrides
    if @options.overrideCursor
      if left
        @$outerContainer.css 'cursor', 'w-resize'
      else
        @$outerContainer.css 'cursor', 'e-resize'


    s = if left then "0px" else "-#{Math.abs(maxScroll)}px"
    @$contentContainer.stop(true, false).animate { left: s }, duration, 'linear', =>
      # Hide one of the arrows.
      if left
        @$leftArrow.fadeOut()
      else
        @$rightArrow.fadeOut()

      @_reset()

$.fn.accelHoverScroll = (options = {}) ->
  if typeof options is 'string'
    args = Array.prototype.slice.call(arguments, 1)
    @each ->
      instance = $.data(@, 'hoverscroll')
      instance[options].apply(instance, args)
  else
    @each ->
      $.data(@, 'hoverscroll', new $.AccelHoverScroll(@, options))
  @
