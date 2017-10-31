<?php 
include_once "connections.php";

$saida     = array();
$CRIAR     =  1;
$ATUALIZAR =  0;
$EXCLUIR   = -1;

$erros = array();
$erros['naoexiste'] = 'Operação não realizada - o registro solicitado não foi encontrado.';
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

                // atualiza dados do cabeçalho da proposta
                ////////////////////////////////////////////
                $PROPOSTA->update_attributes($dados);     //
                ////////////////////////////////////////////

                // salva/atualiza dados dos períodos
                // TODO
            }
        } else { // EXCLUI
            $PROPOSTA = proposta::find_by_id($_POST['IDProposta']);

            if($PROPOSTA){
                // exclui dados dos perídos
                // TODO

                // exclui dados do cabecalho da proposta
                ////////////////////////////////////////////
                $PROPOSTA->delete();                      //
                ////////////////////////////////////////////
            } else {
                $saida['erro'] = $erros['naoexiste'];
            }


        }

    } else if(isset($_POST['excluiPeriodo'])) {
        // TODO

    } else if(isset($_POST['excluiProduto'])) {
        // TODO

    } else if(isset($_POST['excluiVeiculo'])) {
        // TODO

    } else if(isset($_POST['carregaVeiculo'])) {
        // TODO
        if(isset($_POST['IDVeiculo']) && isset($_POST['IDProposta'])){

        } else {
            $saida['erro'] = $erros['dados_insuficientes'];
        }

    } else {$saida['erro'] = $erros['operacao_nao_definida'];}

} else {
    $saida['erro'] = $erros['dados_insuficientes'];
}

echo json_encode($saida,JSON_UNESCAPED_UNICODE);

