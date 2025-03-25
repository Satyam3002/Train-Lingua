/*
	Name: TheBlogger Shortcodes
	Version: 1.0
	Author: pixelwars
*/

(function ($) {
	"use strict";

	/* DOCUMENT READY */
	$(function () {
		
		
		// ------------------------------
		// FILL PROGRESS BARS
		function fillBars() {
			$('.bar').each(function () {
				var bar = $(this);
				var percent = bar.attr('data-percent');
				bar.find('.progress').css('width', percent + '%').html('<span>' + percent + '</span>');
			});
		}
		fillBars();
		// ------------------------------



		// ------------------------------
		// TABS
		var tabs = $('.tabs');
		if (tabs.length) {
			tabs.each(function () {
				if (!$(this).find('.tab-titles li a.active').length) {
					$(this).find('.tab-titles li:first-child a').addClass('active');
					$(this).find('.tab-content > div:first-child').show();
				} else {
					$(this).find('.tab-content > div').eq($(this).find('.tab-titles li a.active').parent().index()).show();
				}
				setupFluidbox();
			});

			tabs.find('.tab-titles li a').on("click", function () {
				if ($(this).hasClass('active')) { return; }
				$(this).parent().siblings().find('a').removeClass('active');
				$(this).addClass('active');
				$(this).parents('.tabs').find('.tab-content > div').hide().eq($(this).parent().index()).show();
				setupFluidbox();
				return false;
			});
		}
		// ------------------------------



		// ------------------------------
		// TOGGLES
		var toggle = $('.toggle');
		if (toggle.length) {

			var toggleSpeed = 300;
			$('.toggle h4.active + .toggle-content').show();

			$('.toggle h4').on("click", function () {
				if ($(this).hasClass('active')) {
					$(this).removeClass('active');
					$(this).next('.toggle-content').stop(true, true).slideUp(toggleSpeed);
				} else {

					$(this).addClass('active');

					$(this).next('.toggle-content').stop(true, true).slideDown(toggleSpeed, function () {
						setupFluidbox();
					}
					);

					setupFluidbox();

					//accordion
					if ($(this).parents('.toggle-group').hasClass('accordion')) {
						$(this).parent().siblings().find('h4').removeClass('active');
						$(this).parent().siblings().find('.toggle-content').stop(true, true).slideUp(toggleSpeed);
					}

				}
				return false;
			});
		}
		// ------------------------------



		// ------------------------------
		// CONTACT FORM
		// jQuery Ajax Mail Send Script		
		var contactForm = $('#contact-form');
		var $submit = contactForm.find('.submit');

		contactForm.submit(function () {
			if (contactForm.valid()) {
				$submit.addClass("active loading");
				var formValues = contactForm.serialize();

				$.post(contactForm.attr('action'), formValues, function (data) {
					if (data == 'success') {
						setTimeout(function () {
							$submit.removeClass("loading").addClass("success");
							contactForm.clearForm();
						}, 2000);
					}
					else {
						$submit.removeClass("loading").addClass("error");
					}
				});
			}

			return false
		});

		$.fn.clearForm = function () {
			return this.each(function () {
				var type = this.type, tag = this.tagName.toLowerCase();
				if (tag == 'form')
					return $(':input', this).clearForm();
				if (type == 'text' || type == 'password' || tag == 'textarea')
					this.value = '';
				else if (type == 'checkbox' || type == 'radio')
					this.checked = false;
				else if (tag == 'select')
					this.selectedIndex = -1;
			});
		};
		// ------------------------------



	});
	// DOCUMENT READY



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

})(jQuery);
