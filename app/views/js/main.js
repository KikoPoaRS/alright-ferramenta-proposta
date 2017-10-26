
/**
 * Resize function without multiple trigger
 * 
 * Usage:
 * $(window).smartresize(function(){  
 *     // code here
 * });
 */
(function($,sr){
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
      var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args); 
                timeout = null; 
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100); 
        };
    };

    // smartresize 
    jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');
/**
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
    $BODY = $('body'),
    $MENU_TOGGLE = $('#menu_toggle'),
    $SIDEBAR_MENU = $('#sidebar-menu'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $RIGHT_COL = $('.right_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer'),
    $LOGO_AR = $('#logo-ar');



	
	
// Sidebar
function init_sidebar() {
    // TODO: This is some kind of easy fix, maybe we can improve this
    var setContentHeight = function () {
        // reset height
        $RIGHT_COL.css('min-height', $(window).height());

        var bodyHeight = $BODY.outerHeight(),
            footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
            leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
            contentHeight = '100%';//bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

        // normalize content
        contentHeight -= $NAV_MENU.height() + footerHeight;

        $RIGHT_COL.css('min-height', contentHeight);
    };

  $SIDEBAR_MENU.find('a').on('click', function(ev) {
	  console.log('clicked - sidebar_menu');
        var $li = $(this).parent();

        if ($li.is('.active')) {
            $li.removeClass('active active-sm');
            $('ul:first', $li).slideUp(function() {
                setContentHeight();
            });
        } else {
            // prevent closing menu if we are on child menu
            if (!$li.parent().is('.child_menu')) {
                $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                $SIDEBAR_MENU.find('li ul').slideUp();
            }else
            {
				if ( $BODY.is( ".nav-sm" ) )
				{
					$SIDEBAR_MENU.find( "li" ).removeClass( "active active-sm" );
					$SIDEBAR_MENU.find( "li ul" ).slideUp();
				}
			}
            $li.addClass('active');

            $('ul:first', $li).slideDown(function() {
                setContentHeight();
            });
        }
    });

// toggle small or large menu 
$MENU_TOGGLE.on('click', function() {
		console.log('clicked - menu toggle');
		
		if ($BODY.hasClass('nav-md')) {
			$SIDEBAR_MENU.find('li.active ul').hide();
            $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
            $LOGO_AR.attr('src',__BASEHTML__ +'imgs/logo-alright-menor.png');
		} else {
			$SIDEBAR_MENU.find('li.active-sm ul').show();
            $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
            $LOGO_AR.attr('src',__BASEHTML__ +'imgs/logo-alright.png');
		}

	$BODY.toggleClass('nav-md nav-sm');

	setContentHeight();
});

	// check active menu
	$SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

	$SIDEBAR_MENU.find('a').filter(function () {
		return this.href == CURRENT_URL;
	}).parent('li').addClass('current-page').parents('ul').slideDown(function() {
		setContentHeight();
	}).parent().addClass('active');

	// recompute content when resizing
	$(window).smartresize(function(){  
		setContentHeight();
	});

	setContentHeight();

	// fixed sidebar
	if ($.fn.mCustomScrollbar) {
		$('.menu_fixed').mCustomScrollbar({
			autoHideScrollbar: true,
			theme: 'minimal',
			mouseWheel:{ preventDefault: true }
		});
	}
};

// /Sidebar
var randNum = function() {
    return (Math.floor(Math.random() * (1 + 40 - 20))) + 20;
};


// Panel toolbox
$(document).ready(function() {
    ativaColapsedPanel();

    $('.close-link').click(function () {
        var $BOX_PANEL = $(this).closest('.x_panel');

        $BOX_PANEL.remove();
    });
});
// /Panel toolbox

function ativaColapsedPanel(elm = '.collapse-link'){
    $(elm).on('click', function() {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');
        
        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function(){
                // $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(200); 
            $BOX_PANEL.css('height', 'auto');  
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.collapsed').css('height', 'auto');
    $('.collapsed').find('.x_content').css('display', 'none');
    $('.collapsed').find('i').toggleClass('fa-chevron-up fa-chevron-down');
}


function callModalMenor(tit, message, functionOk, functionFechar){
    $('#titulo-modal-menor').empty();
    $('#titulo-modal-menor').append(tit);

    $('#corpo-modal-menor').empty();
    $('#corpo-modal-menor').append(message);

    $('#modal-menor').modal('show');

    $('#bt-modal-menor-ok').click(function(){
        $('#modal-menor').modal('hide');
        if(functionOk) $('#bt-modal-menor-ok').unbind( "click", functionOk );
    });

    $('#bt-modal-menor-fechar').click(function(){
        $('#modal-menor').modal('hide');
        if(functionOk) $('#bt-modal-menor-fechar').unbind( "click", functionFechar );
    });

    if(functionOk){
        $('#bt-modal-menor-ok').show();
        $('#bt-modal-menor-ok').click(functionOk);
    } else {
        $('#bt-modal-menor-ok').hide();
    }

    if(functionFechar) $('#bt-modal-menor-fechar').click(functionFechar);
   
}


// INICIALIZA COMPONENTES
$(document).ready(function() {
    init_sidebar();

    // inicializa tooltip
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });
    
});


function formataDado (dado, formato = 'R$', reverse = false){
    /**
     * dado: conteúdo a ser formatado
     * reverse: "desformata" o dado, tornando ele compatível ao cálculo
     * Tipo de formatoa aplciado ao dado
     */
    var saida = dado;
   
    if(formato == 'int'){
        var p = String(dado);
        var conta = 0;
        var final = '';
        
        for(var i=p.length-1; i>=0; i--){
            if(++conta == 4 ){
                conta = 1;
                final = p.charAt(i)+'.'+final;
            } else {
                final = p.charAt(i)+final;
            }
        }
        saida = final;
    }

    if(formato == 'R$'){
        if(dado == '' || dado == undefined || dado == null || dado == 0){
            saida = reverse ? '0.0' : '0,00';

        } else {
            if(String(dado).length<3) return dado+',00';

            var nros  = String(dado).split(reverse ? ',' : '.');
            var pre   = '';
            var pos   = '00';
            var saida = '';
            
            var sm = '.';
            var sf = reverse ? '.' : ',';
            
            if(String(nros[0]).length<4){
                pre = nros[0];    
            } else {
                if(reverse){
                    pre = String(nros[0]).replace(/\./g, '');
                } else {
                     if(String(nros[0]).indexOf(",") >= 0){
                        pre = String(nros[0]).replace(/,/g, ".");
                    } else {
                        var p     = String(nros[0]);
                        var conta = 0;
                        var final = '';
                        
                        for(var i=p.length-1; i>=0; i--){
                            final = p.charAt(i)+final;
                            
                            if(++conta == 3){
                                conta = 0;
                                final = sm+final;
                            }
                        }
                        pre = final;
                    }
                }
            }
            
            if(nros[1]){
                pos = nros[1];
                if(String(nros[1]).length == 1) pos += "0";
            } else {
                pos = '00';
            }
            
            saida = pre+sf+pos;
        }
    }

    return saida;
}
