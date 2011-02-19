(function($){

 	$.fn.extend({ 
 		
		//pass the options variable to the function
 		validator: function(options) {


			//Set the default values, use comma to separate the settings, example:
			var defaults = {
				pattern : {
					// tel : /^((\+\d{1,3}? ?\d{1,3}? ?[\d\- \(\)]{5,15})|([\-\ \(\)\d]{6,20}))$/,
					tel : /^([ -\+\.\d\(\)ext]+){5,20}$/,
					email : /^(\w|\.|-)+?@(\w|-)+?\.\w{2,4}($|\.\w{2,4})$/,
					number : /^\d+$/,
					url : /(https?:\/\/)?(www\.)?([a-zA-Z0-9_%]*)\b\.[a-z]{2,4}(\.[a-z]{2})?((\/[a-zA-Z0-9_%]*)+)?(\.[a-z]*)?/,
					text : /./
				},
				classes : {
					valid		: 'valid',
					error		: 'error',
					placeholder	: 'placeholder'
				},
				errorMessageAttribute : 'error'
			}
				
			var options =  $.extend(defaults, options);

    		return this.each(function() {
				var o = options;
				var v = {};
				
				v.form			 = $(this);
				v.submitBtn 	 = $('[type=submit]', v.form);
				v.clearBtn		 = $('[type=reset]', v.form);
				v.requiredFields = $(':input[required=""],:input[required]', v.form);
				v.placeholders	 = $(':input[placeholder]', v.form);
				

				$.fn.isValid = function ( options ) {
					// cache selector
					var el = this;
					// find the corrent field type
					var	type = ( el[0].getAttribute('type') ? el[0].getAttribute('type') : 'text' );
					if ( type == 'textarea') { type = 'text' }; // IE7 bugfix which returns type of textarea not text

					// return true or false
					return ( o.pattern[type].test( el.val() ) && el.val() != el.attr('placeholder') && el.val() != "" ) ;
				};
				
				$.fn.classy = function ( options ) {
					var el = this;
					
					if ( options === false ) { 
						
						el.removeClass(o.classes.valid) 	// remove the valid class
						el.addClass(o.classes.error) 		// add the error class 
						
					} else if ( options === true ) {
						
						el.removeClass(o.classes.error) 	// remove the error class
						el.addClass(o.classes.valid);		// add the valid class
						
					}
					
					return this;
				}
				
				
				// Placeholder fallback
				v.placeholders.each(function() {
				
						if ( $(this).val() == "" ) {
							$(this).val( $(this).attr('placeholder') ).addClass( o.classes.placeholder );
						}
						
						$(this).bind('blur focus', function(e) {

							if ( e.type == "focus" && $(this).val() == $(this).attr('placeholder') ) { 
									$(this).val('').removeClass( o.classes.placeholder );
							} else if ( e.type == "blur" && $(this).val() == "" ) {
									$(this).val( $(this).attr('placeholder') ).addClass( o.classes.placeholder );
							}
							
						});
							
				});
				
				
				
				v.form.submit(function(e) {
					// e.preventDefault();
					
					// validation
					var valid = true,
						fields = v.requiredFields,
						placeholders = v.placeholders;
						
					$.each(fields, function(i, item) {
						
						// validation 2.0
						
						// run once on submit
						if ( $(item).isValid() ) {
							$(item).classy(true);
						} else {
							$(item).classy(false);
							errorMessage($(item));
							valid = false;
						}
						
						// after submitting once add live as-you-type validation
						$(item).bind('keyup focus blur', function(e) {
							
							// if there is a placeholder present do some magic
							if ( e.type == 'focus' && $(this).val() == this.getAttribute('placeholder') && $(this).attr('placeholder') !== undefined ) {
								
								$(this).val('').removeClass( o.classes.placeholder );
								
							} else if ( e.type == 'blur' && $(this).val() == "" && $(this).attr('placeholder') !== undefined ) {
								
								$(this).val( $(this).attr('placeholder') ).removeClass( o.classes.error ).addClass( o.classes.placeholder );
								
							}
							
							if ( e.type == 'keyup' ) { 
								 
								if ( $(this).isValid() ) {

									$(this).classy(true);
									errorMessage($(item));
								
								} else if ( $(this).val() != this.getAttribute('placeholder') )  {
								
									$(this).classy(false)
									errorMessage($(item));
									valid = false;

								}
							}
						});
						
					}); // $.each loop
					
					if ( !valid ) { 
						e.preventDefault(); 
					} // if any fields are not filled out but required stop submit

				}); // end submit
				
				
				
				function errorMessage(el) {
					var el = el,
						id = el[0].getAttribute('id');

					if ( el.data(o.errorMessageAttribute) !== undefined ) { // only run if there is a custom message
					
						if ( el.hasClass(o.classes.error) && $('label[for='+ id +']').find('.validationMessage').length != 1 )
						{
							$('label[for='+ id +']').removeClass(o.classes.valid).addClass(o.classes.error)
								.append('<span class=\"validationMessage\"></span>')
								.find('.validationMessage')
								.text('(' + el.data(o.errorMessageAttribute) + ')');
						}
						else if ( el.hasClass(o.classes.valid) )
						{
							$('label[for='+ id +']', v.form).removeClass(o.classes.error).addClass(o.classes.valid)
								.find('.validationMessage')
								.remove();
						}
					}
				} // end errorMessage 
				
				// clear all classes and remove validation error messages when clearing the form.
				v.clearBtn.click(function() {
					$('input,label,textarea', v.form).removeClass(o.classes.error +' '+ o.classes.valid);
					$('.validationMessage', v.form).remove();
				});
					
    		});
    	}
	});
	
})(jQuery);