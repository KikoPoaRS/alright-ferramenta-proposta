<?php 
include_once __DIR__."/../../vendor/php-activerecord/php-activerecord/ActiveRecord.php";
include_once "../../connection.php";
$cfg->set_model_directory(__DIR__.'/../../app/models');
$hoje = new ActiveRecord\DateTime(date('Y-m-d H:i:s'));