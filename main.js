$(function($){
	var SVGLoader = '<svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve"> <path fill="#fff" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"> <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 50 50" to="360 50 50" repeatCount="indefinite"></animateTransform> </path> </svg>';
	$.ajaxSetup({ cache: false });
	function PH__isEmpty(value){
		return !$.trim(value);
	}

	// # Ajax Handler
		var AjaxHandlerXHR = false, AjaxHandlerUniqueID;
		var RetryInterval;
		var LoadingMoreEmpty = false;
		function WPKingAjaxReq(data) {
			var AjaxHandlerUniqueIDCompare = btoa(unescape(encodeURIComponent(JSON.stringify(data.data))));
			if( AjaxHandlerXHR != false && AjaxHandlerUniqueIDCompare == AjaxHandlerUniqueID ) {
				AjaxHandlerXHR.abort();
			}
			data.error = function (jqXHR, exception) {
				var msg = '';
				if (jqXHR.status == 404) {
					msg = 'Ù„Ù… ÙŠØªÙ… Ø§Ù„Ø¹Ø«ÙˆØ± Ø¹Ù„Ù‰ Ø§Ù„ØµÙØ­Ø©.';
					AjaxHandlerXHR = false;
				} else if (jqXHR.status == 500) {
					msg = 'Ø­Ø¯Ø« Ø®Ø·Ø£ Ø§Ø«Ù†Ø§Ø¡ Ù…Ø¹Ø§ÙŠÙ†Ø© Ø§Ù„Ù…Ù„Ù.';
					AjaxHandlerXHR = false;
				} else if (exception === 'timeout') {
					msg = 'Ø¥Ù†ØªÙ‡Øª Ù…Ù‡Ù„Ø© Ø§Ù„Ø¥ØªØµØ§Ù„.';
					AjaxHandlerXHR = false;
				}
				if( msg != undefined && msg != '' ) {
					clearTimeout(RetryInterval);
					RetryInterval = setTimeout(WPKingAjaxReq(data), 2000);
				}
			}
			AjaxHandlerUniqueID = btoa(unescape(encodeURIComponent(JSON.stringify(data.data))));
			AjaxHandlerXHR = $.ajax(data).done(function(){
				clearTimeout(RetryInterval);
				AjaxHandlerXHR = false;
				WPKing_Init();
				InitSiteHealth();
			});
			return true;
		}

	// # Tooltips
		var UserOnpage = true;
		$(document).mouseleave(function () {
		    UserOnpage = false;
			$('body > title--tooltip').fadeOut(0);
		});
		$(document).mouseenter(function () {
		    UserOnpage = true;
		});
		var TooltipsTimeout;
		$('body').on("mouseover", function(e){
			var dropdown = $("[data-tooltip]");
		    if (!dropdown.is(e.target) && dropdown.has(e.target).length === 0) {
				clearTimeout(TooltipsTimeout);
				TooltipsTimeout = setTimeout(function(){
			        $('title--tooltip').fadeOut(0);
			    },100);
		    }
		});
		$('body').on("click", '[data-tooltip]', function(e){
			$('title--tooltip').remove();
		});
		$('body').on("mouseover", '[data-tooltip]', function(e){
			var event = e;
			var string = $(this).attr('data-tooltip'),
				TooltipElement = $('body > title--tooltip');
			leftorig = $(this).offset().left;
			calcul = $(this).outerWidth() / 2;
			var position = 'bottom';
			if( $(this).attr('data-position') != undefined ) {
				position = $(this).attr('data-position');
			}

			// Execute
			if( TooltipElement.length > 0 ) {
				TooltipElement.text(string);
				TooltipElement = $('body > title--tooltip');
				// Position
					LeftPosition = (leftorig + calcul - ((TooltipElement.outerWidth()) / 2));
					if( LeftPosition < 0 ) {
						LeftPosition = 16;
					}
					TopPosition = ($(this).offset().top + $(this).outerHeight(true) + 4) - $(window).scrollTop();
					if( $(this).attr('data-position') == 'top' ) {
						TopPosition = ($(this).offset().top - TooltipElement.outerHeight(true) - 4) - $(window).scrollTop();
					}
					TooltipElement.css("left", LeftPosition+'px');
					TooltipElement.css("top", TopPosition);
					TooltipElement.attr("class", '-position-'+position);
			}else {
				$('body').append('<title--tooltip class="-position-'+position+'">'+string+'</title--tooltip>');
				TooltipElement = $('body > title--tooltip');
				// Position
					LeftPosition = (leftorig + calcul - ((TooltipElement.outerWidth()) / 2));
					if( LeftPosition < 0 ) {
						LeftPosition = 16;
					}
					TopPosition = ($(this).offset().top + $(this).outerHeight(true) + 4) - $(window).scrollTop();
					if( $(this).attr('data-position') == 'top' ) {
						TopPosition = ($(this).offset().top - TooltipElement.outerHeight(true) - 4) - $(window).scrollTop();
					}
					TooltipElement.css("left", LeftPosition+'px');
					TooltipElement.css("top", TopPosition);
			}
			clearTimeout(TooltipsTimeout);
			TooltipsTimeout = setTimeout(function(){
				if( UserOnpage == true ) {
					$('body > title--tooltip').fadeIn(150);
				}
			},300);
		});
	
	//#Countdown
		var x = [];
		$('[countdown]').each(function(index, countdown__elem){
			var countDownDate = new Date($(countdown__elem).data("time")).getTime();

			var now = new Date().getTime();

			var distance = countDownDate - now;

			var days = Math.floor(distance / (1000 * 60 * 60 * 24));
			var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);

			var CountdownItem = '<div class="Days">';
				CountdownItem += '<strong>'+((days < 10) ? '0'+days : days)+'</strong>';
				CountdownItem += '<span>ÙŠÙˆÙ…</span>';
			CountdownItem += '</div>';
			CountdownItem += '<span>:</span>';
			CountdownItem += '<div class="Hours">';
				CountdownItem += '<strong>'+((hours < 10) ? '0'+hours : hours)+'</strong>';
				CountdownItem += '<span>Ø³Ø§Ø¹Ø©</span>';
			CountdownItem += '</div>';
			CountdownItem += '<span>:</span>';
			CountdownItem += '<div class="Minutes">';
				CountdownItem += '<strong>'+((minutes < 10) ? '0'+minutes : minutes)+'</strong>';
				CountdownItem += '<span>Ø¯Ù‚ÙŠÙ‚Ø©</span>';
			CountdownItem += '</div>';
			CountdownItem += '<span>:</span>';
			CountdownItem += '<div class="Seconds">';
				CountdownItem += '<strong>'+((seconds < 10) ? '0'+seconds : seconds)+'</strong>';
				CountdownItem += '<span>Ø«Ø§Ù†ÙŠØ©</span>';
			CountdownItem += '</div>';
			$(countdown__elem).html(CountdownItem);

			if (distance < 0) {
				clearInterval(x[index]);
				$(countdown__elem).closest('webinars--item').find('webinars--item-header .icon').after('<live_label>Ø¨Ø¯Ø£Øª</live_label>').remove();
				$(countdown__elem).closest('.single_webinar_countdown').remove();
				$(countdown__elem).remove();
			}
			x[index] = setInterval(function() {
				var countDownDate = new Date($(countdown__elem).data("time")).getTime();
				var now = new Date().getTime();

				var distance = countDownDate - now;

				var days = Math.floor(distance / (1000 * 60 * 60 * 24));
				var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
				var seconds = Math.floor((distance % (1000 * 60)) / 1000);

				var CountdownItem = '<div class="Days"'+((days > 0) ? '' : ' ended')+'>';
					CountdownItem += '<strong>'+((days < 10) ? '0'+days : days)+'</strong>';
					CountdownItem += '<span>ÙŠÙˆÙ…</span>';
				CountdownItem += '</div>';
				CountdownItem += '<span>:</span>';
				CountdownItem += '<div class="Hours"'+((hours > 0) ? '' : ' ended')+'>';
					CountdownItem += '<strong>'+((hours < 10) ? '0'+hours : hours)+'</strong>';
					CountdownItem += '<span>Ø³Ø§Ø¹Ø©</span>';
				CountdownItem += '</div>';
				CountdownItem += '<span>:</span>';
				CountdownItem += '<div class="Minutes">';
					CountdownItem += '<strong>'+((minutes < 10) ? '0'+minutes : minutes)+'</strong>';
					CountdownItem += '<span>Ø¯Ù‚ÙŠÙ‚Ø©</span>';
				CountdownItem += '</div>';
				CountdownItem += '<span>:</span>';
				CountdownItem += '<div class="Seconds">';
					CountdownItem += '<strong>'+((seconds < 10) ? '0'+seconds : seconds)+'</strong>';
					CountdownItem += '<span>Ø«Ø§Ù†ÙŠØ©</span>';
				CountdownItem += '</div>';
				$(countdown__elem).html(CountdownItem);

				if (distance < 0) {
					clearInterval(x[index]);
					$(countdown__elem).closest('webinars--item-header').find('.icon').after('<live_label>Ø¨Ø¯Ø£Øª</live_label>').remove();
					$(countdown__elem).closest('.single_webinar_countdown').remove();
					$(countdown__elem).remove();
				}
			}, 1000);
		});

	// # Hide Note
		function AutoFocus() {
			$("body").addClass("loaded");

			$('.-slides-carousel-triggered').owlCarousel({
				stopOnHover: true,
				smartSpeed: 200,
				items: 1,
				autoHeight:true,
				nav:true,
				mouseDrag: true,
				margin:20,
				animateOut: 'fadeOut',
				rtl: true,
				autoplayTimeout: 8000,
				autoplay:false,
				addClassActive: true,
				navText : ["<a class='Slides-next'><i class='fal fa-long-arrow-left'></i></a>","<a class='Slides-prev'><i class='fal fa-long-arrow-right'></i></a>"],
			});

			ScrollingTrig();
		}
		$("body").on("click", '.-root-note > strong > i', function(){
			$(this).closest('.-root-note').addClass("-hidden");
		});
		$(document).ready(AutoFocus);
		$(window).on("load", AutoFocus);
		var ScrollingTimeout;
		function ScrollingTrig() {
			if( $(window).scrollTop() > 80 ) {
				$("body").addClass('-stick-header');
			}
			if( $(window).scrollTop() < 80 ) {
				$("body").removeClass('-stick-header');
			}

			var Elem = false;
			$('root-body').each(function(index, section){
				if( $(window).scrollTop() >= ($(section).offset().top - 500) ) {
					Elem = $(section);
				}
			});
			$('root-header > .-container > .menu > ul > li').removeClass('-selected');
			if( Elem == false ) {
				$('root-header > .-container > .menu > ul > li > a[href="#"]').parent().addClass('-selected');
			}else {
				$('root-header > .-container > .menu > ul > li > a[href="#'+Elem.attr('id')+'"]').parent().addClass('-selected');
			}
		}
		$(window).on("scroll load click", ScrollingTrig);
		var DisableScrolling = false;
		$("body").on("click", 'root-header > .-container > .menu > ul > li > a', function(){
			var href = $(this).attr('href');
			if( href != '#' ) {
				$('body, html').animate({"scrollTop": ($("root-body"+$(this).attr("href")).offset().top - 100)}, 500);
			}else {
				$('body, html').animate({"scrollTop": 0}, 500);
			}
			return false;
		});
});
