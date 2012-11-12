## Accelerated Hover Scroll

Use this jQuery plugin to create horizontal, hover, accelerated scrolling panels.

### Accelerated?

When you hover your mouse toward the edge of the container, it'll scroll
in that direction. The closer you are to the edge, the faster it
scrolls. This is by no means a new UI interaction, but I couldn't find a
suitable plugin for my needs, so I built this one.

Please let me know if there's a more concise way to describe this
interaction. `jquery.accel-hover-scroll` doesn't exactly roll off the
tongue.

### What kind of containers does it support?

This plugin supports all the typical means of horizontally lining up
content, including floating, inline-block + white-space nowrap, etc.

### CSS3?

The code's built to use `jQuery.fn.animate`, and plays nicely with 
`jquery.animate-enhanced`, though depending on what you're actually
displaying and a million other factors, the timer-based animate 
might actually serve you better, so be sure to A/B test.

## Demo

http://jsfiddle.net/machty/qsbBc/

There's also a questionably-informative
[blog post](http://machty.github.com/blog/2012/11/12/jquery-accelerated-hover-scroll/)
about the plugin that you can read.

## Options

This plugin supports a variety of options to customize scroller.

    // Default settings
    
    // The scroll speed right at the edge of the
    // container, pixels per second
    maxScrollSpeed: 800,
    
    // Percentage of the container's width that'll
    // be hover-scrollable. Choose a small value if
    // you'd like a wider center region where no
    // scrolling occurs.
    scrollGutterPercentage: 0.3,
    
    // You probably won't need to change this, but
    // internally, the scroll speed is determined
    // according to which 'slice' of the gutter the
    // cursor falls in. In other words, there isn't
    // a perfect smooth gradient from slow to fast, but
    // rather small slices that you probably won't notice
    // or need to change. It's sliced this way for efficiency
    // purposes; this plugin utilizes jQuery.fn.animate for
    // its scrolling, and constantly changing the speed of the
    // scroll based on single pixel changes in the mouse location
    // can lead to some choppiness, particularly if there
    // are images involved, or if you're using the 
    // CSS3 transition-enabled jQuery.animation-enhanced
    // plugin
    scrollGutterSlices: 5,
    
    // Control whether cursor changes to left/right
    // arrows when hover-scrolling.
    overrideCursor: true

## Methods

The hover-scroll functionality can be temporarily disabled via the
`pause` and `resume` methods, e.g.:

    $('.hoverscroll').accelHoverScroll({ /* init options */ });
    $('.hoverscroll').accelHoverScroll("pause");
    $('.hoverscroll').accelHoverScroll("resume");

## TODO

- Tests
- Vertical Support
- Destructor
- Documentation

### Credits / Contribution

Built by Alex Matchneer on behalf of the [Useful Robot](http://www.usefulrobot.io)

Feel free to contribute to this plugin via the normal pull request
fanfare.
