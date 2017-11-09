<?php 


$app->get('/edita-proposta(/:idp)', function($idp=0) use($app){

	if(isset($_SESSION['logadoproposta'])){
		$area = 'lista-propostas';

		$selectAgencias = '<option>---</option>';
		$selectClientes = '<option>---</option>';
		$listaVeiculos  = array();

		$IDProposta = $idp;
		$MsgErro    = '';
		$tituloProposta   = '';
		$agenciaProposta  = 0;
		$clienteProposta  = 0;
		$contatoProposta  = '';
		$descontoProposta = '';

		$agencias = agencia::all();
		$clientes = cliente::all();
		$veiculos = veiculo::all();

		if($idp != 0){
			$proposta = proposta::find_by_id($idp);

			if($proposta){
				$tituloProposta   = $proposta->titulo;
				$agenciaProposta  = $proposta->agencia_id;
				$clienteProposta  = $proposta->cliente_id;
				$contatoProposta  = $proposta->contato;
				$descontoProposta = $proposta->desconto_cliente;
			} else {
				$IDProposta = 0;
				$MsgErro = 'msgErrProp('.$idp.');';
			}
		}


		if(count($agencias)>0){
			foreach($agencias as $it){
				$selected = ($it->id == $agenciaProposta) ? 'selected' : '';
				$selectAgencias .= '<option value="'.$it->id.'" '.$selected.'>'.$it->nome.'</option>';
			}
		}


		if(count($clientes)>0){
			foreach($clientes as $it){
				$selected = ($it->id == $clienteProposta) ? 'selected' : '';
				$selectClientes .= '<option value="'.$it->id.'" '.$selected.'>'.$it->nome.'</option>';
			}
		}

		if(count($veiculos)>0){
			foreach($veiculos as $v){
				$dados = array();
				$dados['regras'] = pegaRegrasVeiculo($v->id);

				if($dados['regras']){
					$dados['id']           = $v->id;
					$dados['logo_ativo']   = $v->img_logo_ativo;
					$dados['logo_inativo'] = $v->img_logo_inativo;
					$dados['nome']         = $v->nome;
					$dados['cor']          = $v->cor;

					$regraAtiva = null;
					if($idp != 0) $regraAtiva = propostas_periodo::find_by_propostas_id_and_veiculos_id($idp,$v->id);
					$dados['status'] = $regraAtiva ? 1 : 0;

					array_push($listaVeiculos,$dados);
				}
			}
		}

		$app->render('cria_edita_propostas.html',['area'             => $area, 
												'listaVeiculos'    => $listaVeiculos, 
												'IDProposta'       => $IDProposta, 
												'selectAgencias'   => $selectAgencias,
												'selectClientes'   => $selectClientes,
												'tituloProposta'   => $tituloProposta,
												'contatoProposta'  => $contatoProposta,
												'descontoProposta' => $descontoProposta,
												'MsgErro'          => $MsgErro ]);
	} else {

		$n = $idp==0 ? '': '.';
		redir('',$n);
	}

	
})->name('edita-proposta'); 




function pegaRegrasVeiculo($idv){
	$regras       = veiculos_regra::find_all_by_veiculos_id($idv,array('order' => 'produto, segmentacao asc'));
	$produtos     = veiculos_produto::find_by_veiculos_id($idv);
	$segmentacoes = veiculos_segmentacoe::find_by_veiculos_id($idv);
	$formatos     = veiculos_formato::find_by_veiculos_id($idv);

	$listaProdutos = explode(',',$produtos->produtos);
	$listaSegments = explode(',',$segmentacoes->segmentacoes);
	$listaFormatos = explode(',',$formatos->formatos);
	
	$saida = array();
	$produtoAnterior  = '';
	$segmentoAnterior = '';
	$formatoAnterior  = '';

	$arrSegmentos = array();
	$arrFormatos = array();

	if(count($regras)>0){
		foreach($regras as $r){
			$arrFtmp = array();
			$arrFtmp['id']           = $r->id;
			$arrFtmp['nome']         = $r->formato;
			$arrFtmp['descontoMax']  = $r->desconto_max;
			$arrFtmp['investMinimo'] = $r->investimento_minimo;
			$arrFtmp['tipoCompra']   = [$r->tipo_compra_nome,(int)$r->tipo_compra_multiplicador];
			$arrFtmp['CUB']          = $r->custo_unit_bruto;

			$repeteProduto  = $r->produto == $produtoAnterior;
			$repeteSegmento = $r->segmentacao == $segmentoAnterior;
			$repeteFormato  = $r->formato == $formatoAnterior;

			if($repeteProduto && $repeteSegmento){
				array_push($arrFormatos,$arrFtmp);

				$arrSegmentos[ count( $arrSegmentos ) - 1 ]['formatos'] = $arrFormatos;
				$saida[ count( $saida ) - 1 ]['segmentacoes'] = $arrSegmentos;

			} else if($repeteProduto){
				
				$arrFormatos = array();

				array_push($arrFormatos,$arrFtmp);
				
				$arrStmp = array();
				$arrStmp['nome'] = $r->segmentacao;
				$arrStmp['formatos'] = $arrFormatos;

				array_push($arrSegmentos,$arrStmp);

				$saida[ count( $saida ) - 1 ]['segmentacoes'] = $arrSegmentos;

			} else {
				$arrSegmentos = array();
				$arrFormatos = array();

				array_push($arrFormatos,$arrFtmp);
				
				$arrStmp = array();
				$arrStmp['nome'] = $r->segmentacao;
				$arrStmp['formatos'] = $arrFormatos;

				array_push($arrSegmentos,$arrStmp);

				$arrPtmp = array();
				$arrPtmp['nome'] = $r->produto;
				$arrPtmp['segmentacoes'] = $arrSegmentos;

				array_push($saida,$arrPtmp);
			}

			$produtoAnterior  = $r->produto;
			$segmentoAnterior = $r->segmentacao;
			$formatoAnterior  = $r->formato;

		}

// echo'<pre>';echo json_encode($saida); echo '</pre>';die;		
		return json_encode($saida);

	} else {return false;}
}
