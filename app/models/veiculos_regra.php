<?php 

class veiculos_regra extends ActiveRecord\Model {
    static $has_many = array(
        array('propostas_periodos', 'class_name' => 'propostas_periodo')
     );
}