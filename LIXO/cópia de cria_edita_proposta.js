
/*
var regrasAR = [
    { // produto
        nome:"Rede",
        segmentacoes:[
            {
                nome: "Trueview 30s - 1min ou mais",
                formatos: [
                    {
                        IDregra:1,
                        nome: "Pre-roll e intext",
                        descontoMax: "20,00",
                        investMinimo:"",
                        tipoCompra: ["CPV 30s",1],
                        CUB: "6,00"
                    }
                ]
            },
            {
                nome: "Trueview 30s",
                formatos: [
                    {
                        IDregra:2,
                        nome: "Pre-roll e intext",
                        descontoMax: "12,00",
                        investMinimo:"",
                        tipoCompra: ["CPV 30s",1],
                        CUB: "6,00"
                    }
                ]
            },
            {
                nome: "Quartil 7,5s",
                formatos: [
                    {
                        IDregra:3,
                        nome: "Pre-roll e intext",
                        descontoMax: "15,00",
                        investMinimo:"",
                        tipoCompra: ["CPV 7s",1],
                        CUB: "6,00"
                    }
                ]
            },
            {
                nome: "Swipe",
                formatos: [
                    {
                        IDregra:4,
                        nome: "Swipe to engage",
                        descontoMax: "10,00",
                        investMinimo:"",
                        tipoCompra: ["CPE",1],
                        CUB: "6,00"
                    }
                ]
            },
            {
                nome: "Take over",
                formatos: [
                    {
                        IDregra:5,
                        nome: "Takeover",
                        descontoMax: "25,00",
                        investMinimo:"",
                        tipoCompra: ["CPV 30s",1],
                        CUB: "6,00"
                    }
                ]
            },
            {
                nome: "Display",
                formatos: [
                    {
                        IDregra:6,
                        nome: "Standard AB",
                        descontoMax: "25,00",
                        investMinimo:"",
                        tipoCompra: ["CPM",1000],
                        CUB: "6,00"
                    }
                ]
            }
        ]
    },
    {
        nome:"Youtube",
        segmentacoes:[
            {
                nome: "Trueview 30s - 1min ou mais",
                formatos: [
                    {
                        IDregra:7,
                        nome: "Pre-roll",
                        descontoMax: "20,00",
                        investMinimo:"",
                        tipoCompra: ["CPV 30s",1],
                        CUB: "6,00",
                    }
                ]
            },
            {
                nome: "Trueview 30s",
                formatos: [
                    {
                        IDregra:8,
                        nome: "Pre-roll",
                        descontoMax: "20,00",
                        investMinimo:"",
                        tipoCompra: ["CPV 30s",1],
                        CUB: "6,00"
                    }
                ]
            },
            {
                nome: "Bumper Ads",
                formatos: [
                    {
                        IDregra:1,
                        nome: "Bumper Ads",
                        descontoMax: "20,00",
                        investMinimo:"",
                        tipoCompra: ["CPV 6s",1],
                        CUB: "6,00"
                    }
                ]
            }
        ]
    },
    {
        nome:"Warner",
        segmentacoes:[
            {
                nome: "Trueview 15s",
                formatos: [
                    {
                        IDregra:9,
                        nome: "Pre-roll",
                        descontoMax: "10,00",
                        investMinimo:"2.000,00",
                        tipoCompra: ["CPV 15s",1],
                        CUB: "6,00"
                    },
                    {
                        IDregra:10,
                        nome: "Pre-roll sem skip",
                        descontoMax: "15,00",
                        investMinimo:"2.000,00",
                        tipoCompra: ["CPV 15s",1],
                        CUB: "6,00"
                    }
                ]
            },
            {
                nome: "Trueview 30s",
                formatos: [
                    {
                        IDregra:11,
                        nome: "Pre-roll",
                        descontoMax: "10,00",
                        investMinimo:"5.000,00",
                        tipoCompra: ["CPV 15s",1],
                        CUB: "6,00"
                    }
                ]
            }
        ]
    },
    {
        nome:"TV Conectada",
        segmentacoes:[
            {
                nome: "Branding",
                formatos: [
                    {
                        IDregra:12,
                        nome: "Display + pre-roll",
                        descontoMax: "20,00",
                        investMinimo:"2.500,00",
                        tipoCompra: ["CPM",1000],
                        CUB: "6,00"
                    }
                ]
            }
        ]
    }
];

// simula dados recebidos do banco
var Alright       = {logo_ativo:'bt-produto-alright-ativo.png',    logo_inativo:'bt-produto-alright-inativo.png',    nome:'Alright', cor:'#6c00e9', regras:regrasAR, status:0};
var SarmartClip   = {logo_ativo:'bt-produto-smartclip-ativo.png',  logo_inativo:'bt-produto-smartclip-inativo.png',  nome:'SmartClip', cor:'#bf534c', regras:regrasAR, status:0};
var AudioAd       = {logo_ativo:'bt-produto-audioad-ativo.png',    logo_inativo:'bt-produto-audioad-inativo.png',    nome:'AudioAd', cor:'#cf7442', regras:regrasAR, status:0};
var Waze          = {logo_ativo:'bt-produto-waze-ativo.png',       logo_inativo:'bt-produto-waze-inativo.png',       nome:'Waze', cor:'#a5c2ce', regras:regrasAR, status:0};
var Buscape       = {logo_ativo:'bt-produto-buscape-ativo.png',    logo_inativo:'bt-produto-buscape-inativo.png',    nome:'Buscape', cor:'#eecc4d', regras:regrasAR, status:0};
var Facebook      = {logo_ativo:'bt-produto-facebook-ativo.png',   logo_inativo:'bt-produto-facebook-inativo.png',   nome:'Facebook', cor:'#425893', regras:regrasAR, status:0};
var Google        = {logo_ativo:'bt-produto-google-ativo.png',     logo_inativo:'bt-produto-google-inativo.png',     nome:'Google', cor:'#547cf2', regras:regrasAR, status:0};
var Outbrain      = {logo_ativo:'bt-produto-outbrain-ativo.png',   logo_inativo:'bt-produto-outbrain-inativo.png',   nome:'Outbrain', cor:'#dc8439', regras:regrasAR, status:0};
var Superplayer   = {logo_ativo:'bt-produto-superplayer-ativo.png',logo_inativo:'bt-produto-superplayer-inativo.png',nome:'Superplayer', cor:'#000', regras:regrasAR, status:0};
var Tradelab      = {logo_ativo:'bt-produto-tradelab-ativo.png',   logo_inativo:'bt-produto-tradelab-inativo.png',   nome:'Tradelab', cor:'#b1c43f', regras:regrasAR, status:0};
var YouTube       = {logo_ativo:'bt-produto-youtube-ativo.png',    logo_inativo:'bt-produto-youtube-inativo.png',    nome:'YouTube', cor:'#e57c76', regras:regrasAR, status:0};
var ModaIt        = {logo_ativo:'bt-produto-modait-ativo.png',     logo_inativo:'bt-produto-modait-inativo.png',     nome:'ModaIt', cor:'#ca547b', regras:regrasAR, status:0};

var todosVeiculos = [Alright, SarmartClip, Tradelab, YouTube, Facebook, Outbrain, Google, AudioAd, Waze, Superplayer,  ModaIt, Buscape];

*/

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
    VEICULOS.push(new CardVeiculo(i,{ativo:veiculo.logo_ativo,inativo:veiculo.logo_inativo}, veiculo.nome, veiculo.cor, veiculo.regras, veiculo.status,containerVeiculos, containerBtsVeiculos, __BASEHTML__));
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

    // console.log(JSON.stringify(DADOS, null, 4));
    
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

    //

    erro == '' ? gravarDados(DADOS) : chamaModalFeedback('NÃO FOI POSSÍVEL SALVAR A PROPOSTA!',erro);

}

function excluirProposta(){
    // TODO ///////////////////
    if(IDProposta == 0){
        chamaModalFeedback('OPERAÇÃO NÃO EXECUTADA!', 
        'Não foi possíel excluir esta proposta porque ela ainda não foi salva no sistema.');
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
            op = ' atualizada ';
        }
        chamaModalFeedback('PROPOSTAS ALRIGHT!', 'Proposta <strong>'+$('#proposta-titulo').val()+'</strong> ('+IDProposta+') '+op+'com sucesso!');
    } else { // se tiver erro
        chamaModalFeedback('<span style="color:red;">ERRO DE OPERAÇÃO</span>', data.erro);
    }
}




function msgErrProp(idp){
    callModalMenor('PROPOSTA NÃO ENCONTRADA!','A proposta '+idp+' não foi localizada no sistema!',
        function(){window.location.href = "../edita-proposta";}
    );
}