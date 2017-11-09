<?php 


$app->get('/infos-base', function() use($app){
	if(isset($_SESSION['logadoproposta'])){
		$area = 'infos-base';
		$listaVeiculos      = array();
		$listaTiposCompras  = array();
		$listaClientes      = array();
		$listaAgencias      = array();

		$listaTabelasVeiculos = array();
		$listaTabelasVeiculos['produtos']     = array('tipo' => 'produtos', 'itemId' => 'PRODUTO');
		$listaTabelasVeiculos['segmentacoes'] = array('tipo' => 'segmentações', 'itemId' => 'SEGMENTO');
		$listaTabelasVeiculos['formatos']     = array('tipo' => 'formatos', 'itemId' => 'FORMATO');

		// gera dados de veículos
		$veiculos = veiculo::all();
		if(count($veiculos)>0){
			foreach($veiculos as $v){
				$veic_produtos     = veiculos_produto::find_by_veiculos_id($v->id);
				$veic_segmentacoes = veiculos_segmentacoe::find_by_veiculos_id($v->id);
				$veic_formatos     = veiculos_formato::find_by_veiculos_id($v->id);

				$arrv = array();

				$arrv['id']           = $v->id;
				$arrv['nome']         = $v->nome;
				$arrv['imagem']       = $v->img_logo_ativo;
				$arrv['produtos']     = $veic_produtos ? $veic_produtos->produtos : '';
				$arrv['segmentacoes'] = $veic_segmentacoes ? $veic_segmentacoes->segmentacoes : '';
				$arrv['formatos']     = $veic_formatos ? $veic_formatos->formatos : '';

				array_push($listaVeiculos,$arrv);
			}
		}

		// pega os tipos de compras
		$tiposCompras = tipos_compra::all();
		if(count($tiposCompras)>0){
			foreach($tiposCompras as $tc){
				$arrv = array();

				$arr['id']            = $tc->id;
				$arr['nome']          = $tc->nome;
				$arr['multiplicador'] = $tc->multiplicador;

				array_push($listaTiposCompras,$arr);
			}
		}

		// pega os clientes
		$clientes = cliente::all();
		if(count($clientes)>0){
			foreach($clientes as $a){
				$arrv = array();

				$arr['id']             = $a->id;
				$arr['nome']           = $a->nome;
				$arr['codigo_externo'] = $a->codigo_externo;

				array_push($listaClientes,$arr);
			}
		}

		// pega as agencias
		$agencias = agencia::all();
		if(count($agencias)>0){
			foreach($agencias as $a){
				$arrv = array();

				$arr['id']             = $a->id;
				$arr['nome']           = $a->nome;
				$arr['codigo_externo'] = $a->codigo_externo;

				array_push($listaAgencias,$arr);
			}
		}

		$app->render('infos_base.html',['area'                 => $area, 
										'listaVeiculos'        => $listaVeiculos,
										'listaTiposCompras'    => $listaTiposCompras,
										'listaClientes'        => $listaClientes,
										'listaAgencias'        => $listaAgencias,
										'listaTabelasVeiculos' => $listaTabelasVeiculos]);

	} else {
		redir();
	}
})->name('infos-base'); 



 ?>