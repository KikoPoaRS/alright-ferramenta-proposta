<?php 

// GET
$app->get('/lista-propostas', function() use($app){
	if(isset($_SESSION['logadoproposta'])){
		$params = carregaPropostas($app);
		$app->render('lista_propostas.html',$params);
	} else {
		redir();
	}
})->name('lista-propostas'); 

// POST
$app->post('/lista-propostas', function() use ($app) {
	if(isset($_SESSION['logadoproposta'])){
		$request = $app->request(); 
		$params  = carregaPropostas($app,[$request->post('dataInit'),$request->post('dataFim')]);
		$app->render('lista_propostas.html',$params);
	} else {
		redir();
	}
}); 

///// FUNÇÕES DE SUPORTE ////////////////

function carregaPropostas ($app, $datas=null){
	$area = 'lista-propostas';
	$listaVeiculos  = array();
	$listaPropostas = array();
	$hoje           = new ActiveRecord\DateTime(date('Y-m-d H:i:s'));
	$dataFim        = $hoje;
	$dataInit       = new ActiveRecord\DateTime(date('Y-m-d 23:59:59', strtotime('-30 days', strtotime($hoje))));
	$dataFimSaida   = date('d/m/Y', strtotime($dataFim));
	$dataInitSaida  = date('d/m/Y', strtotime($dataInit));
	
	if($datas){
		$dataFimSaida  = $datas[1];
		$dataInitSaida = $datas[0];
		$DF = explode('/',$dataFimSaida);
		$DI = explode('/',$dataInitSaida);
		$dataFim       =  new ActiveRecord\DateTime(date($DF[2].'-'.$DF[1].'-'.$DF[0].' 23:59:59'));
		$dataInit      =  new ActiveRecord\DateTime(date($DI[2].'-'.$DI[1].'-'.$DI[0].' 23:59:59')); 
	}
	

	$veiculos = veiculo::all();
	if(count($veiculos)>0){
		foreach($veiculos as $v){
			$arrTmp = array();
			$arrTmp['id']    = $v->id;
			$arrTmp['nome']  = $v->nome;
			$arrTmp['cor']   = $v->cor;
			$arrTmp['thumb'] = $v->img_thumb;

			array_push($listaVeiculos,$arrTmp);
		}
	}
	
	$options = array();
	$options['order'] = 'data_atualizacao desc';
	$options['conditions'] = array('data_atualizacao >= ? AND data_atualizacao <= ?', $dataInit, $dataFim);	
	$propostas = proposta::all($options);

	if(count($propostas)>0){
		foreach($propostas as $p){
			$arrTmp = array();
			$arrTmp['id']           = $p->id;
			$arrTmp['criada']       = date('d/m/Y', strtotime($p->data_cadastro));
			$arrTmp['atualizada']   = date('d/m/Y - H:i', strtotime($p->data_atualizacao));
			$arrTmp['cliente']      = pegaCliente($p->cliente_id,$p->titulo);
			$arrTmp['investimento'] = number_format(pegaInvestimento($p->id), 2, ',', '.');
			$arrTmp['periodo']      = pegaPeriodo($p->id);
			$arrTmp['veiculos']     = pegaVeiculos($p->id,$listaVeiculos);
	
			array_push($listaPropostas,$arrTmp);
		}
	}

	return ['area'           => $area,
			'dataInit'       => $dataInitSaida, 
			'dataFim'        => $dataFimSaida,
			'listaVeiculos'  => $listaVeiculos, 
			'listaPropostas' => $listaPropostas];
}

function pegaCliente ($idc,$tit){
	$cliente = cliente::find_by_id($idc);
	$nomeCliente = '---';
	if($cliente) $nomeCliente = $cliente->nome;
	return '<strong>'.$nomeCliente.'</strong> - '.$tit;
}

function pegaInvestimento ($idp){
	$total = 0;
	$periodos = propostas_periodo::find_all_by_propostas_id($idp);
	if(count($periodos)>0) foreach($periodos as $p){ $total += $p->total_bruto;}
	return $total;
}

function pegaPeriodo ($idp){
	$periodoAntigo = propostas_periodo::find_all_by_propostas_id($idp, array('order' => 'data_inicio asc','limit' => 1));
	$periodoAtual  = propostas_periodo::find_all_by_propostas_id($idp, array('order' => 'data_fim desc',  'limit' => 1));
	$pMaisAntigo   = '';
	$pMaisAtual    = '';

	if(count($periodoAntigo)>0){
		foreach($periodoAntigo as $antigo){
			$pMaisAntigo = 	date('d/m/Y', strtotime($antigo->data_inicio));
		}
	}

	if(count($periodoAtual)>0){
		foreach($periodoAtual as $atual){
			$pMaisAtual = 	date('d/m/Y', strtotime($atual->data_fim));
		}
	}

	return $pMaisAntigo.' - '.$pMaisAtual;
}

function pegaVeiculos ($idp, $veics){
	$divsBox = '';

	foreach($veics as $v){
		$achou = propostas_periodo::find_by_propostas_id_and_veiculos_id($idp,$v['id']);
		if($achou){
			$divsBox .= '<div class="box-veiculo-tabela" style="background-color:'.$v['cor'].'" data-toggle="tooltip" data-placement="top" title="'.$v['nome'].'"></div>';
		}
	}

	return '<div class="Grid container-veiculos-tabela">'.$divsBox.'</div>';
}
