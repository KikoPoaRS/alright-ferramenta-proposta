<?php 
include_once "connections.php";

$saida     = array();
$CRIAR     =  1;
$ATUALIZAR =  0;
$EXCLUIR   = -1;

$erros = array();
$erros['naoexiste'] = 'Operação não realizada - o registro da proposta não foi encontrado.';
$erros['dados_insuficientes'] = 'Operação não realizada - dados enviados insuficientes.';
$erros['operacao_nao_definida'] = 'Execução não definida.';


if(isset($_POST['IDProposta'])){
    $saida['IDProposta'] = $_POST['IDProposta'];
    
    
    if(isset($_POST['operacao'])){ // OPERAÇÃO COMPLETA - CABEÇALHO E DADOS DE VEÍCULOS
        $saida['operacao'] = $_POST['operacao'];
        
        $dados = array();

        if($_POST['operacao'] != $EXCLUIR){
            // CABEÇALHO DA PROPOSTA
            $dados['data_atualizacao'] = $hoje;
            $dados['titulo']           = $_POST['titulo'];
            $dados['agencia_id']       = (int)$_POST['agencia'];
            $dados['cliente_id']       = (int)$_POST['cliente'];
            $dados['contato']          = $_POST['contato'];
            $dados['desconto_cliente'] = $_POST['desconto'];

            if($_POST['IDProposta'] == 0){ // CRIAR
                // salva dados do cabecalho da proposta
                ////////////////////////////////////////////
                $dados['data_cadastro'] = $hoje;          //
                $PROPOSTA = proposta::create($dados);     //
                $PROPOSTA->save();                        //
                ////////////////////////////////////////////

                $saida['IDProposta'] = $PROPOSTA->id;
            } else { // ATUALIZAR
                $PROPOSTA = proposta::find_by_id($_POST['IDProposta']);

                if($PROPOSTA){
                    // atualiza dados do cabeçalho da proposta
                    ////////////////////////////////////////////
                    $PROPOSTA->update_attributes($dados);     //
                    ////////////////////////////////////////////

                    // salva/atualiza dados dos períodos
                    if(isset($_POST['periodos']) && count($_POST['periodos'])>0){
                        $pSalvos = array();

                        foreach($_POST['periodos'] as $p){

                            $dadosP = array(); 
                            $dadosP['propostas_id']       = $p['idProposta'];
                            $dadosP['veiculos_id']        = $p['idVeiculo'];
                            $dadosP['veiculos_regras_id'] = $p['idRegra'];
                            $dadosP['grupo']              = $p['grupo'];
                            $dadosP['target']             = $p['target'];
                            $dadosP['praca']              = $p['praca'];
                            $dadosP['data_inicio']        = new ActiveRecord\DateTime($p['dataInit']);
                            $dadosP['data_fim']           = new ActiveRecord\DateTime($p['dataFim']);
                            $dadosP['total_bruto']        = $p['totalBruto'];
                            $dadosP['total_liquido']      = $p['totalLiquido'];
                            $dadosP['desconto_linha']     = $p['desconto'];
                            $dadosP['linha']              = $p['linha'];

                            if($p['idPeriodo'] == 0){
                                // cria registro do período
                                //////////////////////////////////////////////////////
                                $PERIODO = propostas_periodo::create($dadosP);     //
                                $PERIODO->save();                                   //
                                //////////////////////////////////////////////////////
                                $dps = array();
                                $dps['idPeriodo'] = $PERIODO->id;
                                $dps['idVeiculo'] = $p['idVeiculo'];
                                $dps['idRegra']   = $p['idRegra'];
                                $dps['grupo']     = $p['grupo'];
                                $dps['linha']     = $p['linha'];

                                array_push($pSalvos,$dps);
                            } else {

                                $PERIODO = propostas_periodo::find_by_id($p['idPeriodo']); 

                                if($PERIODO){
                                    // atualiza registro do período
                                    /////////////////////////////////////////////////////////////
                                    $PERIODO->update_attributes($dadosP);                      //
                                    /////////////////////////////////////////////////////////////
                                } else {
                                    // idPeriodo-idVeiculo-idRegra-grupo-linha
                                    $saida['erro_periodos'] = 'ATENÇÃO : Erro ao tentar salvar período ('.$p['idPeriodo'].'-'.$p['idVeiculo'].'-'.$p['idRegra'].'-'.$p['grupo'].'-'.$p['linha'].') - registro não localizado';
                                }
                            }
                        }
                        if(count($pSalvos)>0)  $saida['periodos'] = $pSalvos;
                    }
                } else {
                    $saida['erro'] = $erros['naoexiste'];
                }
            }
        } else { // EXCLUI
            $PROPOSTA = proposta::find_by_id($_POST['IDProposta']);

            if($PROPOSTA){
                // exclui dados dos perídos
                propostas_periodo::delete_all(array('conditions'=>array('propostas_id = ?',$_POST['IDProposta'])));

                // exclui dados do cabecalho da proposta
                ////////////////////////////////////////////
                $PROPOSTA->delete();                      //
                ////////////////////////////////////////////
            } else {
                $saida['erro'] = $erros['naoexiste'];
            }
        }

    } else if(isset($_POST['excluiPeriodo'])) {
        $PERIODO = propostas_periodo::find_by_id_and_propostas_id($_POST['IDperiodo'],$_POST['IDProposta']);

        if($PERIODO){
            $PERIODO->delete();
            $saida['excluiPeriodo'] = 1;
            $saida['IDinterno'] = $_POST['IDinterno'];
        } else {
            $saida['erro'] = $erros['naoexiste'];
        }

    } else if(isset($_POST['excluiProduto'])) {
        $criterios = array('propostas_id = ? AND veiculos_regras_id = ? AND grupo = ?',$_POST['IDProposta'],$_POST['IDRegra'],$_POST['grupo']);
        $produto  = propostas_periodo::all(array('conditions'=>$criterios));

        if(count($produto)>0){
            propostas_periodo::delete_all(array('conditions'=>$criterios));
            $saida['excluiProduto'] = 1;
        } else {
            $saida['erro'] = 'O registro deste produto não foi encontrado no banco';
        }

    } else if(isset($_POST['excluiVeiculo'])) {
        // IDVeiculo
        $criterios = array('propostas_id = ? AND veiculos_id = ?',$_POST['IDProposta'],$_POST['IDVeiculo']);
        $veiculo  = propostas_periodo::all(array('conditions'=>$criterios));

        if(count($veiculo)>0){
            propostas_periodo::delete_all(array('conditions'=>$criterios));
            $saida['excluiVeiculo'] = 1;
        } else {
            $saida['erro'] = 'O registro deste veíuclo não foi encontrado no banco';
        }

    } else if(isset($_POST['carregaVeiculo'])) {
        if(isset($_POST['IDVeiculo']) && isset($_POST['IDProposta'])){
            $periodos = propostas_periodo::find_all_by_propostas_id_and_veiculos_id($_POST['IDProposta'],$_POST['IDVeiculo'],array('order' => 'grupo, linha asc'));

            if(count($periodos) > 0){
                $arrProdutos  = array();
                $arrPeriodos  = array();

                $contaPeridos        = 0;
                $regraAnterior       = 0;
                $grupoAnterior       = 0;
                $produtoAnterior     = '';
                $segmentacaoAnterior = '';
                $formatoAnterior     = '';
                $targetAnterior      = '';
                $pracaAnterior       = '';  
                $descontoAnterior    = '';  

                foreach($periodos as $per){
                    ++$contaPeridos;

                    if(count($arrProdutos) == 0 && count($arrPeriodos) == 0){
                        array_push($arrPeriodos,montaDadosPeriodo($per));
                    } else {
                        if($grupoAnterior == $per->grupo){
                            array_push($arrPeriodos,montaDadosPeriodo($per));
                        } else {
                            // se não for do mesmo grupo inicia inserindo o array
                            // de períodos anteriores no array de produtos
                            $dadosPeriodos = array();
                            $dadosPeriodos['idRegra']     = $regraAnterior;
                            $dadosPeriodos['grupo']       = $grupoAnterior;
                            $dadosPeriodos['produto']     = $produtoAnterior;
                            $dadosPeriodos['segmentacao'] = $segmentacaoAnterior;
                            $dadosPeriodos['formato']     = $formatoAnterior;
                            $dadosPeriodos['target']      = $targetAnterior;
                            $dadosPeriodos['praca']       = $pracaAnterior;
                            $dadosPeriodos['descontoMax'] = $descontoAnterior;

                            $dadosPeriodos['periodos']    = $arrPeriodos;
                            
                            array_push($arrProdutos, $dadosPeriodos);

                            // zera o array de períodos
                            $arrPeriodos = array();

                            // insere o período no array zerado
                            array_push($arrPeriodos,montaDadosPeriodo($per));
                        }
                    }
                    // atualiza dados anteriores
                    $regraAnterior       = $per->veiculos_regras_id;
                    $grupoAnterior       = $per->grupo; 
                    $produtoAnterior     = $per->regra->produto;
                    $segmentacaoAnterior = $per->regra->segmentacao;
                    $formatoAnterior     = $per->regra->formato;
                    $targetAnterior      = $per->target;
                    $pracaAnterior       = $per->praca;
                    $descontoAnterior    = $per->regra->desconto_max;

                    // se for o úlitmo item do array insere o ray de períodos direto no array de produtos
                    if($contaPeridos == count($periodos)){
                        $dadosPeriodos = array();
                        $dadosPeriodos['idRegra']     = $regraAnterior;
                        $dadosPeriodos['grupo']       = $grupoAnterior;
                        $dadosPeriodos['produto']     = $produtoAnterior;
                        $dadosPeriodos['segmentacao'] = $segmentacaoAnterior;
                        $dadosPeriodos['formato']     = $formatoAnterior;
                        $dadosPeriodos['target']      = $targetAnterior;
                        $dadosPeriodos['praca']       = $pracaAnterior;
                        $dadosPeriodos['descontoMax'] = $descontoAnterior;

                        $dadosPeriodos['periodos']    = $arrPeriodos;

                        array_push($arrProdutos, $dadosPeriodos);
                    }
                }
            }

            $saida['listaProdutos'] = $arrProdutos;

        } else {
            $saida['erro'] = $erros['dados_insuficientes'];
        }

    } else {$saida['erro'] = $erros['operacao_nao_definida'];}

} else {
    $saida['erro'] = $erros['dados_insuficientes'];
}

echo json_encode($saida,JSON_UNESCAPED_UNICODE);



/////////////

function montaDadosPeriodo($p){
    $d = array();
    $d['idPeriodo']  = $p->id;
    $d['idRegra']    = $p->regra->id;
    
    $d['grupo']      = $p->grupo;
    $d['linha']      = $p->linha;
    $d['target']     = $p->target;
    $d['praca']      = $p->praca;

    $d['dataInit']   = date_format($p->data_inicio, 'd/m/Y');
    $d['dataFim']    = date_format($p->data_fim, 'd/m/Y');
    $d['totLiquido'] = $p->total_liquido;
    $d['totBruto']   = $p->total_bruto;
    $d['desconto']   = $p->desconto_linha;

    return $d;
}