<?php 
include_once "connections.php";

$saida     = array();
$CRIAR     =  1;
$ATUALIZAR =  0;
$EXCLUIR   = -1;

$erros = array();
$erros['naoexiste'] = 'Operação não realizada - o registro solicitado não foi encontrado.';
$erros['dados_insuficientes'] = 'Operação não realizada - dados enviados insuficientes.';

if(isset($_POST['idRegra']) && isset($_POST['operacao'])){

    $saida['idVeiculo']   = $_POST['idVeiculo'];
    $saida['nomeVeiculo'] = $_POST['nomeVeiculo'];
    $saida['idRegra']     = $_POST['idRegra'];
    $saida['operacao']    = $_POST['operacao'];
    
    $dados = array();

    if($_POST['operacao'] != $EXCLUIR){
        
        $saida['novo'] = $_POST['novo'];

        $dados['veiculos_id']               = $_POST['idVeiculo'];
        $dados['produto']                   = $_POST['produto'];
        $dados['segmentacao']               = $_POST['segmentacao'];
        $dados['formato']                   = $_POST['formato'];
        $dados['investimento_minimo']       = $_POST['investimento_minimo'];
        $dados['tipo_compra_nome']          = $_POST['compra_nome'];
        $dados['tipo_compra_multiplicador'] = (int)$_POST['compra_multiplicador'];
        $dados['custo_unit_bruto']          = $_POST['cub'];
        $dados['desconto_max']              = $_POST['desconto_max'];
    }

    if($_POST['operacao'] == $CRIAR && $_POST['idRegra'] == 0){
        ////////////////////////////////////////////
        $REGRA = veiculos_regra::create($dados);  //
        $REGRA->save();                           //
        ////////////////////////////////////////////

        $saida['idRegra'] = $REGRA->id;
        $saida['DADOS'] = $dados;

    } else {
        $REGRA = veiculos_regra::find_by_id($_POST['idRegra']);
        
        if($REGRA){
            if($_POST['operacao'] == $ATUALIZAR){
                ////////////////////////////////////////////
                $REGRA->update_attributes($dados);        //
                ////////////////////////////////////////////
            } else {
                ////////////////////////////////////////////
                $REGRA->delete();                         //
                ////////////////////////////////////////////
            }
        } else {
            $saida['erro'] = $erros['naoexiste'];
        }
    }

} else {
    $saida['erro'] = $erros['dados_insuficientes'] ;
}

echo json_encode($saida,JSON_UNESCAPED_UNICODE);

