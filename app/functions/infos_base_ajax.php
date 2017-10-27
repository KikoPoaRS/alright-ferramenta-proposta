<?php 
include_once "connections.php";

$saida    = array();
$ATUALIZA = 1;
$EXCLUI   = 0;

$erros = array();
$erros['naoexiste'] = 'Operação não realizada - o registro solicitado não foi encontrado.';

$saida['ok'] = 'SEM ORIGEM DEFINIDA';

if(isset($_POST['origem'])){
    
    $saida['origem'] = $_POST['origem'];
    $saida['id']     = $_POST['id'];
    $dados           = array();

    if($_POST['origem'] == 'COMPRA'){

        $saida['nome'] = $_POST['nome'];

        if($_POST['id'] == 0){ // cria novo registro de tipo de compra
            $dados['nome'] = $_POST['nome'];
            $dados['multiplicador'] = (int)$_POST['multiplicador'];

            //////////////////////////////////////////////////////
            $COMPRA = tipos_compra::create($dados);
            $COMPRA->save();
            //////////////////////////////////////////////////////

            $saida['id']            = $COMPRA->id;
            $saida['operacao']      = 'inserido';
            $saida['multiplicador'] = $_POST['multiplicador'];

        } else {

            $COMPRA = tipos_compra::find_by_id($_POST['id']);

            if($_POST['operacao'] == $EXCLUI){
                if($COMPRA){
                    //////////////////////////////////////////////////////
                    $COMPRA->delete();
                    //////////////////////////////////////////////////////
                } else {
                    $saida['erro'] = $erros['naoexiste'];
                }

                $saida['operacao'] = 'excluido';

            } else { // atualiza dados
                if($COMPRA){
                    $dados['nome'] = $_POST['nome'];
                    $dados['multiplicador'] = (int)$_POST['multiplicador'];
        
                    //////////////////////////////////////////////////////
                    $COMPRA->update_attributes($dados);
                    //////////////////////////////////////////////////////
                } else {
                    $saida['erro'] = $erros['naoexiste']; 
                }

                $saida['operacao'] = 'atualizado';
            }
        }

    } else if($_POST['origem'] == 'VEICULO'){
        $saida['tipo']    = $_POST['tabela'] == 'segmentacoes' ? 'segmentações' : $_POST['tabela'];
        $saida['veiculo'] = $_POST['nome'];

        if($_POST['tabela'] == 'produtos'){
            $TABELA = veiculos_produto::find_by_id($_POST['id']);
        } else if($_POST['tabela'] == 'segmentacoes'){
            $TABELA = veiculos_segmentacoe::find_by_id($_POST['id']);
        } else { // $_POST['tabela'] == 'formatos'
            $TABELA = veiculos_formato::find_by_id($_POST['id']);
        }

        if($TABELA){
            $dados[$_POST['tabela']] = $_POST['infos'];
            //////////////////////////////////////////////////////
            $TABELA->update_attributes($dados);
            //////////////////////////////////////////////////////
        } else {
            $saida['erro'] = $erros['naoexiste']; 
        }
       
    } else { 

        $saida['nome']       = $_POST['nome'];
        $saida['codexterno'] = $_POST['codexterno'];

        if($_POST['id'] == 0){
            
            $dados['nome'] = $_POST['nome'];
            $dados['codigo_externo'] = $_POST['codexterno'];

            //////////////////////////////////////////////////////
            $_POST['origem'] == 'CLIENTE' ? $CLIAG = cliente::create($dados) :  $CLIAG = agencia::create($dados);
            $CLIAG->save();
            //////////////////////////////////////////////////////

            $saida['id']            = $CLIAG->id;
            $saida['operacao']      = 'inserido';
        } else {

            $_POST['origem'] == 'CLIENTE' ? $CLIAG = cliente::find_by_id($_POST['id']) :  $CLIAG = agencia::find_by_id($_POST['id']);

            if($_POST['operacao'] == $EXCLUI){
                if($CLIAG){
                    //////////////////////////////////////////////////////
                    $CLIAG->delete();
                    //////////////////////////////////////////////////////
                } else {
                    $saida['erro'] = $erros['naoexiste'];
                }

                $saida['operacao'] = 'excluido';
            } else {
                if($CLIAG){
                    $dados['nome'] = $_POST['nome'];
                    $dados['codigo_externo'] = $_POST['codexterno'];
        
                    //////////////////////////////////////////////////////
                    $CLIAG->update_attributes($dados);
                    //////////////////////////////////////////////////////
                } else {
                    $saida['erro'] = $erros['naoexiste'];
                }

                $saida['operacao'] = 'atualizado';
            }
        }
    }
}

echo json_encode($saida,JSON_UNESCAPED_UNICODE);
  