<?php 

class propostas_periodo extends ActiveRecord\Model {
    static $belongs_to = array(
        array('proposta',       'foreign_key' => 'propostas_id',       'class_name' => 'proposta'),
        array('regra',          'foreign_key' => 'veiculos_regras_id', 'class_name' => 'veiculos_regra'),
    );
}