/*
	Name: Pixelwars Blog Framework
	Description: Shape-Shifter WordPress Theme Framework
	Version: 2.0
	Author: pixelwars
*/

(function ($) {
	"use strict";

	/* global variables */
	var $masonry_container;
	var isSafari = (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1 && navigator.userAgent.indexOf('Android') === -1);
	var isIE = document.documentMode;
	var isEdge = /Edge/.test(navigator.userAgent);


	// DOCUMENT READY
	$(function () {

		// DETECT JUNK BROWSERS #$½#£#
		if (isIE || isEdge) {
			$('html').addClass('is-MS');
		}
		if (isIE) {
			$('html').addClass('is-IE');
		}
		if (isEdge) {
			$('html').addClass('is-Edge');
		}

		// BUTTONS : add classes to default buttons
		$("form input[type=submit], form input[type=button], form button:not(.tutor-btn):not(.tutor-button)").addClass(("button is-primary " + $('html').data('generic-button-style')));
		
		// html addclass : is-ready
		$('html').addClass('is-ready');


		// FIX SIDEBAR INSTAGRAM
		$('.sidebar .instagram-pics, .featured-area .instagram-pics').wrap('<div class="instagram-pics-wrap"></div>');
		$('.sidebar .null-instagram-feed > p').appendTo($('.sidebar .instagram-pics-wrap'));
		$('.featured-area .instagram-pics-wrap + p').appendTo($('.featured-area .instagram-pics-wrap'));

		// FORMS
		$('input:not([type=submit]):not([type=button]):not([type=file]):not([type=radio]):not([type=checkbox])').addClass('input-text');



		// ------------------------------
		// STICKY MENU

		
		if (!$('html').hasClass('is-menu-sticky')) {
			$('.site-header').addClass('original');
		}


		// HEADER SMALL AND LOGO CENTER
		if ($('html').hasClass('is-header-logo-center')) {
			var total = parseInt($('.site-header .nav-menu > ul > li').length / 2);
			$("<li></li>").addClass('menu-logo').insertAfter('.site-header .nav-menu > ul > li:nth-child(' + total + ')');
			$('.site-header .site-branding').clone().appendTo($('.site-header .menu-logo'));
			$('.site-header').addClass('ready');
		}


		// STICKY
		if ($('html').hasClass('is-menu-sticky')) {

			// the element to be sticky
			var theElement = $('html').hasClass('is-menu-bar') ? $('.site-navigation') : $('.site-header');
			var theElement = $('html').hasClass('is-logo-stick-with-menu') ? $('.site-header') : theElement;

			// variables
			var smart,
				$orgElement,
				$clonedElement,
				orgElementTop,
				currentScroll,
				previousScroll = 0,
				scrollDifference,
				detachPoint = 650, // point of detach (after scroll passed it, menu is fixed)
				hideShowOffset = 6, // scrolling value after which triggers hide/show menu
				$html = $('html');


			// Create a clone of the menu, right next to original.
			theElement.addClass('original').clone().insertAfter(theElement).addClass('clone').removeClass('original');

			$orgElement = $('.original');
			$clonedElement = $('.clone');

			smart = $('html').hasClass('is-menu-smart-sticky');

			if (smart) {
				$html.addClass('menu-invisible');
			}
			$(window).on("scroll", function () {

				// don't run if mobile menu is toggled on
				if($html.hasClass('is-menu-toggled-on')) return;

				currentScroll = $(this).scrollTop(), // gets current scroll position
					scrollDifference = Math.abs(currentScroll - previousScroll); // calculates how fast user is scrolling

				orgElementTop = $orgElement.offset().top;

				// Scrolled past the original position; now only show the cloned, sticky element.
				if (currentScroll >= (orgElementTop) && currentScroll != 0) {


					// if : SMART STICKY 
					if (smart) {

						// if scrolled past detach point add class to fix menu
						if (currentScroll > detachPoint) {
							if (!$html.hasClass('menu-detached')) {
								$html.addClass('menu-detached');
							}

							// if scrolling faster than hideShowOffset hide/show menu
							if (scrollDifference >= hideShowOffset) {
								// scrolling down; hide menu  
								if (currentScroll > previousScroll) {
									if (!$html.hasClass('menu-invisible')) {
										$html.addClass('menu-invisible');
									}
								}
								// scrolling up; show menu
								else {
									if ($html.hasClass('menu-invisible')) {
										$html.removeClass('menu-invisible');
									}
								}
							}

						} else {
							if (!$html.hasClass('menu-invisible') && $('html').hasClass('is-header-float')) {
								$html.addClass('menu-invisible');
							}
						}
					} // if : smart


					// else : NORMAL STICKY
					else {
						$clonedElement.addClass('is-visible');
						$orgElement.addClass('is-hidden');
						$html.addClass('is-sticky-menu-visible');
					}

				}
				// Scrolled past the original position; now only show the cloned, sticky element.


				// NOT scrolled past the menu; only show the original menu.
				else {

					if (smart) {

						$html.addClass('menu-invisible').removeClass('menu-detached');
						if ($('html').hasClass('is-header-float')) {

						} else {

						}

					} else { // NORMAL STICKY
						$clonedElement.removeClass('is-visible');
						$orgElement.removeClass('is-hidden');
						$html.removeClass('is-sticky-menu-visible');
					}
				}
				// NOT scrolled past the menu; only show the original menu.


				// replace previous scroll position with new one
				previousScroll = currentScroll;


			}); // window on scroll

		} // STICKY MENU 
		// ------------------------------	

		// ------------------------------
		// STICKY: Header Smaller after scrolled down
		window.addEventListener('scroll', function () {
			var distanceY = window.pageYOffset || document.documentElement.scrollTop,
				shrinkOn = 300,
				$html = $('html');
			if (distanceY > shrinkOn) {
				$html.addClass("is-header-smaller");
			} else {
				if ($html.hasClass("is-header-smaller")) {
					$html.removeClass("is-header-smaller");
				}
			}
		});
		// ------------------------------


		// ------------------------------
		// MOBILE MENU
		var $menu = $('.nav-menu');

		// wrap link text with spans (extra span markup is needed for menu link hover styles)
		$menu.find('li:not(.menu-logo) a').wrapInner("<span class='link-text'></span>");

		// add classes
		$menu.find('li').each(function () {
			if ($(this).children('ul').length) {
				$(this).addClass('has-submenu');
				$(this).find('> a, > a .link-text').append('<span class="submenu-toggle"></span>');
			}
		});

		var $submenuTrigger = $('.has-submenu .submenu-toggle');
		// submenu link click event
		$submenuTrigger.on("click", function () {
			$(this).parent().parent().toggleClass('active');
			$(this).parent().siblings('ul').toggleClass('active');
			return false;
		});
		// ------------------------------




		// ------------------------------	
		// SEARCH TOGGLE
		$('.search-toggle').on("click", function (e) {
			e.stopPropagation();
			var search_input = $(this).parent().find('.search-container input[type="search"]');
			$('html').toggleClass('is-search-toggled-on');
			if ($('html').hasClass('is-search-toggled-on')) {
				setTimeout(function () { search_input.trigger('focus'); }, 400);
			}
		});
		// ------------------------------



		// ------------------------------	
		// HEADER MENU TOGGLE
		$('.menu-toggle').on("click", function (e) {
			e.stopPropagation();
			$('html').toggleClass('is-menu-toggled-on');
			$(this).parents('.site-navigation').toggleClass('is-active');
			$(this).parents('.site-header').toggleClass('is-active');
		});

		// one page nav support with hash: close the mobile menu when clicked on an hash link
		$('.nav-menu a[href*="#"]').on( "click", function() {
			if (window.matchMedia("(max-width: 992px)").matches) { //needs to work only on mobile menu
				$(this).parents('.site-navigation').find('.menu-toggle').trigger("click" );
			}
		});
		// ------------------------------



		/* Slider more-link clone */
		$('.post-thumbnail .entry-header .more-link').each(function () {
			$(this).clone().appendTo($(this).parents('.post-wrap')).addClass('outside');
		});


		var sliderAnimations = {

			'backSlide': {
				'in': 'backSlideInRight',
				'out': 'backSlideOutLeft',
				'backIn': 'backSlideInLeft',
				'backOut': 'backSlideOutRight'
			},
			'scale': {
				'in': 'scaleIn',
				'out': 'scaleOut'
			},
			'stackScale': {
				'in': 'scaleIn',
				'out': 'zoomOut',
				'backIn': 'zoomIn',
				'backOut': 'scaleOut'
			},
			'stackZoom': {
				'in': 'zoomIn',
				'out': 'scaleOut',
				'backIn': 'scaleIn',
				'backOut': 'zoomOut'
			},
			'fade': {
				'in': 'fadeIn',
				'out': 'fadeOut'
			},
			'fadeHorizontal': {
				'in': 'fadeInRight',
				'out': 'fadeOutLeft',
				'backIn': 'fadeInLeft',
				'backOut': 'fadeOutRight'
			},
			'fadeHorizontalBig': {
				'in': 'fadeInRightBig',
				'out': 'fadeOutLeftBig',
				'backIn': 'fadeInLeftBig',
				'backOut': 'fadeOutRightBig'
			},
			'fadeVertical': {
				'in': 'fadeInUp',
				'out': 'fadeOutUp',
				'backIn': 'fadeInDown',
				'backOut': 'fadeOutDown'
			},
			'fadeVerticalBig': {
				'in': 'fadeInUpBig',
				'out': 'fadeOutUpBig',
				'backIn': 'fadeInDownBig',
				'backOut': 'fadeOutDownBig'
			},
			'jello': {
				'in': 'jello',
				'out': 'zoomOut'
			},
			'jelloVertical': {
				'in': 'jello',
				'out': 'fadeOutDown',
				'backIn': 'jello',
				'backOut': 'fadeOutUp'
			},
			'jelloVerticalBig': {
				'in': 'jello',
				'out': 'fadeOutDownBig',
				'backIn': 'jello',
				'backOut': 'fadeOutUpBig'
			},
			'jelloHorizontal': {
				'in': 'jello',
				'out': 'fadeOutLeft',
				'backIn': 'jello',
				'backOut': 'fadeOutRight'
			},
			'jelloHorizontalBig': {
				'in': 'jello',
				'out': 'fadeOutLeftBig',
				'backIn': 'jello',
				'backOut': 'fadeOutRightBig'
			},
			'swing': {
				'in': 'swing',
				'out': 'zoomOut'
			},
			'swingVertical': {
				'in': 'swing',
				'out': 'fadeOutDown',
				'backIn': 'swing',
				'backOut': 'fadeOutUp'
			},
			'swingVerticalBig': {
				'in': 'swing',
				'out': 'fadeOutDownBig',
				'backIn': 'swing',
				'backOut': 'fadeOutUpBig'
			},
			'swingHorizontal': {
				'in': 'swing',
				'out': 'fadeOutLeft',
				'backIn': 'swing',
				'backOut': 'fadeOutRight'
			},
			'swingHorizontalBig': {
				'in': 'swing',
				'out': 'fadeOutLeftBig',
				'backIn': 'swing',
				'backOut': 'fadeOutRightBig'
			},
			'rubberBand': {
				'in': 'rubberBand',
				'out': 'zoomOut'
			},
			'rubberBandVertical': {
				'in': 'rubberBand',
				'out': 'fadeOutUp',
				'backIn': 'rubberBand',
				'backOut': 'fadeOutDown'
			},
			'rubberBandVerticalBig': {
				'in': 'rubberBand',
				'out': 'fadeOutDownBig',
				'backIn': 'rubberBand',
				'backOut': 'fadeOutUpBig'
			},
			'rubberBandHorizontal': {
				'in': 'rubberBand',
				'out': 'fadeOutLeft',
				'backIn': 'rubberBand',
				'backOut': 'fadeOutRight'
			},
			'rubberBandHorizontalBig': {
				'in': 'rubberBand',
				'out': 'fadeOutLeftBig',
				'backIn': 'rubberBand',
				'backOut': 'fadeOutRightBig'
			},
			'zoom': {
				'in': 'zoomIn',
				'out': 'zoomOut'
			},
			'zoomHorizontal': {
				'in': 'zoomIn',
				'out': 'fadeOutLeft',
				'backIn': 'fadeInLeft',
				'backOut': 'zoomOut'
			},
			'zoomHorizontalBig': {
				'in': 'zoomIn',
				'out': 'fadeOutLeftBig',
				'backIn': 'fadeInLeftBig',
				'backOut': 'zoomOut'
			},
			'zoomVertical': {
				'in': 'zoomIn',
				'out': 'fadeOutUp',
				'backIn': 'fadeInDown',
				'backOut': 'zoomOut'
			},
			'zoomVerticalBig': {
				'in': 'zoomIn',
				'out': 'fadeOutUpBig',
				'backIn': 'fadeInDownBig',
				'backOut': 'zoomOut'
			},
			'zoomInDown': {
				'in': 'zoomInDown',
				'out': 'zoomOut'
			},
			'fadeUpZoomOut': {
				'in': 'fadeInUp',
				'out': 'zoomOut',
				'backIn': 'zoomIn',
				'backOut': 'fadeOutDown'
			},
			'fadeLeftZoomOut': {
				'in': 'fadeInLeft',
				'out': 'zoomOut',
				'backIn': 'zoomIn',
				'backOut': 'fadeOutLeft'
			},
			'flipVertical': {
				'in': 'flipInX',
				'out': 'zoomOut'
			},
			'flipHorizontal': {
				'in': 'flipInY',
				'out': 'zoomOut'
			},
			'lightSpeed': {
				'in': 'lightSpeedInLeft',
				'out': 'lightSpeedOutLeft',
				'backIn': 'lightSpeedInRight',
				'backOut': 'lightSpeedOutRight'
			},
			'jackInTheBox': {
				'in': 'jackInTheBox',
				'out': 'zoomOut'
			},
			'hinge': {
				'out': 'hinge'
			},
			'rotate': {
				'in': 'rotateIn',
				'out': 'zoomOut',
				'backIn': 'zoomIn',
				'backOut': 'rotateOut'
			},
			'rotateUpSwitch': {
				'in': 'rotateInUpRight',
				'out': 'rotateOutDownRight'
			},
			'rotateDownSwitch': {
				'in': 'rotateInDownRight',
				'out': 'rotateOutUpRight'
			},
			'rotateHorizontal': {
				'in': 'rotateInDownLeft',
				'out': 'rotateOutUpRight',
				'backIn': 'rotateInDownRight',
				'backOut': 'rotateOutUpLeft'
			},
			'rotateVertical': {
				'in': 'rotateInUpRight',
				'out': 'rotateOutUpRight',
				'backIn': 'rotateInDownRight',
				'backOut': 'rotateOutDownRight'
			},
			'jumpIn': {
				'in': 'jumpIn',
				'out': 'zoomOut'
			},
			'blur': {
				'in': 'blurIn',
				'out': 'blurOut'
			},
			'blurZoom': {
				'in': 'blurZoomIn',
				'out': 'blurZoomOut'
			},
			'blurScale': {
				'in': 'blurScaleIn',
				'out': 'blurScaleOut'
			},
			'blurStackScale': {
				'in': 'blurScaleIn',
				'out': 'blurZoomOut',
				'backIn': 'blurZoomIn',
				'backOut': 'blurScaleOut'
			},
			'blurStackZoom': {
				'in': 'blurZoomIn',
				'out': 'blurScaleOut',
				'backIn': 'blurScaleIn',
				'backOut': 'blurZoomOut'
			},
			'invert': {
				'in': 'invert'
			}
		};


		// ------------------------------
		// OWL-CAROUSEL
		var owl = $('.owl-carousel');
		$('.slider-box .post-thumbnail .entry-header').removeClass('ready');
		if (owl.length) {
			owl.each(function (index, element) {

				var items = $(element).data('items');
				var animate = $(element).data('animation');
				//var animate = 'jello';
				var animateIn, animateOut, backAnimateIn, backAnimateOut;
				var mouseDrag = $(element).data('mouse-drag');

				// check if the animations is defined
				if (sliderAnimations[animate] !== undefined && items <= 1) {

					// mouse drag is always of when custom animation is on
					mouseDrag = false;
					$(element).addClass('custom-animation');

					animateIn = isIE ? 'fadeIn' : sliderAnimations[animate].in;
					animateOut = isIE ? 'fadeOut' : sliderAnimations[animate].out;
					backAnimateIn = isIE ? 'fadeIn' : sliderAnimations[animate].backIn;
					backAnimateOut = isIE ? 'fadeOut' : sliderAnimations[animate].backOut;
				}

				//wait for images
				$(element).imagesLoaded(function () {

					//remove loading
					$(element).find('.loading').remove();

					$(element).owlCarousel({
						mouseDrag: mouseDrag,
						dots: $(element).data('dots'),
						nav: $(element).data('nav'),
						autoplay: $(element).data('autoplay'),
						autoplayTimeout: $(element).data('autoplay-timeout'),
						autoplayHoverPause: true,
						navText: false,
						rewind: $(element).data('rewind'),
						center: $(element).data('center'),
						loop: $(element).data('loop'),
						navSpeed: 350,
						dotsSpeed: 250,
						responsiveRefreshRate: 10,
						smartSpeed: 1000, // slide change animation duration when autoplay is on *this causes to unintended autoplay start on mobile after interacted with slider
						autoHeight: true,
						animateIn: animateIn,
						animateOut: animateOut,
						backAnimateIn: backAnimateIn,
						backAnimateOut: backAnimateOut,
						responsive: {
							0: {
								items: 1,
								nav: true
							},
							700: {
								items: items <= 2 ? items : 2,
								nav: false
							},
							960: {
								items: items <= 3 ? items : 3,
								nav: true
							},
							1260: {
								items: items <= 4 ? items : 4,
								nav: true
							}
						},
						onTranslated: function () {

							// fix: slider always autoplays on mobile after interaction with the slider
							if ($(element).data('autoplay') !== true) {
								$(element).trigger('stop.owl.autoplay');
							}
						},
						onInitialized: function () {


							// ------------------------------
							// PARALLAX
							if (!isIE) {

								var $container = $('.post-slider');
								$('.post-slider .post-thumbnail').each(function () {
									if ($(this).data('parallax-video')) { //parallax video
										$(this).jarallax({
											speed: 0,
											zIndex: 1,
											elementInViewport: $container,
											videoSrc: $(this).data('parallax-video')
										});
									} else if ($('html').hasClass('is-slider-parallax')) { //parallax image
										$(this).jarallax({
											elementInViewport: $container,
											zIndex: 1,
											speed: 0.7,
											disableParallax: function () {
												return /iPad|iPhone|iPod|Edge|Trident|Android/.test(navigator.userAgent);
											}
										});
									} // else if
								}); // each

							} // isIE
							// ------------------------------


							// responsive text
							fitSliderTitle();
							setTimeout(function () {
								$('.post-thumbnail .entry-header').addClass('ready');
							}, 300);

							var fixWaitTime;
							$(window).on('resize', function () {
								clearTimeout(fixWaitTime);
								fixWaitTime = setTimeout(function () {
									fitSliderTitle();
								}, 500);
							});

							// update sticky sidebar
							sticky_sidebar_update();


						} // onInitialized

					}); // owlCarousel()


					// listen for slider element self resize and refresh carousel : this fix many issues
					new ResizeSensor($('.owl-carousel'), function () {
						$(element).trigger('refresh.owl.carousel');
					});


					// fix for: nav = false not working
					if ($(element).data('nav') !== true) {
						$(element).find('.owl-nav').hide();
					}


				}); // wait for images




			});	// owl.each()

			function fitSliderTitle() {
				$('.slider-box .entry-title').fitText($('html').data('title-ratio'), { minFontSize: '12px', maxFontSize: '220px' });
			}
		}
		// ------------------------------




		// ------------------------------
		// PARALLAX
		var video_parallax = $(".header-wrap, .intro, .post-thumbnail");

		video_parallax.each(function () {
			if ($(this).data('parallax-video')) {
				$(this).jarallax({
					speed: 0,
					zIndex: 1,
					videoSrc: $(this).data('parallax-video')
				});
			}
		});

		// PARALLAX HEADER BG IMAGE
		$('.is-header-parallax .header-wrap').jarallax({
			zIndex: 1,
			speed: 0.6,
			disableParallax: function () {
				return /iPad|iPhone|iPod|Edge|Trident|Android/.test(navigator.userAgent);
			}
		});

		// PARALLAX INTRO BG IMAGE
		$('.is-intro-parallax .intro').jarallax({
			zIndex: 1,
			speed: 0.6,	//from -1.0 to 2.0,
			disableParallax: function () {
				return /iPad|iPhone|iPod|Edge|Trident|Android/.test(navigator.userAgent);
			}
		});

		// PARALLAX LINK BOXES
		if (!(isIE || isEdge)) { // buggy on IE : disable for now
			$('.is-link-box-parallax .link-box .post-thumbnail').jarallax({
				zIndex: 1,
				speed: isSafari ? 0.5 : 0.7, // safari weird performance fix,
				disableParallax: function () {
					return /iPad|iPhone|iPod|Edge|Trident|Android/.test(navigator.userAgent);
				}
			});
		}
		// PARALLAX RELATED POSTS
		if (!(isIE || isEdge)) { // buggy on IE : disable for now
			$('.is-related-posts-parallax .related-posts .post-thumbnail').jarallax({
				zIndex: 1,
				speed: 0.8,
				disableParallax: function () {
					return /iPad|iPhone|iPod|Edge|Trident|Android/.test(navigator.userAgent);
				}
			});
		}

		// PARALLAX IMAGE IN POST
		parallaxImages();
		// ------------------------------




		// ------------------------------
		// POST THUMBNAILS
		var post_thumbnail = $('.post-thumbnail');
		if (post_thumbnail.length) {

			singlePostParallax();



			// optimized background images for various screens
			post_thumbnail.each(function () {

				var postThumbnail = $(this);
				var parallax = postThumbnail.find('[id^="jarallax"] div');
				var isParallax = parallax.length;
				var parallaxRatio = (isParallax && postThumbnail.parent('.post-header-overlay-inline').length) ? 1.5 : 1;
				var src = "";

				if (postThumbnail.width() * window.devicePixelRatio * parallaxRatio > 1060) { // big screens
					src = postThumbnail.data('large-image');
				} else if (postThumbnail.width() * window.devicePixelRatio * parallaxRatio > 550) { // retina phones or tablets
					src = postThumbnail.data('medium-image');
				}

				if (src !== "") {

					$("<img />").attr("src", src).load(function () {
						if (isParallax) {
							parallax.css('background-image', 'url(' + src + ')');
						} else {
							postThumbnail.css('background-image', 'url(' + src + ')');
						}
					});
				}

			});

			$('*:not(.slider-post) > .post-thumbnail .entry-header').addClass('ready');

		}
		// ------------------------------




		// ------------------------------
		// Fitvids.js : fluid width video embeds
		$("body").fitVids({ customSelector: 'iframe[src*="facebook.com/plugins/video"], iframe[src*="facebook.com/video/embed"]' });
		$('.fluid-width-video-wrapper').wrap('<div class="media-wrap"></div>');
		// ------------------------------


		// ------------------------------
		// FluidBox : Zoomable Images
		setupFluidbox();
		// ------------------------------



		// ------------------------------
		// FORM VALIDATION
		// comment form validation fix
		$('#commentform, .post-password-form, .mc4wp-form form, .mc4wp-form').addClass('validate-form');
		$('#commentform').find('input,textarea').each(function (index, element) {
			if ($(this).attr('aria-required') == "true") {
				$(this).addClass('required');
			}
			if ($(this).attr('name') == "email") {
				$(this).addClass('email');
			}
		});

		// validate form
		if ($('.validate-form').length) {
			$('.validate-form').each(function () {
				$(this).validate();
			});
		}
		// ------------------------------




		// ------------------------------
		// GALLERY COLLAGE LAYOUT
		collage();

		var resizeTimer = null;
		$(window).bind('resize', function () {

			// hide all the images until we resize them
			// set the element you are scaling i.e. the first child nodes of ```.Collage``` to opacity 0
			$('.gallery figure').css("opacity", 0);
			// set a timer to re-apply the plugin
			if (resizeTimer) clearTimeout(resizeTimer);
			resizeTimer = setTimeout(collage, 1200);
			collage();
		});
		// ------------------------------


		// ------------------------------
		// LIGHTBOX - applied to gallery post format  a[href*=".jpg"]

		// zoomable text links
		$('.entry-content .lightbox').wrap("<span class='lightbox'></span>");

		if ($('.lightbox, .gallery, .wp-block-gallery, .portfolio-grid .hentry-middle, .portfolio-grid .featured-image').length && !$('body').hasClass('elementor-page')) {
			$('.lightbox, .gallery, .wp-block-gallery, .portfolio-grid .hentry-middle, .portfolio-grid .featured-image').each(function (index, element) {
				var $media_box = $(this);
				$media_box.magnificPopup({
					delegate: '.lightbox, .gallery-item a[href$=".jpg"], .gallery-item a[href$=".jpeg"], .gallery-item a[href$=".png"], .gallery-item a[href$=".gif"], .wp-block-image a[href$=".jpg"], .wp-block-image a[href$=".jpeg"], .wp-block-image a[href$=".png"], .wp-block-image a[href$=".gif"]',
					type: 'image',
					image: {
						markup: '<div class="mfp-figure">' +
							'<div class="mfp-close"></div>' +
							'<div class="mfp-img"></div>' +
							'</div>' +
							'<div class="mfp-bottom-bar">' +
							'<div class="mfp-title"></div>' +
							'<div class="mfp-counter"></div>' +
							'</div>', // Popup HTML markup. `.mfp-img` div will be replaced with img tag, `.mfp-close` by close button

						cursor: 'mfp-zoom-out-cur', // Class that adds zoom cursor, will be added to body. Set to null to disable zoom out cursor. 
						verticalFit: true, // Fits image in area vertically
						tError: '<a href="%url%">The image</a> could not be loaded.' // Error message
					},
					gallery: {
						enabled: true,
						tCounter: '<span class="mfp-counter">%curr% / %total%</span>' // markup of counter
					},
					iframe: {
						markup: '<div class="mfp-iframe-scaler">' +
							'<div class="mfp-close"></div>' +
							'<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
							'<div class="mfp-title">Some caption</div>' +
							'</div>'
					},
					mainClass: 'mfp-zoom-in',
					tLoading: '',
					removalDelay: 300, //delay removal by X to allow out-animation
					callbacks: {
						markupParse: function (template, values, item) {
							var title = "";
							if (item.el.parents('.gallery-item').length) {
								title = item.el.parents('.gallery-item').find('.gallery-caption').text();
							} else if (item.el.parents('.wp-block-image').length) {
								title = item.el.parents('.wp-block-image').find('.wp-element-caption').text();
							} else {
								title = item.el.attr('title') == undefined ? "" : item.el.attr('title');
							}
							values.title = title;
						},
						imageLoadComplete: function () {
							var self = this;
							setTimeout(function () {
								self.wrap.addClass('mfp-image-loaded');
							}, 16);
						},
						close: function () {
							this.wrap.removeClass('mfp-image-loaded');
						},

						beforeAppend: function () {

							var self = this;

							// square aspect ratio for soundcloud embeds
							if (this.content.find('iframe[src*="soundcloud.com"]').length) {
								self.wrap.addClass('is-soundcloud');
							} else {
								self.wrap.removeClass('is-soundcloud');
							}

							this.content.find('iframe').on('load', function () {
								setTimeout(function () {
									self.wrap.addClass('mfp-image-loaded');
								}, 16);
							});

						}
					},
					closeBtnInside: false,
					closeOnContentClick: true,
					midClick: true
				});
			});
		}
		// ------------------------------


		// gutenberg gallery masonry
		var $wp_gallery = $('.wp-block-gallery:not(.is-cropped)');
		$wp_gallery.each(function() {

			$wp_gallery.isotope({
				// options
				itemSelector: '.wp-block-image',
				layoutMode: 'masonry'
			});
			// layout Isotope after each image loads
			$wp_gallery.imagesLoaded().progress( function() {
				$wp_gallery.isotope('layout');
			});

		});




		// ------------------------------
		// MASONRY - ISOTOPE
		$masonry_container = $('.masonry');
		if ($masonry_container.length) {

			$masonry_container.imagesLoaded(function () {
				// initialize isotope
				$masonry_container.isotope({
					itemSelector: '.hentry',
					layoutMode: $masonry_container.data('layout'),
					transitionDuration: $masonry_container.hasClass('portfolio-grid') ? 400 : 0
				});

				setMasonry();
				setTimeout(function () { $masonry_container.isotope(); }, 20);
				// filters
				if ($masonry_container.data('isotope')) {
					var filters = $('.filters');
					if (filters.length) {
						filters.find('a').on("click", function () {
							var selector = $(this).attr('data-filter');
							$masonry_container.isotope({ filter: selector });
							$(this).parent().addClass('current').siblings().removeClass('current');
							return false;
						});
					}
				}

				// fix item widths on resize
				$(window).on('resize', function () {
					setMasonry();
				});



			}); // images loaded			
		}
		// ------------------------------




		// ------------------------------
		// FULL WIDTH IMAGES with caption fix
		if ($('figure img.full').length) {
			$('figure img.full').parent().addClass('full');
		}
		// ------------------------------


		// ------------------------------
		// HOME LANDING FULLSCREEN VIDEO
		var fs_video = $('.intro-vid');
		if (fs_video.length) {
			bgVideo(fs_video);
			$(window).resize(function () {
				bgVideo(fs_video);
			});
		}

		var resizeTimerVideo = null;
		$(window).bind('resize', function () {
			if (resizeTimerVideo) {
				clearTimeout(resizeTimerVideo);
			}
			resizeTimerVideo = setTimeout(bgVideo(fs_video), 200);
		});
		// ------------------------------



		// ------------------------------
		// STICKY SIDEBAR
		sticky_sidebar();

		// fix for : sticky sidebar overlap when resized to mobile view
		$(window).resize(function () {
			sticky_sidebar_update();
		});
		// ------------------------------


		// ------------------------------
		// LINK BOX FIT TEXT
		$('.link-box .entry-title').fitText($('html').data('link-box-title-ratio'), { minFontSize: '12px' });
		// ------------------------------



		// ------------------------------
		// FIX HEADER
		fixHeader();
		$(window).resize(function () {
			fixHeader();
			setTimeout(function () { fixHeader(); }, 500); // wait for slider post resize
		});
		// ------------------------------



		// ------------------------------
		// FULL SCREEN POST RATIO FIX 
		fixFsRatio();
		$(window).resize(function () {
			fixFsRatio();
			setTimeout(function () { fixFsRatio(); }, 500); // wait for slider post resize
		});
		// ------------------------------



		// ------------------------------
		// https://getwaves.io/
		// https://tympanus.net/Development/SectionSeparators/
		// https://smooth.ie/blogs/news/svg-wavey-transitions-between-sections
		var headerShape = $('html').data('header-bg-shape');
		if (headerShape !== undefined) {

			var headerSvg;
			switch (headerShape) {
				case "curtain":
					headerSvg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 22" preserveAspectRatio="none"><path fill="currentColor" stroke="currentColor" d="M0 0 Q 2.5 40 5 0 Q 7.5 40 10 0 Q 12.5 40 15 0 Q 17.5 40 20 0 Q 22.5 40 25 0 Q 27.5 40 30 0 Q 32.5 40 35 0 Q 37.5 40 40 0 Q 42.5 40 45 0 Q 47.5 40 50 0 Q 52.5 40 55 0 Q 57.5 40 60 0 Q 62.5 40 65 0 Q 67.5 40 70 0 Q 72.5 40 75 0 Q 77.5 40 80 0 Q 82.5 40 85 0 Q 87.5 40 90 0 Q 92.5 40 95 0 Q 97.5 40 100 0 Z"></path></svg>';
					break;
				case "chevron":
					headerSvg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 102" preserveAspectRatio="none"><path fill="currentColor" stroke="currentColor" d="M0 0 L50 100 L100 0 Z"></path></svg>';
					break;
				case "round":
					headerSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0.1 0.3 200 19" preserveAspectRatio="none"><g transform="translate(-0.21755166,-100.15454)"><path style="fill:currentColor;" d="M 0.2688579,100.29477 H 200.98548 c 0,0 -99.37375,39.84098 -200.7166221,0 z"></path></g></svg>'
					break;
				case "round_layers":
					headerSvg = '<svg viewBox="0 0 1280 140" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0v.48C18.62 9.38 297.81 140 639.5 140 993.24 140 1280 0 1280 0z" fill-opacity=".3"></path><path d="M0 .6c14 8.28 176.54 99.8 555.45 119.14C952.41 140 1280 0 1280 0H0z" fill-opacity=".5"></path><path d="M726.29 101.2C1126.36 79.92 1281 0 1281 0H1c.05 0 325.25 122.48 725.29 101.2z"></path></g></svg>';
					break;
				case "cut_left":
					headerSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none"><path fill="currentColor" fill-opacity="1" d="M0,0L720,128L1440,288L1440,0L720,0L0,0Z"></path></svg>';
					break;
				case "cut_left_round":
					headerSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none"><path fill="currentColor" fill-opacity="1" d="M0,64L120,101.3C240,139,480,213,720,250.7C960,288,1200,288,1320,288L1440,288L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"></path></svg>';
					break;
				case "cut_right":
					headerSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none"><path fill="currentColor" fill-opacity="1" d="M0,320L1440,32L1440,0L0,0Z"></path></svg>';
					break;
				case "cut_right_round":
					headerSvg = '<svg viewBox="0 0 500 150" preserveAspectRatio="none"><path d="M-12.69,143.58 C107.50,141.61 373.87,152.45 522.29,-1.47 L500.00,0.00 L0.00,0.00 Z" style="stroke: none; fill: currentColor;"></path></svg>';
					break;
				case "wave_1":
					headerSvg = '<svg width="100%" height="120" viewBox="0.1 0.1 180 40" preserveAspectRatio="none"><g transform="translate(-18.298844,-77.973964)"><path style="fill:currentColor;" d="M 31.615583,86.351641 H 192.16499 v 26.901969 c 0,0 -32.03411,-14.237983 -59.62682,-12.72484 -22.34188,1.2252 -54.779359,9.72634 -54.779359,9.72634 0,0 -22.029534,3.62882 -34.471238,-1.88988 -12.441702,-5.51871 -11.67199,-22.013589 -11.67199,-22.013589 z"></path><path style="fill:currentColor;" d="M 18.441597,78.106256 H 198.58126 v 39.288614 c 0,0 -43.10672,-27.825245 -73.47599,-19.687823 -30.369264,8.137423 -46.832208,12.548653 -46.832208,12.548653 0,0 -32.775418,8.05972 -46.735258,0 C 17.577964,102.19598 18.441597,78.106256 18.441597,78.106256 Z"></path></g></svg>';
					break;
				case "wave_2":
					headerSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none"> <path fill="currentColor" fill-opacity="1" d="M0,160L16,176C32,192,64,224,96,202.7C128,181,160,107,192,101.3C224,96,256,160,288,186.7C320,213,352,203,384,208C416,213,448,235,480,218.7C512,203,544,149,576,122.7C608,96,640,96,672,112C704,128,736,160,768,160C800,160,832,128,864,101.3C896,75,928,53,960,90.7C992,128,1024,224,1056,218.7C1088,213,1120,107,1152,96C1184,85,1216,171,1248,213.3C1280,256,1312,256,1344,240C1376,224,1408,192,1424,176L1440,160L1440,0L1424,0C1408,0,1376,0,1344,0C1312,0,1280,0,1248,0C1216,0,1184,0,1152,0C1120,0,1088,0,1056,0C1024,0,992,0,960,0C928,0,896,0,864,0C832,0,800,0,768,0C736,0,704,0,672,0C640,0,608,0,576,0C544,0,512,0,480,0C448,0,416,0,384,0C352,0,320,0,288,0C256,0,224,0,192,0C160,0,128,0,96,0C64,0,32,0,16,0L0,0Z"></path></svg>';
					break;
				case "wave_3":
					headerSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none"><path fill="currentColor" fill-opacity="1" d="M0,128L60,112C120,96,240,64,360,48C480,32,600,32,720,80C840,128,960,224,1080,266.7C1200,309,1320,299,1380,293.3L1440,288L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>';
					break;
				case "ribbon":
					headerSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none"><path fill="currentColor" fill-opacity="1" d="M0,256L720,128L1440,256L1440,0L720,0L0,0Z"></path></svg>';
					break;
				case "ribbon_round":
					headerSvg = '<svg viewBox="0 0 500 150" preserveAspectRatio="none"><path d="M-12.13,150.48 C196.66,-30.09 318.00,-15.28 512.13,146.53 L500.84,-29.11 L-7.05,-11.34 Z" style="stroke: none; fill: currentColor;"></path></svg>';
					break;
				case "lines_1":
					headerSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none"><path fill="currentColor" fill-opacity="1" d="M0,128L160,192L320,64L480,256L640,96L800,288L960,0L1120,256L1280,288L1440,0L1440,0L1280,0L1120,0L960,0L800,0L640,0L480,0L320,0L160,0L0,0Z"></path></svg>';
					break;
			}

			// add svg to header or menu
			if ($('html').hasClass('is-menu-bottom')) {
				$('.site-header .menu-wrap').append(headerSvg);
				$('.site-header .menu-wrap > svg').addClass('header-bg-shape');
			} else {
				$('.site-header .header-wrap').append(headerSvg);
				$('.site-header .header-wrap > svg').addClass('header-bg-shape');
			}


		}
		// END: HEADER SVG SHAPES 
		//  ------------------------------


		//  ------------------------------
		// STICKY AUDIO EMBEDS 
		if($('html.is-audio-embeds-sticky body.single-post').length) {
			$('iframe[src*="spotify.com"],iframe[src*="podbean.com"],iframe[src*="soundcloud.com"],iframe[src*="simplecast.com"],iframe[src*="tunein.com"],iframe[src*="anchor.fm"],iframe[src*="radiopublic.com"],iframe[src*="castbox.fm"],iframe[src*="iheart.com"],iframe[src*="libsyn.com"],iframe[src*="deezer.com"],iframe[src*="mixcloud.com"],iframe[src*="buzzsprout.com"],iframe[src*="spreaker.com"],iframe[src*="cadence13.com"],iframe[src*="ausha.co"],iframe[src*="podomatic.com"],iframe[src*="blogtalkradio.com"],iframe[src*="megaphone.fm"],iframe[src*="transistor.fm"], iframe[src*="captivate.fm"]').addClass('sticky-audio');

			var sticky_audio_height = $('.sticky-audio').height();
			$('html').css('padding-bottom', sticky_audio_height);
			if($('html').hasClass('is-sidebar-sticky')) {
				$('.sidebar-wrap').css('padding-bottom', sticky_audio_height );
			}
		}
		// END: STICKY AUDIO EMBEDS 
		//  ------------------------------



	});
	// DOCUMENT READY




	// WINDOW ONLOAD
	window.onload = function () {

		/* FIX HEADER */
		fixHeader();

		// FULL SCREEN POST RATIO FIX 
		fixFsRatio();
		setTimeout(function () { fixHeader(); fixFsRatio(); }, 500); // yet another fix for IE11 $#½$#£#


		sticky_sidebar_update();

		// html addclass : loaded
		$('html').addClass('loaded');

		// intro video bg
		bgVideo($('.intro-vid'));




		// ------------------------------
		// NOT FINAL * 
		// should be compatible with elements which height is longer than viewport
		// you may check : https://codepen.io/BoyWithSilverWings/pen/MJgQqR

		// ------------------------------
		// Blur Slider Image On Scroll
		if ($('html').hasClass('is-slider-image-blur-on-scroll')) {
			blurItemOnScroll('.featured-area .post-slider .post-wrap + div');
		}
		// ------------------------------


		// ------------------------------
		// Blur Link Box Image On Scroll
		if ($('html').hasClass('is-link-box-image-blur-on-scroll')) {
			blurItemOnScroll('.featured-area .link-box .post-wrap + div');
		}
		// ------------------------------

		// ------------------------------
		// Blur Featured Image On Scroll
		if ($('html').hasClass('is-featured-image-blur-on-scroll')) {
			blurItemOnScroll('.featured-image img');
			blurItemOnScroll('.top-content-single .post-wrap + div');
			blurItemOnScroll('.top-content-single iframe');
		}
		// ------------------------------
		// ------------------------------
		// NOT FINAL * 


	};
	// WINDOW ONLOAD




	// -------------------------------------------------
	// FUNCTIONS


	// ------------------------------
	// BLUR ITEM ON SCROLL
	function blurItemOnScroll(item) {
		if ($(item).length) {
			$(window).scroll(function () {
				$(item).each(function (index) {
					// console.log($(item).offset().top);
					var oVal = ($(window).scrollTop() - $(this).offset().top) / 50;
					oVal = oVal < 1 ? 0 : oVal;
					var filterVal = 'blur(' + oVal + 'px)';
					$(this)
						.css('filter', filterVal)
						.css('webkitFilter', filterVal)
						.css('mozFilter', filterVal)
						.css('oFilter', filterVal)
						.css('msFilter', filterVal);
				});


			});
		}
	}
	// ------------------------------


	// ------------------------------
	// FIX HEADER 
	function fixHeader() {

		/* HEADER FLOATING - negative margin for the containers that comes after header */
		if ($('html').hasClass('is-header-float') && !($('html').hasClass('is-header-vertical')) ) {

			var headerHeight =
				parseInt($('.site-header:not(.clone)').outerHeight()) +
				parseInt($('.site-header:not(.clone)').css('marginTop') +
					parseInt($('.site-header:not(.clone) .header-wrap').css('marginTop')));

			headerHeight = $('.top-bar').length ? headerHeight + parseInt($('.top-bar').outerHeight()) : headerHeight;
			$('.top-content, .site-header + .site-main, .top-content-single, .site-header ~ .elementor').css('marginTop', '-' + ++headerHeight + 'px');

		}
		/* END: HEADER FLOATING  */


		/* MENU TOP LOGO OVERFLOW - positive margin for the container that comes after header */
		if (!($('html').hasClass('is-header-float')) && $('html').is('.is-menu-top.is-logo-overflow')) {

			var headerHeight = parseInt($('.site-header:not(.clone) .site-branding').outerHeight()) / 2;
			$('.site-header:not(.clone) .header-wrap').css('marginBottom', '-' + headerHeight + 'px');
			$('.site-header + .site-main').css('marginTop', + headerHeight + 'px');

		}
		/* END: MENU TOP LOGO OVERFLOW */


		/* MENU BOTTOM OVERFLOW - positive margin for the container that comes after header */
		if (!($('html').hasClass('is-header-float')) && $('html').is('.is-menu-bottom.is-menu-bottom-overflow')) {

			var headerHeight = parseInt($('.site-header:not(.clone) .site-navigation:not(.clone)').outerHeight()) / 2;
			$('.site-header:not(.clone) .site-navigation:not(.clone)').css('marginBottom', '-' + headerHeight + 'px');
			$('.site-header + .site-main').css('marginTop', + headerHeight + 'px');

		}
		/* END: MENU BOTTOM OVERFLOW  */


		/* HEADER VERTICAL */
		var isHeaderVertical = $('html').hasClass('is-header-vertical'),
			isHeaderVerticalLeft = $('html').hasClass('is-header-vertical-left'),
			isHeaderVerticalRight = $('html').hasClass('is-header-vertical-right');

		if (isHeaderVertical) {

			var header = $('.site-header');

			// SubMenu padding top fix for all browsers and for all level submenus
			$('.nav-menu li.has-submenu').each(function () {
				$(this).find('ul').css("padding-top", ($(this).offset().top - $(window).scrollTop()) + 'px');
			});

			// header vertical left : fix for 1st level submenu left for all browsers 
			if (isHeaderVerticalLeft) {
				$('.nav-menu > ul > li > ul').css("left", (header.offset().left + header.width()) + 'px');
			}

			// header vertical right : fix for 1st level submenu right for all browsers 
			if (isHeaderVerticalRight) {
				var offsetRight = ($(window).width() - (header.offset().left + header.outerWidth()));
				var right = header.width() + offsetRight - 1;
				$('.nav-menu > ul > li > ul').css("right", right + 'px');
			}

			// IE 11 3rd level submenu left fix
			if (isIE) {
				$('.nav-menu ul ul ul').each(function () {
					// find out how many parent ul element there is of this submenu
					var depth = $(this, ".nav-menu").parents("ul").length;
					var subWidth = $('.nav-menu ul ul').width();

					if (isHeaderVerticalLeft) {
						$(this).css("left", (header.offset().left + header.width() + (subWidth * --depth)) + 'px');
					}
					else if (isHeaderVerticalRight) {
						var offsetRight = ($(window).width() - header.offset().left);
						var right = (subWidth * --depth) + offsetRight;
						$(this).css("right", right + 'px');
					}
				});
			} //end if isIE


		} // end if isHeaderVertical
		/* END: HEADER VERTICAL */


	} // end fixHeader()
	// ------------------------------


	// ------------------------------
	// FIX FS RATIO for slider post
	function fixFsRatio() {
		if (!($('html').hasClass('is-header-float'))) {

			var headerHeight = parseInt($('.site-header:not(.clone').outerHeight()) + parseInt($('.site-header:not(.clone)').css('marginTop'));

			/* menu top logo overflow fix */
			headerHeight = $('html').is('.is-menu-top.is-logo-overflow') ? headerHeight - (parseInt($('.site-header:not(.clone) .site-branding').outerHeight()) / 2) : headerHeight;

			/* header vertical fix */
			headerHeight = $('html').hasClass('is-header-vertical') ? 0 : headerHeight;

			/* add top-bar height too */
			headerHeight = $('.top-bar').length ? headerHeight + parseInt($('.top-bar').outerHeight()) : headerHeight;

			// fix for 1px empty space from bottom - sometimes
			headerHeight--;

			$('.ratio-fs .post-wrap').css('minHeight', 'calc(100vh - ' + headerHeight + 'px)');

		}
	}
	// ------------------------------


	// ------------------------------
	// SINGLE POST PARALLAX
	function singlePostParallax() {
		// PARALLAX OVERLAY POST OVERLAY MEDIUM
		$('.is-top-content-single-medium .post-thumbnail').jarallax({
			zIndex: 1,
			speed: 0.6,
			disableParallax: function () {
				return /iPad|iPhone|iPod|Edge|Trident|Android/.test(navigator.userAgent);
			}
		});

		// PARALLAX OVERLAY POST OVERLAY FULL/FULL MARGINS
		$('.is-top-content-single-full .post-thumbnail, .is-top-content-single-full-screen .post-thumbnail, .is-top-content-single-full-margins .post-thumbnail').jarallax({
			zIndex: 1,
			speed: 0.6,
			disableParallax: function () {
				return /iPad|iPhone|iPod|Edge|Trident|Android/.test(navigator.userAgent);
			}
		});

		// PARALLAX OVERLAY POST OVERLAY INLINE
		$('.post-header-overlay-inline .post-thumbnail').jarallax({
			zIndex: 1,
			speed: 0.7,
			disableParallax: function () {
				return /iPad|iPhone|iPod|Edge|Trident|Android/.test(navigator.userAgent);
			}
		});

	}
	// ------------------------------



	// ------------------------------
	// STICKY SIDEBAR
	var stickySidebar;
	function sticky_sidebar() {

		if ($('.is-sidebar-sticky #secondary').length) {
			jQuery.support.touch = 'ontouchend' in document;
			if (window.matchMedia("(min-width: 992px)").matches && !(jQuery.support.touch) && ($('#primary').height() > $('#secondary').height())) {

				stickySidebar = new StickySidebar('#secondary', {
					topSpacing: 80,
					bottomSpacing: 20,
					resizeSensor: true,
					containerSelector: '.site-main > div',
					innerWrapperSelector: '.sidebar-wrap'
				});

			}
		}
	}
	// ------------------------------


	// ------------------------------
	// UPDATE STICKY SIDEBAR
	function sticky_sidebar_update() {
		if ($('.is-sidebar-sticky #secondary').length) {
			jQuery.support.touch = 'ontouchend' in document;
			if (window.matchMedia("(min-width: 992px)").matches && !(jQuery.support.touch) && ($('#primary').height() > $('#secondary').height())) {

				stickySidebar.updateSticky();

			}
			// fix for : sticky sidebar overlap when resized to mobile view
			if (window.matchMedia("(max-width: 991px)").matches) {

				if (stickySidebar) {
					stickySidebar.destroy();
				}

			}
		}
	}
	// ------------------------------


	// ------------------------------
	// FULL SCREEN BG VIDEO
	function bgVideo(fs_video) {

		var videoW = fs_video.find('iframe, video').width(),
			videoH = fs_video.find('iframe, video').height(),
			screenW = $('.intro').outerWidth(),
			screenH = $('.intro').outerHeight();

		var video_ratio = videoW / videoH;
		var screen_ratio = screenW / screenH;

		if (video_ratio > screen_ratio) {
			var diffW = screenH / videoH;
			var newWidth = videoW * diffW;
			fs_video.css({ 'width': newWidth, 'margin-left': -((newWidth - screenW) / 2), 'margin-top': 0 });
		} else {
			var diffH = screenH / videoH;
			var newHeight = screenH * diffH;
			fs_video.css({ 'width': "100%", 'margin-left': 0, 'margin-top': -((videoH - screenH) / 2) });
		}
	}
	// ------------------------------



	// ------------------------------
	// FULL WIDTH PARALLAX IMAGES
	function parallaxImages() {
		$('img.parallax').each(function (index, element) {

			var img = $(element);
			$('<div class="parallax-image"></div>').insertBefore(img);
			var wrapper = img.prev('.parallax-image');
			wrapper.css('background-image', 'url(' + img.attr('src') + ')');

			if (img.hasClass('half')) {
				wrapper.addClass('half');
			}

			var isIE = document.documentMode || /Edge/.test(navigator.userAgent);
			if (!isIE) {
				img.imagesLoaded(function () {

					// PARALLAX EFFECT
					var aspect_ratio = img.width() / img.height();
					var speed = aspect_ratio > 1.2 ? 0.2 : -0.9;
					speed = $('.content-area').hasClass('with-sidebar') ? 0.2 : speed;
					wrapper.jarallax({
						zIndex: 1,
						speed: speed,
						disableParallax: function () {
							return /iPad|iPhone|iPod|Edge|Trident|Android/.test(navigator.userAgent);
						}
					});

				});
			}
		});
	}
	// ------------------------------




	// ------------------------------
	// FluidBox : Zoomable Images
	function setupFluidbox() {

		$('.entry-content > p a, .wp-caption a, a.zoom').each(function () {

			// prevent conflict with the woocommerce lightbox - both have zoom class
			if ($('body').hasClass('woocommerce')) {
				return;
			}
			if ($(this).attr('href').match(/\.(jpeg|jpg|gif|png)$/) !== null) {
				$(this).fluidbox({
					viewportFill: 0.8,
					immediateOpen: true,
					loader: false,
					stackIndex: 400
				});
			}
		});
	}
	// ------------------------------



	// ------------------------------
	// GALLERY COLLAGE LAYOUT
	function collage() {
		var collage = $('.gallery');
		if (collage.length) {

			collage.each(function (index, el) {

				// wait for images to be loaded
				$(el).imagesLoaded(function () {

					$(el).removeClass('pw-collage-loading').addClass('has-collage-layout');
					$(el).collagePlus({

						'targetHeight': 360,
						'effect': 'effect-4',
						'allowPartialLastRow': false

					}); //collagePlus()

				}); //imagesLoaded()

			}); //each
		}
	}
	// ------------------------------



	// ------------------------------
	// MASONRY LAYOUT : changes the number of masonry columns based on the current container's width
	function setMasonry() {

		var itemW = $masonry_container.data('item-width');
		var containerW = $masonry_container.width();
		var items = $masonry_container.children('.hentry');
		var columns = Math.round(containerW / itemW);
		$masonry_container.removeClass('col-1 col-2 col-3 col-4- col-5 col-6 col-7- col-8').addClass('col-' + columns);

		// set the widths (%) for each of item
		items.each(function (index, element) {
			var multiplier = ($masonry_container.hasClass('first-full') && index === 0) && columns > 1 ? 2 : 1;
			var itemRealWidth = (Math.floor(containerW / columns) * 100 / containerW) * multiplier;
			itemRealWidth = itemRealWidth > 100 ? 100 : itemRealWidth;
			$(this).css('width', itemRealWidth + '%');
		});

		var columnWidth = Math.floor(containerW / columns);
		$masonry_container.isotope('option', { masonry: { columnWidth: columnWidth } });
	}
	// ------------------------------



})(jQuery);