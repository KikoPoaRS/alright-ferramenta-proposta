

var arqTabelasVeiculos = __BASESITE__+'/app/functions/tabelas_veiculos_ajax.php';
var CONTA_NOVO         =  0;
var CRIAR              =  1;
var ATUALIZAR          =  0;
var EXCLUIR            = -1;

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

function inserirAtualizarRegra(idVeiculo, idTmp = 0, idFinal = 0, DADOS = null){
    var nomeVeiculo, selectProdutos, selectSegmentacoes, selectFormatos, selectsComprasTmp;
    var IDC, sf,idReplace, rowFinal, $TR, atualiza, idNovo = 0;
    var valInvest, valCub, valDesc;

    var nomeVeiculo        = selectsItens['veiculo_'+idVeiculo].nome;
    var selectProdutos     = selectsItens['veiculo_'+idVeiculo].produtos;
    var selectSegmentacoes = selectsItens['veiculo_'+idVeiculo].segmentacoes;
    var selectFormatos     = selectsItens['veiculo_'+idVeiculo].formatos;
    var selectsComprasTmp  = selectsCompras;

    if(idFinal == 0){
        valInvest = valCub = valDesc = '';

        idNovo = idReplace = ++CONTA_NOVO;
        sf = 'NOVO-'+idNovo;
        atualiza = 1;
        $('#tabela-regras-'+idVeiculo).append('<tr id="registro-'+sf+'"></tr>');
        $TR = $('#registro-'+sf);
        IDC = '..';

    } else {
        
        $TR = $('#registro-NOVO-'+idTmp); // <option>---</option><option value="Google Search">Google Search</option><option value="Google Display">Google Display</option>
        
        selectProdutos     = selectProdutos.replace('value="'+DADOS.produto+'"', 'value="'+DADOS.produto+'" selected');
        selectSegmentacoes = selectSegmentacoes.replace('value="'+DADOS.segmentacao+'"', 'value="'+DADOS.segmentacao+'" selected');
        selectFormatos     = selectFormatos.replace('value="'+DADOS.formato+'"', 'value="'+DADOS.formato+'" selected');
        selectsComprasTmp  = selectsComprasTmp.replace('<option value="'+DADOS.tipo_compra_multiplicador+'">'+DADOS.tipo_compra_nome+'</option>', '<option value="'+DADOS.tipo_compra_multiplicador+'" selected>'+DADOS.tipo_compra_nome+'</option>');
        valInvest          = DADOS.investimento_minimo;
        valCub             = DADOS.custo_unit_bruto;
        valDesc            = DADOS.desconto_max;

        $TR.empty();
        $TR.attr('id','registro-'+idFinal);
        sf = idReplace = IDC = idFinal;
        atualiza = 0;
    }

    rowFinal = `
        <td style="padding-top:14px; text-align:center;">${IDC}</td>
        <td>
            <select class="form-control select-menor" id="veic-produto-${sf}">
                ${selectProdutos}
            </select>
        </td>
        <td>
            <select class="form-control select-menor" id="veic-segmentacao-${sf}">
                ${selectSegmentacoes}
            </select>
        </td>
        <td>
            <select class="form-control select-menor" id="veic-formato-${sf}">
                ${selectFormatos}
            </select>
        </td>
        <td><input type="text" id="veic-invstmin-${sf}" class="form-control mask-moeda" style="height:28px; text-align:center; padding:6px;" value="${valInvest}"></td>
        <td>
            <select class="form-control select-menor" id="veic-tipocompra-${sf}">
                ${selectsComprasTmp}
            </select>
        </td>
        <td><input type="text" id="veic-cub-${sf}" class="form-control mask-moeda" style="height:28px; width:60px; text-align:center; padding:6px;" value="${valCub}"></td>
        <td><input type="text" id="veic-descmax-${sf}" class="form-control mask-pct" style="width:60px; height:28px; text-align:center;  padding:6px;" value="${valDesc}"></td>
        <td style="padding-top: 5px;">
            <div style="padding: 4px 0; text-align:center;">
                <div style="padding: 4px 0; text-align:center;">
                    <button onclick="editarExcluirRegra(0,${idVeiculo},'${nomeVeiculo}',${atualiza},${idNovo})" type="button" class="btn btn-round btn-info bt-acoes" data-toggle="tooltip" data-placement="top" title="Salvar registro"><i class="fa fa-save"></i></button>
                    <button onclick="editarExcluirRegra(0,${idVeiculo},'${nomeVeiculo}',-1,${idNovo})" type="button" class="btn btn-round btn-danger bt-acoes" data-toggle="tooltip" data-placement="top" title="Excluir registro"> <span style="position:relative; top:-7px;">x</span> </button>
                </div>
            </div>
        </td>
    `;

    // se a tabela for vazia exclui aviso
    if($('#sem-regras-'+idVeiculo).length) $('#sem-regras-'+idVeiculo).remove();
    
    // insere novo elemento
    $TR.append(rowFinal);

    // aplica máscaras
    aplicaMascarasCampos();
    
    if(idFinal == 0){
        // se estiver fechada a caixa, abre
        var $xpanel = $('#tabela-regras-'+idVeiculo).closest(".x_panel");

        if($xpanel.hasClass('collapsed')) {
            $xpanel.removeClass("collapsed")
            $xpanel.find('.x_content').css('display', 'block');
            $xpanel.find('i').toggleClass('fa-chevron-up fa-chevron-down');
        }
        // reaplica a contagem
        recalculaItensTabela(idVeiculo,$('#tabela-regras-'+idVeiculo));
    }
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
    
    if(operacao == EXCLUIR){ // excluir
        // exclui regra incluida na tabela mas não salva no sistema
        if(novo != 0) {
            removeItemTabela(idVeiculo,'NOVO-'+novo);
            return;
        }
    } else {
        // console.log(JSON.stringify(dados, null, 4)); return;
        var sf = novo != 0 ? 'NOVO-'+novo : id;

        dados.novo                 = novo;
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

    erro == '' ? gravarDados(dados) : chamaModalFeedback('INFORMAÇ˜ÕES DE REGRAS INCOMPLETAS!', erro);
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
    if(DADOS.operacao == EXCLUIR){
        callModalMenor('Confirma excluir regra de ID '+DADOS.idRegra+' de '+DADOS.nomeVeiculo+'?', 'Esta operação não pode ser desfeita.', function(){callAjax(DADOS)});
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
        var op;
        if(data.operacao == CRIAR){
            inserirAtualizarRegra(data.idVeiculo,data.novo,data.idRegra,data.DADOS);// atualiza o id de cada novo item criado
        } else if(data.operacao == EXCLUIR){
            op = ' excluida ';
            removeItemTabela(data.idVeiculo,data.idRegra);
        } else { // ATUALIZAR
            op = ' atualizada ';
        }
        chamaModalFeedback('TABELAS DE VEÍCULOS!', 'Regra de ID '+data.idRegra+' para '+data.nomeVeiculo+op+'com sucesso!');
    } else { // se tiver erro
        chamaModalFeedback('<span style="color:red;">ERRO DE OPERAÇÃO</span>', data.erro);
    }
}


function chamaModalFeedback(tit,msg){
    if($('.modal-backdrop').length){
        $('#modal-menor').on('hidden.bs.modal', function(){
            //remove o evento da modal e chama a próxima modal
            $('#modal-menor').unbind( "hidden.bs.modal");
            callModalMenor(tit,msg);
        })
    } else {
        callModalMenor(tit,msg);
    }
}




