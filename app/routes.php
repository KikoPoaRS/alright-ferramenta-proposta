<?php 

require 'routes/login.php';
require 'routes/listagem_propostas.php';
require 'routes/cria_edita_propostas.php';
require 'routes/infos_base.php';
require 'routes/tabelas_veiculos.php';

function redir($url=''){
	echo'
	<script>
	window.location.href = "./'.$url.'";
	</script>
	';
}

 ?> 