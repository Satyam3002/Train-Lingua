( function( $, elementor ) {

	'use strict';

	window.JetPopupElementorFrontend = {

		init: function() {

			if ( ! elementor ) {
				return false;
			}

			elementor.hooks.addAction( 'frontend/element_ready/widget', JetPopupElementorFrontend.elementorWidget );

			const widgets = {
				'jet-popup-action-button.default' : JetPopupElementorFrontend.widgetPopupActionButton,
				'jet-popup-mailchimp.default' : JetPopupElementorFrontend.widgetPopupMailchimp
			};

			$.each( widgets, function( widget, callback ) {
				elementor.hooks.addAction( 'frontend/element_ready/' + widget, callback );
			} );

			elementor.hooks.addAction( 'frontend/element_ready/section', JetPopupElementorFrontend.elementorWidget );
			elementor.hooks.addAction( 'frontend/element_ready/container', JetPopupElementorFrontend.elementorWidget );
		},

		elementorWidget: function( $scope ) {
			let widget_id     = $scope.data( 'id' ),
				widgetType    = $scope.data( 'element_type' ),
				popupSettings = $scope.data( 'jet-popup' ) || false;

			if ( popupSettings ) {
				let openEvent     = popupSettings[ 'trigger-type' ],
					customSelector = popupSettings[ 'trigger-custom-selector' ],
					popupData      = {
						popupId: popupSettings[ 'attached-popup' ]
					};

				if ( $scope.hasClass( 'jet-popup-attach-event-inited' ) ) {
					return false;
				}

				$scope.addClass( 'jet-popup-attach-event-inited' );

				switch( openEvent ) {
					case 'click-self':
						$scope.addClass( 'jet-popup-cursor-pointer' );

						$scope.on( 'click.JetPopup', function( event ) {
							event.preventDefault();

							var $target = $( this );

							if ( elementor.hooks ) {
								popupData = elementor.hooks.applyFilters(
									'jet-popup/widget-extensions/popup-data',
									popupData,
									popupSettings,
									$scope,
									event
								);
							}

							$( window ).trigger( {
								type: 'jet-popup-open-trigger',
								popupData: popupData,
								triggeredBy: $scope,
							} );

							return false;
						} );
						break;
					case 'click':
						$scope.on( 'click.JetPopup', '.elementor-button, .jet-button__instance, .jet-popup-action-button__instance', function( event ) {
							event.preventDefault();

							if ( elementor.hooks ) {
								popupData = elementor.hooks.applyFilters(
									'jet-popup/widget-extensions/popup-data',
									popupData,
									popupSettings,
									$scope,
									event
								);
							}

							$( window ).trigger( {
								type: 'jet-popup-open-trigger',
								popupData: popupData,
								triggeredBy: $( this ),
							} );

							return false;
						} );
						break;
					case 'click-selector':

						if ( '' !== customSelector ) {
							$( customSelector ).addClass( 'jet-popup-cursor-pointer' );

							$scope.on( 'click.JetPopup', customSelector, function( event ) {
								event.preventDefault();

								var $target = $( event.currentTarget );

								$target.addClass( 'jet-popup-cursor-pointer' );

								if ( elementor.hooks ) {
									popupData = elementor.hooks.applyFilters(
										'jet-popup/widget-extensions/popup-data',
										popupData,
										popupSettings,
										$scope,
										event
									);
								}

								$( window ).trigger( {
									type: 'jet-popup-open-trigger',
									popupData: popupData,
									triggeredBy: $target,
								} );

								return false;
							} );
						}
						break;
					case 'hover':
						$scope.on( 'mouseenter.JetPopup', function( event ) {

							if ( elementor.hooks ) {
								popupData = elementor.hooks.applyFilters(
									'jet-popup/widget-extensions/popup-data',
									popupData,
									popupSettings,
									$scope,
									event
								);
							}

							$( window ).trigger( {
								type: 'jet-popup-open-trigger',
								popupData: popupData,
								triggeredBy: $scope,
							} );
						} );
						break;
					case 'scroll-to':
						const observer = new IntersectionObserver(( entries ) => {
							entries.forEach(( entry ) => {

								if ( entry.isIntersecting ) {

									if ( elementor.hooks ) {
										popupData = elementor.hooks.applyFilters(
											'jet-popup/widget-extensions/popup-data',
											popupData,
											popupSettings,
											$scope,
										);
									}

									$( window ).trigger( {
										type: 'jet-popup-open-trigger',
										popupData: popupData,
										triggeredBy: $scope,
									} );
								}			
							})
						},
						{ 
							threshold: 0.5
						});

						for ( let i = 0; i < $( $scope ).length; i++ ) {
							const elements = $( $scope )[i];
							observer.observe( elements );
						} 
						break;
				}
			}
		},

		widgetPopupActionButton: function( $scope ) {
			var $button    = $( '.jet-popup-action-button__instance', $scope ),
				settings   = $button.data( 'settings' ),
				actionType = settings['action-type'];

			window.JetPopupFrontend.actionButtonHandle( $button, actionType );
		},

		widgetPopupMailchimp: function( $scope ) {
			var $target               = $scope.find( '.jet-popup-mailchimp' ),
				scoreId               = $scope.data( 'id' ),
				settings              = $target.data( 'settings' ),
				$subscribeForm        = $( '.jet-popup-mailchimp__form', $target ),
				$fields                = $( '.jet-popup-mailchimp__fields', $target ),
				$mailField            = $( '.jet-popup-mailchimp__mail-field', $target ),
				$inputData            = $mailField.data( 'instance-data' ),
				$submitButton         = $( '.jet-popup-mailchimp__submit', $target ),
				$subscribeFormMessage = $( '.jet-popup-mailchimp__message', $target ),
				invalidMailMessage    = 'Please specify a valid email',
				timeout               = null,
				ajaxRequest           = null,
				$currentPopup         = $target.closest( '.jet-popup' );

			$mailField.on( 'focus', function() {
				$mailField.removeClass( 'mail-invalid' );
			} );

			$( document ).keydown( function( event ) {

				if ( 13 === event.keyCode && $mailField.is( ':focus' ) ) {
					subscribeHandle();

					return false;
				}
			} );

			$submitButton.on( 'click', function() {
				subscribeHandle();

				return false;
			} );

			self.subscribeHandle = function() {
				var inputValue     = $mailField.val(),
					sendData       = {
						'email': inputValue,
						'target_list_id': settings['target_list_id'] || '',
						'data': $inputData
					},
					serializeArray = $subscribeForm.serializeArray(),
					additionalFields = {};

				if ( validateEmail( inputValue ) ) {

					$.each( serializeArray, function( key, fieldData ) {
						if ( 'email' === fieldData.name ) {
							sendData[ fieldData.name ] = fieldData.value;
						} else {
							additionalFields[ fieldData.name ] = fieldData.value;
						}
					} );

					sendData['additional'] = additionalFields;

					ajaxRequest = jQuery.ajax( {
						type: 'POST',
						url: window.jetPopupData.ajax_url,
						data: {
							'action': 'jet_popup_mailchimp_ajax',
							'data': sendData
						},
						beforeSend: function( jqXHR, ajaxSettings ) {
							if ( null !== ajaxRequest ) {
								ajaxRequest.abort();
							}
						},
						error: function( jqXHR, ajaxSettings ) {

						},
						success: function( data, textStatus, jqXHR ) {
							var successType   = data.type,
								message       = data.message || '',
								responceClass = 'jet-popup-mailchimp--response-' + successType;

							$submitButton.removeClass( 'loading' );

							$target.removeClass( 'jet-popup-mailchimp--response-error' );
							$target.addClass( responceClass );

							$( 'span', $subscribeFormMessage ).html( message );
							$subscribeFormMessage.css( { 'visibility': 'visible' } );

							timeout = setTimeout( function() {
								$subscribeFormMessage.css( { 'visibility': 'hidden' } );
								$target.removeClass( responceClass );
							}, 10000 );

							if ( settings['redirect'] ) {
								window.location.href = settings['redirect_url'];
							}

							$( window ).trigger( {
								type: 'jet-popup/mailchimp',
								elementId: scoreId,
								successType: successType,
								inputData: $inputData
							} );

							if ( true === settings['close_popup_when_success'] && $currentPopup[0] && 'success' === successType ) {
								var popupId = $currentPopup.attr( 'id' );

								timeout = setTimeout( function() {
									$( window ).trigger( {
										type: 'jet-popup-close-trigger',
										popupData: {
											popupId: popupId,
											constantly: false
										}
									} );
								}, 3000 );

							}
						}
					} );


					$submitButton.addClass( 'loading' );
				} else {
					$mailField.addClass( 'mail-invalid' );

					$target.addClass( 'jet-popup-mailchimp--response-error' );
					$( 'span', $subscribeFormMessage ).html( invalidMailMessage );
					$subscribeFormMessage.css( { 'visibility': 'visible' } );

					timeout = setTimeout( function() {
						$target.removeClass( 'jet-popup-mailchimp--response-error' );
						$subscribeFormMessage.css( { 'visibility': 'hidden' } );
						$mailField.removeClass( 'mail-invalid' );
					}, 10000 );
				}
			}

			function validateEmail( email ) {
				var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

				return re.test( email );
			}
		},
	};

	// Elementor front init
	$( window ).on( 'elementor/frontend/init', () => {
		window.JetPopupElementorFrontend.init();
	} );

}( jQuery, window.elementorFrontend ) );
