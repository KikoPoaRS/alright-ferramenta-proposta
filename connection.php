<?php 
date_default_timezone_set('America/Sao_Paulo');

$cfg = ActiveRecord\Config::instance();
$cfg->set_model_directory('app/models');
// $cfg->set_connections(array('development' => 'mysql://bitfa068_admin:admin@localhost/bitfa068_projetos;charset=utf8'));
//$cfg->set_connections(array('development' => 'mysql://alrig018_bdprop:hUoYSd1hx9@localhost/alrig018_propostas;charset=utf8'));
 $cfg->set_connections(array('development' => 'mysql://root:12345@localhost/alright;charset=utf8'));


ActiveRecord\Connection::$datetime_format = 'Y-m-d H:i:s';