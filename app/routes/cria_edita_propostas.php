<?php 


$app->get('/edita-proposta', function() use($app){
	$area = 'lista-propostas';
	$app->render('cria_edita_propostas.html',['area'=>$area]);
})->name('edita-proposta'); 



 ?>