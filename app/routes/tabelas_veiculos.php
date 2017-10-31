<?php 


$app->get('/tabelas-veiculos', function() use($app){

	$area = 'tabelas-veiculos';
	
	$listaTiposCompras  = array();
	$listaVeiculos      = array();
	$listaTiposCompras  = array();
	$listaClientes      = array();
	$listaAgencias      = array();

	$selectsCompras = '';

	$tiposCompras = tipos_compra::all();
	if(count($tiposCompras)>0){
		foreach($tiposCompras as $tc){
			$tipo = array();
			$tipo['nome'] = $tc->nome;
			$tipo['multiplicador'] = $tc->multiplicador;
			array_push($listaTiposCompras,$tipo);
		}

		$selectsCompras = montaSelectCompras($listaTiposCompras);
	}

	$veiculos = veiculo::all();
	if(count($veiculos)>0){
		foreach($veiculos as $v){
			$veic_produtos     = veiculos_produto::find_by_veiculos_id($v->id);
			$veic_segmentacoes = veiculos_segmentacoe::find_by_veiculos_id($v->id);
			$veic_formatos     = veiculos_formato::find_by_veiculos_id($v->id);
			$veic_regras       = veiculos_regra::find_all_by_veiculos_id($v->id);

			$arrv = array();

			$arrv['id']           = $v->id;
			$arrv['nome']         = $v->nome;
			$arrv['imagem']       = $v->img_logo_ativo;
			$arrv['cor']          = $v->cor;

			$arrv['produtos']     = $veic_produtos ? montaSelects($veic_produtos->produtos) : '<option>Item sem registro</option>';
			$arrv['segmentacoes'] = $veic_segmentacoes ? montaSelects($veic_segmentacoes->segmentacoes) : '<option>Item sem registro</option>';
			$arrv['formatos']     = $veic_formatos ? montaSelects($veic_formatos->formatos) : '<option>Item sem registro</option>';
			// $arrv['compras']      = $listaTiposCompras ? montaSelectCompras($listaTiposCompras) : '<option>Item sem registro</option>';

			$arrv['listaRegras']  = count($veic_regras)>0 ? montaListaRegras($veic_regras, 
																			 $veic_produtos->produtos, 
																			 $veic_segmentacoes->segmentacoes, 
																			 $veic_formatos->formatos,
																			 $listaTiposCompras) : null;

			array_push($listaVeiculos,$arrv);

			// echo $v->id.' : '.$v->nome.'<br>';
			// echo 'REGRAS:<br>*************<br>';
			// echo '<pre>';print_r($arrv['listaRegras']);echo'</pre><br><br>';
		}
	}
	
	$app->render('tabelas_veiculos.html',['area'=>$area, 'listaVeiculos'=>$listaVeiculos, 'selectsCompras'=>$selectsCompras]);
	
})->name('tabelas-veiculos'); 





/// FUNÇÕES DE SUPORTE ///////////////////

function montaSelects($str,$atual=null){
	$itens = explode(',',$str);
	$strFn = '<option>---</option>';
	$achou = false;
	
	foreach($itens as $it){
		$opt = ltrim(rtrim($it));
		$selected =  '';

		if($opt == $atual){ $selected = 'selected'; $achou = true; }
		
		$strFn .= '<option value="'.$opt.'" '.$selected.'>'.$opt.'</option>';
	}

	if($atual != null && !$achou) $strFn .= '<option value="'.$atual.'" selected>'.$atual.'</option>';

	return $strFn;
}


function montaSelectCompras($arr,$nomeAtual=null,$valorAtual=null){
	$strFn = '<option>---</option>';
	$achou = false;
	
	foreach($arr as $it){
		$nome  = ltrim(rtrim($it['nome']));
		$valor = $it['multiplicador'];
		$selected =  '';

		if($nome == $nomeAtual){ $selected = 'selected'; $achou = true; }
		
		$strFn .= '<option value="'.$valor.'" '.$selected.'>'.$nome.'</option>';
	}

	if($nomeAtual != null && !$achou) $strFn .= '<option value="'.$valorAtual.'" selected>'.$nomeAtual.'</option>';

	return $strFn;
}


function montaListaRegras($regras,$produtos,$segmentacoes,$formatos, $compras){
	$listaFinal = array();

	foreach($regras as $r){
		$dados = array();
		$dados['id']                   = $r->id;
		$dados['produto']              = montaSelects($produtos,$r->produto);
		$dados['segmentacao']          = montaSelects($segmentacoes,$r->segmentacao);
		$dados['formato']              = montaSelects($formatos,$r->formato);
		$dados['invest_minimo']        = $r->investimento_minimo;
		$dados['compra']               = montaSelectCompras($compras,$r->tipo_compra_nome,$r->tipo_compra_multiplicador);
		$dados['cub']                  = $r->custo_unit_bruto;
		$dados['desconto_max']         = $r->desconto_max;

		array_push($listaFinal,$dados);
	}

	return $listaFinal;
}


