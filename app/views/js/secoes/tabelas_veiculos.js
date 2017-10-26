

var arqTabelasVeiculos = __BASESITE__+'/app/functions/tabelas_veiculos_ajax.php';
var CONTA_NOVO         = 0;

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

$(document).ready(function() {
    aplicaMascarasCampos();
});

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////

function aplicaMascarasCampos(){
    $('.mask-moeda').mask('000.000.000,00', {reverse: true});
    $('.mask-pct').mask('00,00', {reverse: true});
}


function inserirNovaRegra(idv){
    var nomeVeiculo        = selectsItens['veiculo_'+idv].nome;
    var selectProdutos     = selectsItens['veiculo_'+idv].produtos;
    var selectSegmentacoes = selectsItens['veiculo_'+idv].segmentacoes;
    var selectFormatos     = selectsItens['veiculo_'+idv].formatos;

    ++CONTA_NOVO;

    var rowNova = `
        <tr id="registro-NOVO-${CONTA_NOVO}">
            <td style="padding-top:14px; text-align:center;">..</td>
            <td>
                <select class="form-control select-menor" id="veic-produto-NOVO-${CONTA_NOVO}">
                    ${selectProdutos}
                </select>
            </td>
            <td>
                <select class="form-control select-menor" id="veic-segmentacao-NOVO-${CONTA_NOVO}">
                    ${selectSegmentacoes}
                </select>
            </td>
            <td>
                <select class="form-control select-menor" id="veic-formato-NOVO-${CONTA_NOVO}">
                    ${selectFormatos}
                </select>
            </td>
            <td><input type="text" id="veic-invstmin-NOVO-${CONTA_NOVO}" class="form-control mask-moeda" style="height:28px; text-align:center; padding:6px;" value=""></td>
            <td>
                <select class="form-control select-menor" id="veic-tipocompra-NOVO-${CONTA_NOVO}">
                    ${selectsCompras}
                </select>
            </td>
            <td><input type="text" id="veic-cub-NOVO-${CONTA_NOVO}" class="form-control mask-moeda" style="height:28px; width:60px; text-align:center; padding:6px;" value=""></td>
            <td><input type="text" id="veic-descmax-NOVO-${CONTA_NOVO}" class="form-control mask-pct" style="width:60px; height:28px; text-align:center;  padding:6px;" value=""></td>
            <td style="padding-top: 5px;">
                <div style="padding: 4px 0; text-align:center;">
                    <div style="padding: 4px 0; text-align:center;">
                        <button onclick="editarExcluirRegra(0,${idv},'${nomeVeiculo}',1,${CONTA_NOVO})" type="button" class="btn btn-round btn-info bt-acoes" data-toggle="tooltip" data-placement="top" title="Salvar registro"><i class="fa fa-save"></i></button>
                        <button onclick="editarExcluirRegra(0,${idv},'${nomeVeiculo}',-1,${CONTA_NOVO})" type="button" class="btn btn-round btn-danger bt-acoes" data-toggle="tooltip" data-placement="top" title="Excluir registro"> <span style="position:relative; top:-7px;">x</span> </button>
                    </div>
                </div>
            </td>
        </tr>
    `;

    // se a tabela for vazia exclui aviso
    if($('#sem-regras-'+idv).length) $('#sem-regras-'+idv).remove();
    
    // insere novo elemento
    $('#tabela-regras-'+idv).append(rowNova);

    // aplica máscaras
    aplicaMascarasCampos();

    // se estiver fechada a caixa, abre
    var $xpanel = $('#tabela-regras-'+idv).closest(".x_panel");

    if($xpanel.hasClass('collapsed')) {
        $xpanel.removeClass("collapsed")
        $xpanel.find('.x_content').css('display', 'block');
        $xpanel.find('i').toggleClass('fa-chevron-up fa-chevron-down');
    }

    // reaplica a contagem
    recalculaItensTabela(idv,$('#tabela-regras-'+idv));
}


