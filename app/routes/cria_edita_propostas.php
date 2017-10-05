<?php 


$app->get('/', function() use($app){
	
	// $app->render('cria_edita_propostas.html',['cards'=>$cards]);
	$app->render('cria_edita_propostas.html');
})->name('home'); 



 ?>