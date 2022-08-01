// ---------------------------------------------------------------------
// Global JavaScript
// Authors: Andrew Ross & a little help from my friends
// ---------------------------------------------------------------------

var andrewrossco = andrewrossco || {};

(function($, APP) {

    $(function() {
        APP.App.init();
		APP.Header.init();
        APP.ScrollTo.init();
        APP.Viewport.init();
        APP.Sections.init();
        APP.Lines.init();
        APP.Modal.init();
        APP.Tabs.init();
    });

// ---------------------------------------------------------------------
// Browser and Feature Detection
// ---------------------------------------------------------------------

APP.App = {
    userAgent: undefined,
    $html: undefined,

    init: function() {
        APP.Features = APP.Features || {};
        this.userAgent = navigator.userAgent.toLowerCase();
        this.$html = $('html');
        this.noTouch();
        this.isTouch();
        this.isNewIE();
        this.isIE();

		$(document).ready(function() {
            $('body').addClass('page-loaded');

            var colors = [
                '#F5BF24',
                '#FF6C81',
                '#67D3BE',
                '#67BBEF',
                '#8A65AA'
            ];

            $(".button").hover(function(){
                var color = colors[Math.floor(Math.random()*colors.length)];
                $(this).css("background-color", color);
            });
            $(".button").mouseout(function(){
                if( $(this).hasClass('button--alt') ){
                    $(this).css("background-color", '#F5BF24');
                } else {
                    $(this).css("background-color", '#EE4141');
                }

            });
        });
    },

    noTouch: function() {
        if ( ! ('ontouchstart' in window) ) {
            APP.Features.noTouch = false;
            this.$html.addClass('noTouch');
            return;
        }
        APP.Features.noTouch = false;
    },

    isTouch: function() {
        if ( 'ontouchstart' in window ) {
            APP.Features.isTouch = false;
            this.$html.addClass('isTouch');
            return;
        }
        APP.Features.isTouch = false;
    },

    isNewIE: function() {
		if (document.documentMode || /Edge/.test(navigator.userAgent)) {
            if(navigator.appVersion.indexOf('Trident') === -1) {
                this.$html.addClass('isEDGE');
            } else {
                this.$html.addClass('isIE isIE11');
            }
            return;
        }
        APP.Features.isNewIE = false;
    },

    isIE: function() {
        if( navigator.appVersion.indexOf("MSIE") !== -1 ) {
            this.$html.addClass('isIE');
            APP.Features.isIE = true;
            return;
        }
        APP.Features.isIE = false;
    }

};


// ---------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------

APP.Header = {

    init: function() {
		var trigger = $('.burger'),
			bd = $('body');

		trigger.click(function(){
			if(bd.hasClass('menu-is-open')){
				bd.removeClass('menu-is-open');
			} else {
				bd.addClass('menu-is-open');
			}
		});

		function animateLogo() {
			TweenLite.to('#git', 0.6, { height:"20px", autoRound: false });
			TweenLite.to('#merge', 0.6, { height:"20px", y: 0, x: 62, autoRound: false });
			TweenLite.to('#year', 0.6, { height:"20px", y: 0, x: 185, autoRound: false });
		}

		function animateLogoBack() {
			TweenLite.to('#git', 0.6, { height:"25px", autoRound: false });
			TweenLite.to('#merge', 0.6, { height:"25px", x: 0, y: 35,  autoRound: false });
			TweenLite.to('#year', 0.6, { height:"25px", x: 28, y: 71,  autoRound: false });
		}

		animateLogoBack();

		var el = $('.site-header'),
			navPos = el.offset().top,
			w = $(window),
			d = $(document);

        function headerPos() {
            if (w.scrollTop() > 10) {
				if( !el.hasClass('is-sticky') ){
					el.addClass('is-sticky');

					animateLogo();
				}
			} else {
				if( el.hasClass('is-sticky') ){
					el.removeClass('is-sticky');
					animateLogoBack();
				}
			}
        }

        d.ready(function() {
			headerPos();
		});

		d.scroll(function() {
			headerPos();
		});

    }
};


// ---------------------------------------------------------------------
// Button BG
// ---------------------------------------------------------------------

APP.Sections = {

    init: function() {

        var section = $('.js-page-section'),
            w = $(window);
        var offsetCount = 54;
        section.each(function(){

            var el = $(this),
				topPos = el.offset().top - offsetCount,
                bottomPos = el.offset().top + el.innerHeight(),
                elId = '/#' + el.attr('ID'),
                navLinks = $('.main-nav a');

			w.resize(function() {
				topPos = el.offset().top - offsetCount,
                bottomPos = el.offset().top + el.innerHeight();
			});

            function checkSection() {
                if ( w.scrollTop() >= topPos && w.scrollTop() < (bottomPos - offsetCount) ){
                    if( !el.hasClass('active-section') ){
                        el.addClass('active-section');
                        navLinks.each(function(){
                            if( $(this).attr('href') == elId ) {
                                navLinks.removeClass('selected');
                                $(this).addClass('selected');
                            }
                        });

                    }
                } else {
                    if( el.hasClass('active-section') ){
                        el.removeClass('active-section');
                    }
                }
            }

            w.scroll(function() {
                checkSection();
            });

			w.resize(function() {
                checkSection();
            });

            $(document).ready(function() {
                checkSection();
            });

        });
    }
};



// ---------------------------------------------------------------------
// Detect when an element is in the viewport
// ---------------------------------------------------------------------

APP.Viewport = {

    init: function() {
		$.fn.isOnScreen = function(){
			var elementTop = $(this).offset().top,
				elementBottom = elementTop + $(this).outerHeight(),
				viewportTop = $(window).scrollTop(),
				viewportBottom = viewportTop + $(window).height();
			return elementBottom > viewportTop && elementTop < viewportBottom;
		};

		var items = document.querySelectorAll('*[data-animate-in], *[data-detect-viewport]');

		function detection(el) {
			if( el.isOnScreen() ){
				if(!el.hasClass('in-view')){
					el.addClass('in-view');
				}
			} else {
				if(el.hasClass('in-view')){
					el.removeClass('in-view');
				}
			}
		}

		$(window).on("resize scroll", function(){
			for(var i = 0; i < items.length; i++) {
				var el = $( items[i] );
				detection(el);
			}
		});

		$(document).ready(function(){
			for(var i = 0; i < items.length; i++) {
				var d = 0,
					el = $( items[i] );
				if( items[i].getAttribute('data-animate-in-delay') ) {
					d = items[i].getAttribute('data-animate-in-delay') / 1000 + 's';
				} else {
					d = 0;
				}
				el.css('transition-delay', d);

				 detection(el);
			}
		});
    }
};



// ---------------------------------------------------------------------
// Line Animation
// ---------------------------------------------------------------------

APP.Lines = {

    init: function() {
        var browser = navigator.userAgent.toLowerCase();
        var line = $('line, path, circle, polyline, polygon, rect, ellipse');

        if (browser.indexOf('firefox') > -1) {
            var line = $('path, circle, polyline, polygon, rect, ellipse');
        }

		TweenLite.to(line, 0, {drawSVG:"0%"});

		line.each(function(){
			var el = $(this),
				par = el.parents('.shape-grid'),
				active = false,
                element = el.prop('tagName'),
                delay = 0.4;

            if( !el[0].hasAttribute('stroke-width') ) {
                TweenLite.to(el, 0, {alpha:0});
            }

			function checksvg() {
				if(par.hasClass('in-view')){
					if(active == false){
                        if(element == 'circle'){
                            delay = 1.6;
                        }
                        TweenLite.to(el, 1.6, {drawSVG:"100%", alpha:1}).delay(delay);
						active = true;
					}
				} else {
					if(active == true){
						TweenLite.to(el, 1, {drawSVG:"0%"});
						active = false;

                        if( !el[0].hasAttribute('stroke-width') ) {
                            TweenLite.to(el, 0, {alpha:0});
                        }
					}
				}
			}

			$(window).on("resize scroll", function(){
				checksvg();
			});
			$(document).ready(function(){
				checksvg();
			});

		});
    }
};


// ---------------------------------------------------------------------
// Scroll to
// ---------------------------------------------------------------------

APP.ScrollTo = {

    init: function() {

        $('*[data-scroll-to]').on('click touchstart:not(touchmove)', function() {

            var trigger = $(this).attr('data-scroll-to'),
                target = $("#" + trigger),
                ss = 1000, //scroll speed
                o = 0; // offset

            $('body').removeClass('menu-is-open');


            if( $(this).attr('data-scroll-speed') ) {
                ss = $(this).attr('data-scroll-speed');
            }

            if( $(this).attr('data-scroll-offset') ) {
                o = $(this).attr('data-scroll-offset');
            }

            if( $(this).hasClass('switch-to-workshop') ) {
                $('.js-tab-day-1').click();
                console.log('here');
            }


            $('html, body').animate({
                scrollTop: target.offset().top - o
            }, ss);
        });

    }
};


// ---------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------

APP.Modal = {

    init: function() {

        var trigger = $('.open-modal'),
            modal = $('#speaker-modal'),
            modalSidebar = $('.modal__sidebar'),
            modalBody = $('.modal__body > *'),
            modalImg = $('.modal__img'),
            b = $('body'),
            shapes = $('#speaker-modal .js-shuffle-children');

        function shuffleChildren(el){
          var p = el,
              kids = el.children();

          kids.sort(function() {
            return 0.5 - Math.random();
          });

          el.empty();
          kids.appendTo(el);
        }

        function getSpeakerModal(el){
            var speaker = el,
                color = speaker.find('.speaker__info-border').css('background-color'),
                img = speaker.find('.speaker__image-wrap').clone(),
                info = speaker.find('.speaker__info').clone(),
                modalInfo = speaker.find('.speaker__modal-content').clone();

            modalImg.append(img).delay( 800 ).removeClass('multiple-speakers').addClass('in-view');
            modalSidebar.css('background', color);

            modalBody.append(info);
            modalBody.append(modalInfo);

            modal.addClass('is-active');
            b.addClass('modal-is-open');

            shuffleChildren(shapes);

            setTimeout(function(){
                $(window).trigger('resize');
            }, 600);
        }


        function getTalkModal(el){
            var talk = el,
                color,
                img = talk.find('.speaker__image-wrap').clone(),
                info = talk.find('.talk__info').clone();

                var speakerName = talk.find('.talk-speaker-name').text();
                $('.speaker .speaker__name').each(function(){
                    if( $(this).text() == speakerName) {
                        color = $(this).parents('.speaker').find('.speaker__info-border').css('background-color');
                        modalSidebar.css('background', color);
                    }
                });

            modalImg.removeClass('multiple-speakers').removeClass('multiple-speakers--stack');

            if( talk.find('.speaker__image-wrap').length > 1 ) {
                modalImg.addClass('multiple-speakers');
                if( talk.find('.speaker__image-wrap').length > 2 ) {
                    modalImg.addClass('multiple-speakers--stack');
                }
            } else {
                modalImg.removeClass('multiple-speakers').removeClass('multiple-speakers--stack');
            }

            modalBody.append(info);
            modalImg.append(img).delay( 800 ).addClass('in-view');

            modal.addClass('is-active');
            b.addClass('modal-is-open');

            shuffleChildren(shapes);

            setTimeout(function(){
                $(window).trigger('resize');
            }, 600);
        }


        trigger.click(function(event){
            event.preventDefault();
            event.stopPropagation();

            var el = $(this);
            var modalId = el.attr('href'),
                obj = $(modalId);

            if( el.hasClass('talk-modal') ) {
                getTalkModal(obj);
            } else {
                getSpeakerModal(obj);
            }

            history.replaceState(null, '', modalId);

        });


        // Check for open modal on load
        $(document).ready(function(){
            var aLink = $('.talk-modal');
            aLink.each(function(){
                var el = $(this),
                    speakerName = el.find('.talk-speaker-name:first').text(),
                    color;
                $('.speaker .speaker__name').each(function(){
                    if( $(this).text() == speakerName) {
                        color = $(this).parents('.speaker').find('.speaker__info-border').css('background-color');
                        modalSidebar.css('background', color);
                    }
                });

                el.css('color', color);

                el.mouseover(function() {
                    el.removeClass('text-white');
                });
                el.mouseout(function() {
                    el.addClass('text-white');
                });
            });

            var hash = window.location.hash.replace('#', '');

            $('.speaker, .time-slot__talk').each(function(){
                if($(this).attr('id') == hash) {
                    console.log('match');
                    $(this).find('a.open-modal').click();
                    return false;
                } else {
                    console.log('no match');
                }
            });
        });


        // Close Modal
        $('.modal__close').click(function(event){
            event.preventDefault();
            event.stopPropagation();
            modal.removeClass('is-active');
            modalImg.empty();
            modalBody.empty();
            b.removeClass('modal-is-open');
            history.replaceState(null, '', ' ');
            shapes.removeClass('in-view');

            setTimeout(function(){
                $(window).trigger('resize');
            }, 600);
        });
    }
};


// ---------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------

APP.Tabs = {

    init: function() {

        var tab = $('.tabs__tab'),
			tabBody = $('.tabs__content');

        $('.js-schedule-day-1').click(function(){
            $('.js-tab-day-1').trigger('click');
        });
        $('.js-schedule-day-2').click(function(){
            $('.js-tab-day-2').trigger('click');
        });

        $(document).ready(function(){
            var hash = window.location.hash.replace('#', '');
            if(hash === 'schedule-day-1') {
                $('.js-tab-day-1').trigger('click');

                $(document).scrollTop( $("#schedule-nav").offset().top - 78 );
            }
            if(hash === 'schedule-day-2') {
                $(document).scrollTop( $("#schedule-nav").offset().top - 78 );
            }
        });


		tab.click(function(event){
			event.preventDefault();
			var group = $(this).parents('.tabs'),
				tabs = group.find('.tabs__tab'),
				tabsBody = group.find('.tabs__content');

			tabs.removeClass('selected');
			tabsBody.hide();

			$(this).addClass('selected');

			var tabId = $(this).attr('href'),
				target = $(tabId),
				graphs = target.find('*[data-detect-viewport]');

			target.fadeIn(300);
            $(window).trigger('resize');

		});

    }
};



}(jQuery, andrewrossco));