function editarExcluirRegra(id, idVeiculo, nomeVeiculo, operacao, novo = 0){
    /**
     * operacao :: -1 (excluir) | 0 (atualizar) | 1 (salvar)
     */
    var erro  = '';
    var dados = {};
    dados.idRegra     = id;
    dados.idVeiculo   = idVeiculo;
    dados.nomeVeiculo = nomeVeiculo;
    dados.operacao    = operacao;
    
    if(operacao == -1){ // excluir
        // exclui regra incluida na tabela mas não salva no sistema
        if(novo != 0) {
            removeItemTabela(idVeiculo,'NOVO-'+novo);
            return;
        }
    } else {
        // TODO ////////////////////// console.log(JSON.stringify(dados, null, 4)); return;
        var sf = novo != 0 ? 'NOVO-'+novo : id;
        
        dados.produto              = $('#veic-produto-'+sf).val();
        dados.segmentacao          = $('#veic-segmentacao-'+sf).val();
        dados.formato              = $('#veic-formato-'+sf).val();
        dados.investimento_minimo  = $('#veic-invstmin-'+sf).val();
        dados.compra_nome          = $('#veic-tipocompra-'+sf).find('option:selected').text();
        dados.compra_multiplicador = $('#veic-tipocompra-'+sf).val();
        dados.cub                  = $('#veic-cub-'+sf).val();
        dados.desconto_max         = $('#veic-descmax-'+sf).val();

        if(dados.produto == '---' && erro == '') erro = 'Selecione um <strong>Produto</strong>!';
        if(dados.segmentacao == '---' && erro == '') erro = 'Selecione uma <strong>Segmentação</strong>!';
        if(dados.formato == '---' && erro == '') erro = 'Selecione um <strong>Formato</strong>!';
        if(dados.compra_nome == '---' && erro == '') erro = 'Selecione um <strong>Tipo de Compra</strong>!';
        if((dados.cub == '' || formataDado(dados.cub,'R$',true) == 0) && erro == '') erro = 'Defina um <strong>Custo Unitário Bruto</strong>!';
    }

    erro == '' ? gravarDados(dados) : callModalMenor('Informações de regra incompletas!', erro);
}


function removeItemTabela(idVeiculo,item){
    var $tabela      = $('#tabela-regras-'+idVeiculo);
    var $rowExcluida = $('#registro-'+item);

    $('.tooltip').tooltip('hide');
    
    $rowExcluida.remove();

    if ($tabela.children().length == 0) {
        $tabela.append('<tr id="sem-regras-'+idVeiculo+'"> <td colspan="9" style="text-align:center; padding-bottom:8px;">Não há regras cadastradas para este veículo!</td></tr>');
    }

    recalculaItensTabela(idVeiculo,$tabela);
}


function recalculaItensTabela(idVeiculo,$tabela){
    var $cabecalho = $('#cab-veiculo-modelos-' + idVeiculo);
    $cabecalho.empty();

    if($('#sem-regras-'+idVeiculo).length){
        $cabecalho.append('0');
    } else {
        $cabecalho.append($tabela.children().length);
    }
}


function gravarDados(DADOS){
    if(DADOS.operacao == -1){
        callModalMenor('Confirma excluir regra '+DADOS.idRegra+' de '+DADOS.nomeVeiculo+'?', 'Esta operação não pode ser desfeita.', function(){callAjax(DADOS)});
    } else {
        callAjax(DADOS);
    }
}


function callAjax(DADOS){
     $.ajax({
        type: 'POST',
        dataType: "json",
        url: arqTabelasVeiculos,
        data: DADOS,
        cache: false,
        success: onDadosSalvos,
        error: function(errorThrown){
            console.log("Falha no AJAX! -- envio de dados página");
            // str = JSON.stringify(errorThrown, null, 4);
            // console.log('+++ '+errorThrown.responseText);
            var saidaErr = _.unescape(errorThrown.responseText); 
			window.open('about:blank').document.body.innerHTML = saidaErr;
        } 
    });
}


function onDadosSalvos(data){ //console.log('>>>>> '+JSON.stringify(data, null, 4));
    if(!data.erro){
        // TODO ////////////////////
    } else { // se tiver erro
        chamaModalFeedback('<span style="color:red;">ERRO DE OPERAÇÃO</span>', data.erro);
    }
}