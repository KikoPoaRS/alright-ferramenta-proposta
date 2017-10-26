
var arqInfosBase = __BASESITE__+'/app/functions/infos_base_ajax.php';


function operacoesCompra(id = 0, salva = 1) { // id == 0 : veículo novo
    var dados = {};
    var sf = (id == 0 ? '' : '-'+id);

    dados.origem        = 'COMPRA';
    dados.operacao      = salva;
    dados.id            = id;
    dados.nome          = $('#tipocompra-nome'+sf).val();
    dados.multiplicador = $("input:radio[name ='radio-multiplicador-tipocompra"+sf+"']:checked").val();
   
    dados.nome == '' ?  callModalMenor('CADASTRO DE TIPOS DE COMPRAS', 'O campo NOME não pode ser vazio!') : gravarDados(dados);

}

function operacoesAgenciaCliente(tipo, id = 0, salva = 1){
    var dados = {};
    var sf = (id == 0 ? '' : '-'+id);

    dados.origem     = tipo;
    dados.operacao   = salva;
    dados.id         = id;
    dados.nome       = $('#'+tipo+'-nome'+sf).val();
    dados.codexterno = $('#'+tipo+'-codexterno'+sf).val();
    
    dados.nome == ''  ?  callModalMenor('CADASTRO DE '+tipo+'S', 'O campo '+tipo+' não pode ser vazio!') : gravarDados(dados);
}


function salvarDadosVeiculo(tabela, id, nome, tipo){
    var dados = {};

    dados.origem = 'VEICULO';
    dados.tabela = tabela;
    dados.id     = id;
    dados.nome   = nome;
    dados.infos  = $('#'+tipo+'-veiculo-'+id).val();

    gravarDados(dados);
}


function gravarDados(DADOS){
    if(DADOS.operacao == 0){
        callModalMenor('Confirma excluir '+DADOS.origem+' '+DADOS.nome+'?', 'Esta operação não pode ser desfeita.', function(){callAjax(DADOS)});
    } else {
        callAjax(DADOS);
    }
}


function callAjax(DADOS){
     $.ajax({
        type: 'POST',
        dataType: "json",
        url: arqInfosBase,
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
        switch(data.origem){
            case 'COMPRA':
                if(data.operacao == 'inserido'){
                    var item = {
                        id : data.id,
                        nome: data.nome,
                        checked_1: (data.multiplicador == 1 ? 'checked' : ''),
                        checked_1000: (data.multiplicador == 1000 ? 'checked' : '')
                    };

                    insereItemTabela(data.origem,item);

                    $('#tipocompra-nome').val('');
                    $("input:radio[name ='radio-multiplicador-tipocompra'][value='1']").prop("checked",true);

                } else if(data.operacao == 'excluido') {
                    removeItemTabela(data.origem,data.id)
                }

                chamaModalFeedback('CADASTRO DE TIPOS DE COMPRAS', 'Tipo de compra '+data.nome+' '+data.operacao+' com sucesso!');
            break;

            case 'VEICULO':
                chamaModalFeedback('TIPOS DE '+data.tipo.toUpperCase()+' POR VEÍCULOS', 'Dados do veículo '+data.veiculo.toUpperCase()+' atualizados com sucesso!');
            break;

            default:
                if(data.operacao == 'inserido'){
                    var item = {
                        id : data.id,
                        nome: data.nome,
                        codexterno: data.codexterno,
                        origem: data.origem
                    };

                    insereItemTabela(data.origem,item);

                    // zera o valor dos campos de inserção
                    $('#'+data.origem+'-nome').val('');
                    $('#'+data.origem+'-codexterno').val('');

                } else if(data.operacao == 'excluido') {
                    removeItemTabela(data.origem,data.id)
                }

                chamaModalFeedback('CADASTRO DE '+data.origem, 'Registro '+data.nome+' '+data.operacao+' com sucesso!');
        }
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


function insereItemTabela(tabela,item){
    var $tabela, rowNova;
    
    if(tabela == 'COMPRA'){
        $tabela = $('#tabela-COMPRAS');
        rowNova = `
            <tr id="COMPRA-${item.id}">
                <td><input type="text" id="tipocompra-nome-${item.id}" class="form-control" value="${item.nome}"></td>
                <td>
                    <div class="Grid">
                        <div class="radio-tabela"><input type="radio" value="1" name="radio-multiplicador-tipocompra-${item.id}" ${item.checked_1}></div><span class="radio-tabela label-radio">1</span> 
                        <div class="radio-tabela"><input type="radio" value="1000" name="radio-multiplicador-tipocompra-${item.id}" ${item.checked_1000}></div><span class="radio-tabela label-radio">1000</span> 
                    </div>
                </td>
                <td>
                    <div style="padding: 4px 0; text-align:center;">
                        <button onclick="operacoesCompra(${item.id},1)" type="button" class="btn btn-round btn-info bt-acoes" data-toggle="tooltip" data-placement="top" title="Salvar registro"><i class="fa fa-save"></i></button>
                        <button onclick="operacoesCompra(${item.id},0)" type="button" class="btn btn-round btn-danger bt-acoes" data-toggle="tooltip" data-placement="top" title="Excluir registro"> <span style="position:relative; top:-7px;">x</span> </button>
                    </div>
                </td>
            </tr>
            `;
  } else {
    $tabela = $('#tabela-'+tabela+'S');
    rowNova = `
    <tr id="${tabela}-${item.id}">
        <td><input type="text" id="${tabela}-nome-${item.id}" class="form-control" value="${item.nome}"></td>
        <td><input type="text" id="${tabela}-codexterno-${item.id}" class="form-control" value="${item.codexterno}"></td>
        <td>
            <div style="padding: 4px 0; text-align:center;">
                <button onclick="operacoesAgenciaCliente('${tabela}',${item.id},1)" type="button" class="btn btn-round btn-info bt-acoes" data-toggle="tooltip" data-placement="top" title="Atualizar registro"><i class="fa fa-save"></i></button>
                <button onclick="operacoesAgenciaCliente('${tabela}',${item.id},0)" type="button" class="btn btn-round btn-danger bt-acoes" data-toggle="tooltip" data-placement="top" title="Excluir registro"> <span style="position:relative; top:-7px;">x</span> </button>
            </div>
        </td>
    </tr>
    `;
  }

  if($('#sem-'+tabela+'S').length) $('#sem-'+tabela+'S').remove();
  $tabela.append(rowNova);

  // inicializa tooltips
  $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
}



function removeItemTabela(tabela,item){
    var $tabela        = $('#tabela-'+tabela+'S');
    var $rowExcluida   = $('#'+tabela+'-'+item);
    
    $('.tooltip').tooltip('hide');
    
    $rowExcluida.remove();

    if ($tabela.children().length == 0) {
        var adendo = tabela == 'COMPRA'  ? 'tipos de' : ''; 
        var oa     = tabela == 'AGENCIA' ? 'a'        : 'o';
        var tipo   = tabela == 'AGENCIA' ? 'agência'  : tabela.toLowerCase();

        $tabela.append('<tr id="sem-'+tabela+'S"> <td colspan="3" style="text-align:center;">Não há '+adendo+' '+tipo+'s cadastrad'+oa+'s!</td></tr>');
    }
}