<?php 

$cfg = ActiveRecord\Config::instance();
$cfg->set_model_directory('app/models');
// $cfg->set_connections(array('development' => 'mysql://bitfa068_admin:admin@localhost/bitfa068_projetos;charset=utf8'));
$cfg->set_connections(array('development' => 'mysql://root:12345@localhost/bitfans;charset=utf8'));


ActiveRecord\Connection::$datetime_format = 'Y-m-d H:i:s';