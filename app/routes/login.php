<?php 

if (session_status() == PHP_SESSION_NONE) {
    session_cache_limiter('nochace');
    session_start();
    $twig->addGlobal('session', $_SESSION);
}

$app->get('/', function() use($app){
	if(isset($_SESSION['logadoproposta'])){
		$app->redirect($app->urlFor('lista-propostas'));
	} else {
		$app->render('login.html');
	}
})->name('login'); 


$app->post('/', function() use ($app) {
	if(isset($_SESSION['logadoproposta'])){
		$app->redirect($app->urlFor('lista-propostas'));
	} else {
		$request = $app->request();
		$usuario = usuario::find_by_senha($request->post('toolpass'));

		if($usuario){
			$hoje    = new ActiveRecord\DateTime(date('Y-m-d H:i:s'));
			$dados   = array('data_ultimo_acesso'=>$hoje,'acessos'=>(++$usuario->acessos));
			$usuario->update_attributes($dados);

			$_SESSION['logadoproposta'] = true;

			$app->redirect($app->urlFor('lista-propostas'));
		} else {
			$app->render('login.html',['ERRO_LOGIN' => 1]);
		}
	}
});


$app->get('/fechasessao', function() use($app){
	if (session_status() != PHP_SESSION_NONE) session_destroy();
	$app->redirect($app->urlFor('login'));

})->setName('closesession'); 



 ?>