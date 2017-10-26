<?php 


$app->get('/lista-propostas', function() use($app){

	if(isset($_SESSION['logadoproposta'])){
		$area = 'lista-propostas';
		$listaVeiculos = array();

		$listaVeiculos = [
			['nome'=>'SmartClip',   'thumb'=>'th-smartclip.jpg'],
			['nome'=>'Outbrain',    'thumb'=>'th-outbrain.jpg'],
			['nome'=>'YouTube',     'thumb'=>'th-youtube.jpg'],
			['nome'=>'TradeLab',    'thumb'=>'th-tradelab.jpg'],
			['nome'=>'Facebook',    'thumb'=>'th-facebook.jpg'],
			['nome'=>'Alright',     'thumb'=>'th-alright.jpg'],
			['nome'=>'Google',      'thumb'=>'th-google.jpg'],
			['nome'=>'Waze',        'thumb'=>'th-waze.jpg'],
			['nome'=>'SuperPlayer', 'thumb'=>'th-superplayer.jpg'],
			['nome'=>'Audioad',     'thumb'=>'th-audioad.jpg'],
			['nome'=>'ModaIt',      'thumb'=>'th-modait.jpg'],
			['nome'=>'Buscapé',     'thumb'=>'th-buscape.jpg']
		];

		$app->render('lista_propostas.html',['area'=>$area, 'listaVeiculos'=>$listaVeiculos]);


	} else {
		$app->redirect($app->urlFor('login'));
	}


	
})->name('lista-propostas'); 


 ?>