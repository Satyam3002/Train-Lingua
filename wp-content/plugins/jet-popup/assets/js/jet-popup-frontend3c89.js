( function( $ ) {

	'use strict';

	window.JetPopupFrontend = {

		addedScripts: {},

		addedStyles: {},

		addedAssetsPromises: [],

		init: function() {
			let $popup_list = $( '.jet-popup.jet-popup--front-mode' );

			$popup_list.each( function( index ) {
				let $target  = $( this ),
					instance = null,
					settings = $target.data( 'settings' );

				instance = new window.jetPopup( $target, settings );
				instance.init();
			} );

			JetPopupFrontend.initAttachedPopups();

			JetPopupFrontend.initBlocks();

			$( window ).on( 'jet-popup/ajax/frontend-init', ( event, payload ) => {

				switch ( payload.contentType ) {
					case 'elementor':
						JetPopupFrontend.maybeElementorFrontendInit( payload.$container );
						break;
					case 'default':
						JetPopupFrontend.maybeDefaultFrontendInit( payload );
						break
				}
			} );
		},

		initAttachedPopups: function ( $scope ) {
			$scope = $scope || $( 'body' );

			$scope.find( '[data-popup-instance]' ).each( ( index, el ) => {
				let $this = $( el ),
					popupId = $this.data( 'popup-instance' ) || 'none',
					triggerType = $this.data( 'popup-trigger-type' ) || 'none',
					clickedCustomClass = $this.data( 'popup-custom-selector' ) || '',
					popupData = {
						popupId: `jet-popup-${ popupId }`,
					};

				if ( $this.hasClass( 'jet-popup-attach-event-inited' ) ) {
					return;
				}

				$this.addClass( 'jet-popup-attach-event-inited' );

				switch( triggerType ) {
					case 'click-self':
						$this.addClass( 'jet-popup-cursor-pointer' );

						$this.on( 'click.JetPopup', function( event ) {
							event.preventDefault();

							$( window ).trigger( {
								type: 'jet-popup-open-trigger',
								popupData: popupData,
								triggeredBy: $this,
							} );

							return false;
						} );
						break;
					case 'click-selector':

						if ( '' !== clickedCustomClass ) {
							$this.find( clickedCustomClass ).addClass( 'jet-popup-cursor-pointer' );

							$this.on( 'click.JetPopup', clickedCustomClass, function( event ) {
								event.preventDefault();

								$( window ).trigger( {
									type: 'jet-popup-open-trigger',
									popupData: popupData,
									triggeredBy: $this,
								} );

								return false;
							} );
						}
						break;
					case 'hover':
						$this.on( 'mouseenter.JetPopup', function( event ) {

							$( window ).trigger( {
								type: 'jet-popup-open-trigger',
								popupData: popupData,
								triggeredBy: $this,
							} );
						} );
						break;
					case 'scroll-to':
						const observer = new IntersectionObserver(( entries ) => {
							entries.forEach(( entry ) => {

								if ( entry.isIntersecting ) {

									$( window ).trigger( {
										type: 'jet-popup-open-trigger',
										popupData: popupData,
										triggeredBy: $this,
									} );
								}			
							})
						},
						{ 
							threshold: 0.5
						});

						for ( let i = 0; i < $( $this ).length; i++ ) {
							const elements = $( $this )[i];
							observer.observe( elements );
						} 

						break;
				}
			} );
		},

		initBlocks: function( $scope ) {
			$scope = $scope || $( 'body' );

			window.JetPlugins.init( $scope, [
				{
					block: 'jet-popup/action-button',
					callback: ( $scope ) => {
						let $button    = $( '.jet-popup-action-button__instance', $scope ),
							actionType = $scope.data( 'action-type' );

						JetPopupFrontend.actionButtonHandle( $button, actionType );
					}
				}
			] );
		},

		actionButtonBlock: function( $scope ) {
			var $button    = $( '.jet-popup-action-button__instance', $scope ),
				actionType = $scope.data( 'action-type' );

			JetPopupFrontend.actionButtonHandle( $button, actionType );
		},

		actionButtonHandle: function ( $button, actionType = 'link' ) {

			switch ( actionType ) {

				case 'link':

					$button.on( 'click.JetPopup', function( event ) {
						event.preventDefault();

						var $currentPopup = $button.closest( '.jet-popup' ),
							link          = $( this ).attr( 'href' ),
							target        = $( this ).attr( 'target' ),
							popupId       = $currentPopup.attr( 'id' );

						$( window ).trigger( {
							type: 'jet-popup-close-trigger',
							popupData: {
								popupId: popupId,
								constantly: false
							}
						} );

						if ( '_blank' === target  ) {
							window.open( link, '_blank' );
						} else {
							window.open( link, '_self' );
						}

						return false;
					} );
					break;

				case 'leave':
					$button.on( 'click.JetPopup', function( event ) {
						event.preventDefault();

						window.history.back();
					} );
					break;

				case 'close-popup':
					$button.on( 'click.JetPopup', function( event ) {
						event.preventDefault();

						var $currentPopup = $button.closest( '.jet-popup' ),
							popupId = $currentPopup.attr( 'id' );

						$( window ).trigger( {
							type: 'jet-popup-close-trigger',
							popupData: {
								popupId: popupId,
								constantly: false
							}
						} );
					} );
					break;

				case 'close-all-popups':
					$button.on( 'click.JetPopup', function( event ) {
						event.preventDefault();

						var $popups = $( '.jet-popup' );

						if ( $popups[0] ) {
							$popups.each( function( index ) {
								var $popup  = $( this ),
									popupId = $popup.attr( 'id' );

								$( window ).trigger( {
									type: 'jet-popup-close-trigger',
									popupData: {
										popupId: popupId,
										constantly: false
									}
								} );
							} );
						}
					} );
					break;

				case 'close-constantly':
					$button.on( 'click.JetPopup', function( event ) {
						event.preventDefault();

						var $currentPopup = $button.closest( '.jet-popup' ),
							popupId = $currentPopup.attr( 'id' );

						$( window ).trigger( {
							type: 'jet-popup-close-trigger',
							popupData: {
								popupId: popupId,
								constantly: true
							}
						} );
					} );
					break;

				case 'close-all-constantly':
					$button.on( 'click.JetPopup', function( event ) {
						event.preventDefault();

						var $popups = $( '.jet-popup' );

						if ( $popups[0] ) {
							$popups.each( function( index ) {
								var $popup  = $( this ),
									popupId = $popup.attr( 'id' );

								$( window ).trigger( {
									type: 'jet-popup-close-trigger',
									popupData: {
										popupId: popupId,
										constantly: true
									}
								} );
							} );
						}
					} );
					break;
			}
		},

		loadScriptAsync: function( script, uri ) {

			if ( JetPopupFrontend.addedScripts.hasOwnProperty( script ) ) {
				return script;
			}

			JetPopupFrontend.addedScripts[ script ] = uri;

			const asset = document.getElementById( script + '-js' );

			if ( asset ) {
				return script;
			}

			return new Promise( function( resolve, reject ) {
				var tag = document.createElement( 'script' );

				tag.src    = uri;
				tag.async  = false;
				tag.onload = function() {
					resolve( script );
				};

				document.head.appendChild( tag );
			} );
		},

		loadStyle: function( style, uri ) {

			if ( JetPopupFrontend.addedStyles.hasOwnProperty( style ) && JetPopupFrontend.addedStyles[ style ] ===  uri) {
				return style;
			}

			JetPopupFrontend.addedStyles[ style ] = uri;

			return new Promise( function( resolve, reject ) {
				var tag = document.createElement( 'link' );

				tag.id      = style;
				tag.rel     = 'stylesheet';
				tag.href    = uri;
				tag.type    = 'text/css';
				tag.media   = 'all';
				tag.onload  = function() {
					resolve( style );
				};

				document.head.appendChild( tag );
			});
		},

		assetsLoaderPromise: function() {
			return Promise.all( JetPopupFrontend.addedAssetsPromises );
		},

		maybeElementorFrontendInit: function( $popupContainer ) {
			$popupContainer.find( 'div[data-element_type]' ).each( function() {
				var $this       = $( this ),
				    elementType = $this.data( 'element_type' );

				if ( ! elementType ) {
					return;
				}

				try {
					if ( 'widget' === elementType ) {
						elementType = $this.data( 'widget_type' );

						if ( window.elementorFrontend && window.elementorFrontend.hooks ) {
							window.elementorFrontend.hooks.doAction( 'frontend/element_ready/widget', $this, $ );
						}
					}

					if ( window.elementorFrontend && window.elementorFrontend.hooks ) {
						window.elementorFrontend.hooks.doAction( 'frontend/element_ready/global', $this, $ );
						window.elementorFrontend.hooks.doAction( 'frontend/element_ready/' + elementType, $this, $ );
					}

				} catch ( err ) {
					console.log(err);
					$this.remove();

					return false;
				}
			} );
		},

		maybeDefaultFrontendInit: function ( payload ) {
			const contentElements = payload.contentElements || [],
				$container = payload.$container;

			$container.find( '[data-is-block*="/"]' ).each( ( index, el ) => {
				window.JetPlugins.hooks.doAction( window.JetPlugins.hookNameFromBlock( el.dataset.isBlock ), jQuery( el ) );
			} );
		}
	};

	/**
	 * [jetPopup description]
	 * @param  {[type]} $popup   [description]
	 * @param  {[type]} settings [description]
	 * @return {[type]}          [description]
	 */
	window.jetPopup = function( $popup, settings ) {
		var self                   = this,
			$window                = $( window ),
			$document              = $( document ),
			popupSettings          = settings,
			id                     = popupSettings['id'],
			popupId                = popupSettings['jet-popup-id'],
			popupsLocalStorageData = {},
			//editMode               = Boolean( window.elementorFrontend.isEditMode() ),
			isAnimation            = false,
			isOpen                 = false,
			ajaxGetContentHanler   = null,
			ajaxContentLoaded      = false;

		self.init = function() {
			var popupAvailable = self.popupAvailableCheck();

			if ( ! popupAvailable ) {
				return false;
			}

			self.setLocalStorageData( popupId, 'enable' );

			self.initCompatibilityHandler();

			self.initOpenEvent();

			self.initCloseEvent();

			$window.trigger( 'jet-popup/init/after', {
				self: self,
				settings: popupSettings
			} );
		};

		/**
		 * [popupAvailableCheck description]
		 * @return {[type]} [description]
		 */
		self.popupAvailableCheck = function() {
			var storageData = self.getLocalStorageData() || {};

			if ( ! storageData.hasOwnProperty( popupId ) ) {
				return true;
			}

			var popupData     = storageData[ popupId ],
				status        = 'enable',
				showAgainDate = 'none';

			if ( 'disable' === popupData ) {
				return false;
			}

			if ( 'enable' === popupData ) {
				return true;
			}

			if ( popupData.hasOwnProperty( 'status' ) ) {
				status = popupData['status'];
			}

			if ( 'enable' === status ) {
				return true;
			}

			if ( popupData.hasOwnProperty( 'show-again-date' ) ) {
				showAgainDate = popupData['show-again-date'];
			}

			if ( 'none' === showAgainDate && 'disable' === status ) {
				return false;
			}

			if ( showAgainDate < Date.now() ) {
				return true;
			} else {
				return false;
			}
		};

		/**
		 * [initOpenEvent description]
		 * @return {[type]} [description]
		 */
		self.initOpenEvent = function() {

			$window.trigger( 'jet-popup/init-events/before', {
				self: self,
				settings: popupSettings
			} );

			switch ( popupSettings['open-trigger'] ) {
				case 'page-load':
					self.pageLoadEvent( popupSettings['page-load-delay'] );
				break;

				case 'user-inactive':
					self.userInactiveEvent( popupSettings['user-inactivity-time'] );
				break;

				case 'scroll-trigger':
					self.scrollPageEvent( popupSettings['scrolled-to'] );
				break;

				case 'try-exit-trigger':
					self.tryExitEvent();
				break;

				case 'on-date':
					self.onDateEvent( popupSettings['on-date'] );
				break;

				case 'on-time':
					self.onTimeEvent( popupSettings['on-time-start'], popupSettings['on-time-end'] );
				break;

				case 'on-date-and-time':
					self.onTimeAndDateEvent( popupSettings['start-date-and-time'], popupSettings['end-date-and-time'] );
				break;

				case 'custom-selector':
					self.onCustomSelector( popupSettings['custom-selector'] );
				break;$scope
			}

			$window.on( 'jet-popup-open-trigger', function( event ) {
				var popupData   = event.popupData || {},
					triggeredBy = event.triggeredBy || false,
					popupUniqId = popupData.popupId || false;

				if ( popupUniqId == popupId ) {
					self.showPopup( popupData, triggeredBy );
				}
			});

			$window.on( 'jet-popup-close-trigger', function( event ) {
				var popupData   = event.popupData || {},
					popupUniqId = popupData.popupId,
					constantly  = popupData.constantly;

				if ( popupUniqId == popupId ) {
					self.hidePopup( {
						popupId: popupUniqId,
						constantly: constantly,
					} );
				}
			});

			$window.trigger( 'jet-popup/init-events/after', {
				self: self,
				settings: popupSettings
			} );
		};

		/**
		 * [initOnCloseEvent description]
		 * @return {[type]} [description]
		 */
		self.initOnCloseEvent = function() {

			var $htmlBody = $( 'html, body' );

			if ( 'scroll-to-top' === popupSettings['close-event'] ) {
				$htmlBody.animate( { scrollTop: 0 }, 'slow' );
			}

			if ( 'scroll-to-anchor' === popupSettings['close-event'] ) {
				var anchor = $( '#' + popupSettings['сlose-event-anchor'] );

				if ( anchor.length ) {
					$htmlBody.animate( { scrollTop: anchor.offset().top }, 'slow' );
				}
			}
		}

		/**
		 * [initCloseEvent description]
		 * @return {[type]} [description]
		 */
		self.initCloseEvent = function() {

			$popup.on( 'click', '.jet-popup__close-button', function( event ) {
				var target = event.currentTarget;

				self.hidePopup( {
					constantly: popupSettings['show-once'],
					popupId: popupSettings['jet-popup-id']
				} );
				self.initOnCloseEvent();
			} );

			if ( popupSettings['close-on-overlay-click'] ) {
				$popup.on( 'click', '.jet-popup__overlay', function( event ) {
					var target = event.currentTarget;

					self.hidePopup( {
						constantly: popupSettings['show-once'],
						popupId: popupSettings['jet-popup-id']
					} );
					self.initOnCloseEvent();
				} );
			}

			$document.on( 'keyup.jetPopup', function( event ) {
				var key = event.keyCode;

				if ( 27 === key && isOpen ) {
					self.hidePopup( {
						constantly: popupSettings['show-once'],
						popupId: popupSettings['jet-popup-id']
					} );
				}
			} );
		};

		/**
		 * [initCompatibilityHandler description]
		 * @return {[type]} [description]
		 */
		self.initCompatibilityHandler = function() {
			var $elementorProFormWidget = $( '.elementor-widget-form', $popup );

			if ( $elementorProFormWidget[0] ) {
				$elementorProFormWidget.each( function() {
					var $this = $( this ),
						$form = $( '.elementor-form', $this );

					$form.on( 'submit_success', function( data ) {

						setTimeout( function() {
							$window.trigger( {
								type: 'jet-popup-close-trigger',
								popupData: {
									popupId: popupId,
									constantly: false
								}
							} );
						}, 3000 );

					} );
				} );
			}
		};

		/**
		 * Page on load event
		 *
		 * @param  {int} openDelay Open delay time.
		 * @return {void}
		 */
		self.pageLoadEvent = function( openDelay ) {
			var delay = +openDelay || 0;

			delay = delay * 1000;

			$( function() {
				setTimeout( function() {
					self.showPopup();
				}, delay );
			} );
		};

		/**
		 * User Inactivity event
		 *
		 * @param  {int} inactiveDelay [description]
		 * @return {void}
		 */
		self.userInactiveEvent = function( inactiveDelay ) {
			var delay      = +inactiveDelay || 0,
				isInactive = true;

			delay = delay * 1000;

			setTimeout( function() {
				if ( isInactive ) {
					self.showPopup();
				}
			}, delay );

			$( document ).on( 'click focus resize keyup scroll', function() {
				isInactive = false;
			} );
		};

		/**
		 * Scrolling Page Event
		 *
		 * @param  {int} scrollingValue Scrolling porgress value
		 * @return {void}
		 */
		self.scrollPageEvent = function( scrollingValue ) {
			var scrolledValue  = +scrollingValue || 0;

			$window.on( 'scroll.cherryJetScrollEvent resize.cherryJetResizeEvent', function() {
				var $window          = $( window ),
					windowHeight     = $window.height(),
					documentHeight   = $( document ).height(),
					scrolledHeight   = documentHeight - windowHeight,
					scrolledProgress = Math.max( 0, Math.min( 1, $window.scrollTop() / scrolledHeight ) ) * 100;

				if ( scrolledProgress >= scrolledValue ) {
					$window.off( 'scroll.cherryJetScrollEvent resize.cherryJetResizeEvent' );
					self.showPopup();
				}
			} ).trigger( 'scroll.cherryJetResizeEvent' );
		};

		/**
		 * Viewport leave event
		 *
		 * @return {void}
		 */
		self.tryExitEvent = function() {
			var pageY = 0;

			$( document ).on( 'mouseleave', 'body', function( event ) {

				pageY = event.pageY - $window.scrollTop();

				if ( 0 > pageY && $popup.hasClass( 'jet-popup--hide-state' ) ) {
					self.showPopup();
				}
			} );
		};

		/**
		 * onDateEvent Event
		 *
		 * @return {void}
		 */
		self.onDateEvent = function( date ) {
			var nowDate   = Date.now(),
				startDate = Date.parse( date );

			if ( startDate < nowDate ) {

				setTimeout( function() {
					self.showPopup();
				}, 500 );
			}
		}

		self.onTimeEvent = function( startTime = '00:00', endTime = '23:59' ) {
			var startTime = '' !== startTime ? startTime : '00:00',
				endTime = '' !== endTime ? endTime : '23:59',
				nowTimeStamp = Date.now(),
				dateTimeFormat = new Intl.DateTimeFormat( 'en', { year: 'numeric', month: 'short', day: '2-digit' } ),
				[ { value: month },,{ value: day },,{ value: year } ] = dateTimeFormat.formatToParts( nowTimeStamp ),
				startTime = `${ month }. ${ day }, ${ year } ${ startTime }`,
				endTime = `${ month }. ${ day }, ${ year } ${ endTime }`,
				startTimeStamp = Date.parse( startTime ),
				endTimeStamp = Date.parse( endTime );

			if ( ( startTimeStamp < nowTimeStamp ) && ( nowTimeStamp < endTimeStamp ) ) {
				setTimeout( function() {
					self.showPopup();
				}, 500 );
			}
		}


		self.onTimeAndDateEvent = function( start, end ) {

			var nowDateStamp   = Date.now(),
			startDateStamp = Date.parse( start ),
			endDateStamp = Date.parse( end );

			if ( ( startDateStamp < nowDateStamp ) && ( nowDateStamp < endDateStamp ) ) {
				setTimeout( function() {
					self.showPopup();
				}, 500 );
			}
			
		}

		/**
		 * Check DOM Loaded Selector
		 * @param  {[type]} selector [description]
		 * @return {[type]}          [description]
		 */

		self.checkLoadedSelector = function( selector ) {

			//Check Listing Grid Lazy Load
			$( document ).on( 'jet-engine/listing-grid/after-lazy-load', function() {
				self.onCustomSelector ( selector );
			});

			//Check Open Mobile Menu
			$( '.jet-mobile-menu__toggle' ).closest( '.jet-mobile-menu__instance--slide-out-layout' ).on( 'click', function() {
				self.onCustomSelector ( selector );
			});

        }

		/**
		 * [onCustomSelector description]
		 * @param  {[type]} selector [description]
		 * @return {[type]}          [description]
		 */
		self.onCustomSelector = function( selector ) {

			let $selector = $( selector );

			if ( $selector[0] ) {
				$( 'body' ).on( 'click', selector, function( event ) {
					event.preventDefault();

					self.showPopup( $( this ).data( 'popup' ), $( this ) );
				} );
			} else {
				self.checkLoadedSelector( selector );
			}
		}

		/**
		 * Show Popup
		 *
		 * @return {void}
		 */
		self.showPopup = function( data, $trigger ) {
			var popupData              = data || {},
				animeOverlay           = null,
				animeContainer         = null,
				animeOverlaySettings   = jQuery.extend(
					{
						targets: $( '.jet-popup__overlay', $popup )[0]
					},
					self.avaliableEffects[ 'fade' ][ 'show' ]
				);

			$trigger = $trigger || false;

			if ( ! self.popupAvailableCheck() ) {
				return false;
			}

			animeOverlay = anime( animeOverlaySettings );

			$popup.toggleClass( 'jet-popup--hide-state jet-popup--show-state' );

			if ( popupSettings['prevent-scrolling'] ) {
				$( 'body' ).addClass( 'jet-popup-prevent-scroll' );
			}

			popupData = window.JetPlugins.hooks.applyFilters( 'jet-popup.show-popup.data', popupData, $popup, $trigger );

			self.showContainer( popupData );
		};

		/**
		 * [showContainer description]
		 * @return {[type]} [description]
		 */
		self.showContainer = function( data ) {
			var popupData        = data || {},
				popupDefaultData = {
					forceLoad: popupSettings['force-ajax'] || false, // Trigger Ajax Every Time
					customContent: '' // Show Popup with Custom Content
				},
				animeContainerInstance   = null,
				$popupContainer  = $( '.jet-popup__container', $popup ),
				$content         = $( '.jet-popup__container-content', $popup ),
				animeContainer   = jQuery.extend(
					{
						targets: $( '.jet-popup__container', $popup )[0],
						begin: function( anime ) {
							isAnimation = true;

							$window.trigger( 'jet-popup/show-event/before-show', {
								self: self,
								data: popupData,
								anime: anime
							} );
						},
						complete: function( anime ) {
							isAnimation = false;
							isOpen      = true;

							$window.trigger( 'jet-popup/show-event/after-show', {
								self: self,
								data: popupData,
								anime: anime
							} );
						}
					},
					self.avaliableEffects[ popupSettings['animation'] ][ 'show' ]
				);

			popupData = jQuery.extend( popupDefaultData, popupData );

			// init Custom popup content
			if ( '' !== popupData.customContent ) {
				$content.html( popupData.customContent );
				self.elementorFrontendInit();

				// Show Popup Container
				animeContainerInstance = anime( animeContainer );

				$window.trigger( 'jet-popup/render-content/render-custom-content', {
					self: self,
					popup_id: id,
					data: popupData,
				} );

				return false;
			}

			if ( ! popupSettings['use-ajax'] ) {
				// Show Popup Container
				animeContainerInstance = anime( animeContainer );

				$window.trigger( 'jet-popup/render-content/render-custom-content', {
					self: self,
					popup_id: id,
					data: popupData,
				} );

				return false;
			}

			if ( popupData.forceLoad ) {
				ajaxContentLoaded = false;
			}

			if ( ajaxContentLoaded ) {
				// Show Popup Container
				animeContainerInstance = anime( animeContainer );

				$window.trigger( 'jet-popup/render-content/show-content', {
					self: self,
					popup_id: id,
					data: popupData,
				} );

				return false;
			}

			popupData = jQuery.extend( popupData, {
				'popup_id': id,
				'page_url': window.location.href
			} );

			ajaxGetContentHanler = jQuery.ajax( {
				type: 'POST',
				url: window.jetPopupData.ajax_url,
				data: {
					'action': 'jet_popup_get_content',
					'data': popupData
				},
				beforeSend: function( jqXHR, ajaxSettings ) {

					if ( null !== ajaxGetContentHanler ) {
						ajaxGetContentHanler.abort();
					}

					// Before ajax send Trigger
					$window.trigger( 'jet-popup/render-content/ajax/before-send', {
						self: self,
						popup_id: id,
						data: popupData
					} );

					$popup.addClass( 'jet-popup--loading-state' );
				},
				error: function( jqXHR, ajaxSettings ) {},
				success: function( data, textStatus, jqXHR ) {
					var successType = data.type,
						contentData = data.content || false,
						$popupContainer = $( '.jet-popup__container-content', $popup );

					$popup.removeClass( 'jet-popup--loading-state' );

					if ( 'error' === successType ) {
						var message = data.message;

						$content.html( '<h3>' + message + '</h3>' );

						// Show Popup Container
						animeContainerInstance = anime( animeContainer );
					}

					if ( 'success' === successType ) {
						let popupContent         = contentData['content'],
							popupContentElements = contentData['contentElements'],
						    popupScripts         = contentData['scripts'],
						    popupStyles          = contentData['styles'],
							popupAfterScripts   = contentData['afterScripts'];

						for ( let { handle: scriptHandler, src: scriptSrc } of popupScripts ) {
							JetPopupFrontend.addedAssetsPromises.push( JetPopupFrontend.loadScriptAsync( scriptHandler, scriptSrc ) );
						}

						for ( let styleHandler in popupStyles ) {
							JetPopupFrontend.addedAssetsPromises.push( JetPopupFrontend.loadStyle( styleHandler, popupStyles[ styleHandler ] ) );
						}

						JetPopupFrontend.assetsLoaderPromise().then( async function( value ) {
							ajaxContentLoaded = true;

							// Ajax Success Trigger
							$window.trigger( 'jet-popup/render-content/ajax/success', {
								self: self,
								popup_id: id,
								data: popupData,
								request: data
							} );

							// Render content
							if ( popupContent ) {
								$popupContainer.html( popupContent );
							}

							if ( popupAfterScripts.length ) {
								await Promise.all( popupAfterScripts.map(
									( { handle, src } ) => JetPopupFrontend.loadScriptAsync( handle, src )
								) );
							}

							// Before ajax frontend init
							$( window ).trigger( 'jet-popup/ajax/frontend-init/before', {
								$container: $popupContainer,
								content: popupContent,
								contentElements: popupContentElements,
								contentType: popupSettings['content-type'],
							} );

							// Frontend init
							$( window ).trigger( 'jet-popup/ajax/frontend-init', {
								$container: $popupContainer,
								content: popupContent,
								contentElements: popupContentElements,
								contentType: popupSettings['content-type'],
							} );

							// after ajax frontend init
							$( window ).trigger( 'jet-popup/ajax/frontend-init/after', {
								$container: $popupContainer,
								content: popupContent,
								contentElements: popupContentElements,
								contentType: popupSettings['content-type'],
							} );

							// Show Popup Container
							animeContainerInstance = anime( animeContainer );

						}, function( reason ) {
							console.log( 'Assets Loaded Error' );
						} );
					}
				}
			} );
		};

		/**
		 * Hide Popup
		 *
		 * @return {void}
		 */
		self.hidePopup = function ( data ) {
			var popupData              = data || {},
				$content               = $( '.jet-popup__container-content', $popup ),
				constantly             = popupData.constantly || false,
				animeOverlay           = null,
				animeContainer         = null,
				animeOverlaySettings   = jQuery.extend( { targets: $( '.jet-popup__overlay', $popup )[0] }, self.avaliableEffects[ 'fade' ][ 'hide' ] ),
				animeContainerSettings = jQuery.extend(
					{
						targets: $( '.jet-popup__container', $popup )[0],
						begin: function( anime ) {
							isAnimation = true;

							$window.trigger( 'jet-popup/hide-event/before-hide', {
								self: self,
								data: popupData,
								anime: anime
							} );
						},
						complete: function( anime ) {
							isAnimation = false;
							isOpen = false;
							$popup.toggleClass( 'jet-popup--show-state jet-popup--hide-state' );

							if ( popupSettings['use-ajax'] && popupSettings['force-ajax'] ) {
								$content.html( '' );
							}

							if ( popupSettings['prevent-scrolling'] && !$( '.jet-popup--show-state' )[0] ) {
								$( 'body' ).removeClass( 'jet-popup-prevent-scroll' );
							}
							console.log(popupData)
							// After Popup Hide Action
							$window.trigger( 'jet-popup/hide-event/after-hide', {
								self: self,
								data: popupData,
								anime: anime
							} );
						}
					},
					self.avaliableEffects[ popupSettings['animation'] ][ 'hide' ]
				);

			if ( constantly ) {
				self.setLocalStorageData( popupId, 'disable' );
			}

			if ( isAnimation ){
				return false;
			}

			if ( $popup.hasClass('jet-popup--show-state') ) {
				animeOverlay = anime( animeOverlaySettings );
				animeContainer = anime( animeContainerSettings );
			}

			// On Hide Handler
			self.onHidePopupAction();

			// Before Popup Hide Action
			$window.trigger( 'jet-popup/close-hide-event/before-hide', {
				self: self,
				data: popupData
			} );
		};

		/**
		 * [elementorFrontendInit description]
		 * @return {[type]} [description]
		 */
		self.elementorFrontendInit = function() {
			var $content = $( '.jet-popup__container-content', $popup );

			$content.find( 'div[data-element_type]' ).each( function() {
				var $this       = $( this ),
					elementType = $this.data( 'element_type' );

				if (!elementType) {
					return;
				}

				try {
					if( 'widget' === elementType ){
						elementType = $this.data( 'widget_type' );
						window.elementorFrontend.hooks.doAction( 'frontend/element_ready/widget', $this, $ );
					}
					window.elementorFrontend.hooks.doAction( 'frontend/element_ready/' + elementType, $this, $ );

				} catch( err ) {
					console.log(err);

					$this.remove();

					return false;
				}

			});

			// On Show Handler
			self.onShowPopupAction();
		}

		/**
		 * [onShowPopupAction description]
		 * @return {[type]} [description]
		 */
		self.onShowPopupAction = function() {};

		/**
		 * [onHidePopupAction description]
		 * @return {[type]} [description]
		 */
		self.onHidePopupAction = function() {};

		/**
		 * Avaliable Effects
		 */
		self.avaliableEffects = {
			'fade' : {
				'show': {
					opacity: {
						value: [ 0, 1 ],
						duration: 600,
						easing: 'easeOutQuart',
					},
				},
				'hide': {
					easing: 'easeOutQuart',
					opacity: {
						value: [ 1, 0 ],
						easing: 'easeOutQuart',
						duration: 400,
					},
				}
			},

			'zoom-in' : {
				'show': {
					duration: 500,
					easing: 'easeOutQuart',
					opacity: {
						value: [ 0, 1 ],

					},
					scale: {
						value: [ 0.75, 1 ],
					}
				},
				'hide': {
					duration: 400,
					easing: 'easeOutQuart',
					opacity: {
						value: [ 1, 0 ],
					},
					scale: {
						value: [ 1, 0.75 ],
					}
				}
			},

			'zoom-out' : {
				'show': {
					duration: 500,
					easing: 'easeOutQuart',
					opacity: {
						value: [ 0, 1 ],

					},
					scale: {
						value: [ 1.25, 1 ],
					}
				},
				'hide': {
					duration: 400,
					easing: 'easeOutQuart',
					opacity: {
						value: [ 1, 0 ],
					},
					scale: {
						value: [ 1, 1.25 ],
					}
				}
			},

			'rotate' : {
				'show': {
					duration: 500,
					easing: 'easeOutQuart',
					opacity: {
						value: [ 0, 1 ],

					},
					scale: {
						value: [ 0.75, 1 ],
					},
					rotate: {
						value: [ -65, 0 ],
					}
				},
				'hide': {
					duration: 400,
					easing: 'easeOutQuart',
					opacity: {
						value: [ 1, 0 ],
					},
					scale: {
						value: [ 1, 0.9 ],
					},
				}
			},

			'move-up' : {
				'show': {
					duration: 500,
					easing: 'easeOutExpo',
					opacity: {
						value: [ 0, 1 ],

					},
					translateY: {
						value: [ 50, 1 ],
					}
				},
				'hide': {
					duration: 400,
					easing: 'easeOutQuart',
					opacity: {
						value: [ 1, 0 ],
					},
					translateY: {
						value: [ 1, 50 ],
					}
				}
			},

			'flip-x' : {
				'show': {
					duration: 500,
					easing: 'easeOutExpo',
					opacity: {
						value: [ 0, 1 ],

					},
					rotateX: {
						value: [ 65, 0 ],
					}
				},
				'hide': {
					duration: 400,
					easing: 'easeOutQuart',
					opacity: {
						value: [ 1, 0 ],
					}
				}
			},

			'flip-y' : {
				'show': {
					duration: 500,
					easing: 'easeOutExpo',
					opacity: {
						value: [ 0, 1 ],

					},
					rotateY: {
						value: [ 65, 0 ],
					}
				},
				'hide': {
					duration: 400,
					easing: 'easeOutQuart',
					opacity: {
						value: [ 1, 0 ],
					}
				}
			},

			'bounce-in' : {
				'show': {
					opacity: {
						value: [ 0, 1 ],
						duration: 500,
						easing: 'easeOutQuart',
					},
					scale: {
						value: [ 0.2, 1 ],
						duration: 800,
						elasticity: function(el, i, l) {
							return (400 + i * 200);
						},
					}
				},
				'hide': {
					duration: 400,
					easing: 'easeOutQuart',
					opacity: {
						value: [ 1, 0 ],
					},
					scale: {
						value: [ 1, 0.8 ],
					}
				}
			},

			'bounce-out' : {
				'show': {
					opacity: {
						value: [ 0, 1 ],
						duration: 500,
						easing: 'easeOutQuart',
					},
					scale: {
						value: [ 1.8, 1 ],
						duration: 800,
						elasticity: function(el, i, l) {
							return (400 + i * 200);
						},
					}
				},
				'hide': {
					duration: 400,
					easing: 'easeOutQuart',
					opacity: {
						value: [ 1, 0 ],
					},
					scale: {
						value: [ 1, 1.5 ],
					}
				}
			},

			'slide-in-up' : {
				'show': {
					opacity: {
						value: [ 0, 1 ],
						duration: 400,
						easing: 'easeOutQuart',
					},
					translateY: {
						value: ['100vh', 0],
						duration: 750,
						easing: 'easeOutQuart',
					}
				},
				'hide': {
					duration: 400,
					easing: 'easeInQuart',
					opacity: {
						value: [ 1, 0 ],
					},
					translateY: {
						value: [0,'100vh'],
					}
				}
			},

			'slide-in-right' : {
				'show': {
					opacity: {
						value: [ 0, 1 ],
						duration: 400,
						easing: 'easeOutQuart',
					},
					translateX: {
						value: ['100vw', 0],
						duration: 750,
						easing: 'easeOutQuart',
					}
				},
				'hide': {
					duration: 400,
					easing: 'easeInQuart',
					opacity: {
						value: [ 1, 0 ],
					},
					translateX: {
						value: [0,'100vw'],
					}
				}
			},

			'slide-in-down' : {
				'show': {
					opacity: {
						value: [ 0, 1 ],
						duration: 400,
						easing: 'easeOutQuart',
					},
					translateY: {
						value: ['-100vh', 0],
						duration: 750,
						easing: 'easeOutQuart',
					}
				},
				'hide': {
					duration: 400,
					easing: 'easeInQuart',
					opacity: {
						value: [ 1, 0 ],
					},
					translateY: {
						value: [0,'-100vh'],
					}
				}
			},

			'slide-in-left' : {
				'show': {
					opacity: {
						value: [ 0, 1 ],
						duration: 400,
						easing: 'easeOutQuart',
					},
					translateX: {
						value: ['-100vw', 0],
						duration: 750,
						easing: 'easeOutQuart',
					}
				},
				'hide': {
					duration: 400,
					easing: 'easeInQuart',
					opacity: {
						value: [ 1, 0 ],
					},
					translateX: {
						value: [0,'-100vw'],
					}
				}
			}

		};

		/**
		 * Get localStorage data.
		 *
		 * @return {object|boolean}
		 */
		self.getLocalStorageData = function() {

			try {
				return JSON.parse( localStorage.getItem( 'jetPopupData' ) );
			} catch ( e ) {
				return false;
			}
		};

		/**
		 * Set localStorage data.
		 *
		 * @return {object|boolean}
		 */
		self.setLocalStorageData = function( id, status ) {

			var jetPopupData = self.getLocalStorageData() || {},
				newData      = {};

			newData['status'] = status;

			if ( 'disable' === status ) {

				var nowDate             = Date.now(),
					showAgainDelay      = popupSettings['show-again-delay'],
					showAgainDate       = 'none' !== showAgainDelay ? ( nowDate + showAgainDelay ) : 'none';

				newData['show-again-date'] = showAgainDate;
			}

			jetPopupData[ id ] = newData;

			localStorage.setItem( 'jetPopupData', JSON.stringify( jetPopupData ) );
		}

	}

	window.JetPopupFrontend.init();

}( jQuery ) );