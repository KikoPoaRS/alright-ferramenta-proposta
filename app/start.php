<?php 

// date_default_timezone_set('America/Sao_Paulo');
	
// este arquivo é inserido no index.php (require) que está no diretório raiz.
// Por este motivo os caminhos definidos neste arquivo devem estar
// setados a partir do arquivo requisitante
require 'vendor/autoload.php';
require_once 'vendor/php-activerecord/php-activerecord/ActiveRecord.php';
require 'connection.php';

$app = new \Slim\Slim([
	'view' => new \Slim\Views\Twig() // inicializa a variável 'views' para usar o Twig como render
]);

// configura a página 404
$app->notFound(function () use ($app) { 
    $view = $app->view(); 
    $view->setTemplatesDirectory('app/views'); 
    $app->render('404.html'); 
});

// Define o diretório de templates
$view = $app->view();
$view->setTemplatesDirectory('app/views');

// ativa o Twig como renderizador de páginas
$view->parserExtensions = [new \Slim\Views\TwigExtension()];

/****************************************/
// TESTE DE RECURSOS DO TWIG - setagem para uso de filtros
$twig = $app->view->getInstance();

// exemplo de definição de filtro
/*
$filtroMD5 = new Twig_SimpleFilter( 'md5', function ( $string ) { 
    return md5( $string );
}); 
// aplica filtro
$twig->addFilter($filtroMD5);
*/
/****************************************/

// carrega o arquivo de rotas
require 'routes.php';
$app->run();