

var arqCriaEdita       = __BASESITE__+'/app/functions/cria_edita_propostas_ajax.php';
var todosVeiculos      = listaVeiculos;
var VEICULOS           = [];
var CONTA_NOVO         =  0;
var CRIAR              =  1;
var ATUALIZAR          =  0;
var EXCLUIR            = -1;

///////// 
var containerVeiculos    = '#container-veiculos';
var containerBtsVeiculos = '#container-bts-veiculos';

// campos cabeçalho
var $selectAgencias      = $('#proposta-agencia');
var $selectClientes      = $('#proposta-cliente');
var $inputDescClientes   = $('#proposta-desconto-cliente');
var $inputTituloProp     = $('#proposta-titulo');
var $inputContatoProp    = $('#proposta-contato');

$inputDescClientes.mask('00,00', {reverse: true});

$inputDescClientes.keyup(function() {
    // document.dispatchEvent(new CustomEvent("aplicaRegrasProdutoss",{ "detail": {'valor':this.value} }));
    document.dispatchEvent(new CustomEvent("aplicaRegrasProdutoss"));
});

// zera o container dos botoes de veículos
$(containerBtsVeiculos).empty();

for(var i=0; i<todosVeiculos.length; i++){
    var veiculo = todosVeiculos[i];
    VEICULOS.push(new CardVeiculo(veiculo.id,{ativo:veiculo.logo_ativo,inativo:veiculo.logo_inativo}, veiculo.nome, veiculo.cor, veiculo.regras, veiculo.status,containerVeiculos, containerBtsVeiculos, __BASEHTML__));
}


function salvarProposta(){
    // salva cabeçalho
    var erro  = '';
    var DADOS = {};

    DADOS.IDProposta = IDProposta;
    DADOS.agencia  = $('#proposta-agencia').val();
    DADOS.cliente  = $('#proposta-cliente').val();
    DADOS.titulo   = $('#proposta-titulo').val();
    DADOS.contato  = $('#proposta-contato').val();
    DADOS.desconto = $('#proposta-desconto-cliente').val();

    DADOS.operacao = IDProposta == 0 ? CRIAR : ATUALIZAR;
    
    if(DADOS.agencia == '---' && erro == '') erro = 'Selecine uma opção em AGÊNCIAS!';
    if(DADOS.cliente == '---' && erro == '') erro = 'Selecine uma opção em CLIENTES!';

    if(DADOS.desconto != ''){
        var ardsc = DADOS.desconto.split(',');
        if(ardsc.length != 2 || ardsc[0] == '') erro = 'Para o DESCONTO CLIENTE considere o valor com duas casas após a vírgula!';
    }

    if(DADOS.titulo == '' && erro == '') erro = 'Defina um TÍTULO para a proposta!';
    if(DADOS.contato == '' && erro == '') erro = 'Defina o nome de um CONTATO!';
    
    // salva veículos da proposta
    ////////  TODO /////////////////
    if(VEICULOS.length>0){
        
        DADOS.periodos = [];

        for(var i=0; i<VEICULOS.length; i++){
            var v = VEICULOS[i];
            
            if(v.getAtivo()){    
                var dadosP = v.getDados();
                
                if(dadosP.erro){
                    erro = dadosP.erro;
                    i = VEICULOS.length;
                } else {
                    DADOS.periodos = DADOS.periodos.concat(dadosP);
                }
            }
        } 
        console.log(JSON.stringify(DADOS.periodos, null, 4));
    }
    erro == '' ? gravarDados(DADOS) : chamaModalFeedback('NÃO FOI POSSÍVEL SALVAR A PROPOSTA!',erro);
}

function excluirProposta(){
    // TODO ///////////////////
    if(IDProposta == 0){
        chamaModalFeedback('OPERAÇÃO NÃO EXECUTADA!','Não foi possíel excluir esta proposta porque ela ainda não foi salva no sistema.');
    } else {
        var DADOS = {};
        DADOS.IDProposta = IDProposta;
        DADOS.titulo = $('#proposta-titulo').val();
        DADOS.operacao = EXCLUIR;
        gravarDados(DADOS);
    }
}



function gravarDados(DADOS){
    if(DADOS.operacao == EXCLUIR){
        callModalMenor('CONFIRMA EXCLUIR PROPOSTA '+DADOS.titulo+' ('+DADOS.IDProposta+')?', 'Esta operação não pode ser desfeita. Após a exclusão você será redirecionado para a página de <strong>Listagem de propostas</strong>', function(){callAjax(DADOS)});
    } else {
        callAjax(DADOS);
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


function callAjax(DADOS){
    $.ajax({
        type: 'POST',
        dataType: "json",
        url: arqCriaEdita,
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
            IDProposta = data.IDProposta;
            op = ' criada ';
        } else if(data.operacao == EXCLUIR){
            // se a proposta foi excluida redireciona para a página de listagem
            window.location.href = "../lista-propostas";
        } else { // ATUALIZAR
            // retornod e novos períodos salvos
            if(data.periodos) document.dispatchEvent(new CustomEvent("eventoFeedbackSalvarPeriodos",{ "detail": {'periodosSalvos':data.periodos} }));
            op = ' atualizada ';
        }

        var msg = 'Proposta <strong>'+$('#proposta-titulo').val()+'</strong> ('+IDProposta+') '+op+'com sucesso!';
        if(data.erro_periodos) msg += '<br><strong>-- '+data.erro_periodos+'--</strong>';

        chamaModalFeedback('PROPOSTAS ALRIGHT!', msg);
    } else { // se tiver erro
        chamaModalFeedback('<span style="color:red;">ERRO DE OPERAÇÃO</span>', data.erro);
    }
}




function msgErrProp(idp){
    callModalMenor('PROPOSTA NÃO ENCONTRADA!','A proposta '+idp+' não foi localizada no sistema!',
        function(){window.location.href = "../edita-proposta";}
    );
}