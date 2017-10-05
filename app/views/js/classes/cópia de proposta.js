/*
var Cliente = (function(){
    
    // Variável privada do módulo
    var nomeFinal, nomePadrao = "Cliente sem nome";
    this.varPublica = 'var publica acessada';

    // Construtor
    function Cliente(nome) {        
        // Propriedade pública de cada instância 
        // this.nome = nome || nomePadrao;
        nomeFinal = nome || nomePadrao;
    }

    // Método público
    Cliente.prototype.infos = function() {
        var saida = `
        teste aqui...
        ... e termina aqui.... ${nomeFinal}
        `;

        var meuhtml = `
            <div style="color:red">
                E não é que funfou!! ${nomeFinal}
            </div>
        `;

        $('#saida').append(meuhtml);
        console.log('O nome é ' + saida);
    }

    // Expõe o construtor
    return Cliente;

}());*/


// *********************************************************
// ****************** PERÍODO PRODUTO **********************
// *********************************************************


var PeriodoProduto = (function(){
    // propriedades privadas
    var mesAtivo,                          // mes e ano ativos
        totalDiasMes,                      // total de dias do mes selecionado  
        diasMes,                           // objeto que armazena dia de inico e dia de fim
        totalCustoBruto,
        volumeContratado,
        tipoCompra,
        custoUnitarioBruto,
        custoUnitarioLiquido,
        desconto,
        custoUnitarioBrutoNegociado,
        custoUnitarioLiquidoNegociado,
        totalCustoLIquido;

    // propriedades públicas

    // construtor
    function PeriodoProduto(formato){
        tipoCompra = formato.tipoCompra;
        custoUnitarioBruto = formato.CUB;
        custoUnitarioLiquido = formato.CUL;
    }
    // expoe construtor
    return PeriodoProduto;
})();





// *********************************************************
// ****************** PRODUTO VEÍCULO **********************
// *********************************************************

var ProdutoVeiculo = (function(){
    // propriedades privadas
    var self = this;
    var produtoID = null; 
    var produtoNome,
        descontoMaximo,
        target,
        praca,
        formatoAtivo,
        $escopoProdutos;
    var listaSegmentacoes  = [];
    var selectSegmentacoes = [];
    var listaFormatos      = [];
    var selectFormatos     = [];
    var listaPeriodos      = [];

    // propriedades públicas

    // construtor
    function ProdutoVeiculo(id, nome, segmentacoes, escopo){
        produtoID  = id;
        produtoNome     = nome;
        $escopoProdutos = escopo;

        console.log('***************************************');
        console.log('Criando produto '+produtoID+' :: '+nome);
        console.log('***************************************');
        
        configuraSegmentacoes(segmentacoes);
    }

    // métodos privados
    function configuraSegmentacoes(segmentacoes){
        listaSegmentacoes = segmentacoes;
        selectSegmentacoes = [];

        for(var i=0; i<listaSegmentacoes.length; i++){
            var itemSegmentacao = listaSegmentacoes[i];
            selectSegmentacoes.push(itemSegmentacao.nome);
        }

        
        renderProduto();
        // inicializa a primeira segmetnacao
        // ativarSegmentacao(listaSegmentacoes[0].nome);
        // aplicarFormato(listaFormatos[0].nome);
        // criarPeriodo();
        // console.log('Produto '+produtoNome)
        // console.log('Montando select de Segmentacoes: '+JSON.stringify(selectSegmentacoes, null, 4));
    }

    function ativarSegmentacao(segmentacao){ console.log(produtoID+' :: segmentacao ativa '+segmentacao);
        // configura select de formatos    
        for(var i=0; i<listaSegmentacoes.length; i++){
            var seg = listaSegmentacoes[i];

            if(segmentacao == seg.nome){
                // monta select de formatos
                for(var j=0; j<seg.formatos.length; j++){
                    var formato = seg.formatos[j];
                    listaFormatos.push(formato);
                    selectFormatos.push(formato.nome);
                } //console.log('Montando formatos: '+JSON.stringify(listaFormatos, null, 4));
            }
        }
    }

    function aplicarFormato(formato){ console.log('>>>> '+formato)
        for(var i=0; i<listaFormatos.length; i++){
            var frm = listaFormatos[i];
            if(formato == frm.nome){
                formatoAtivo   = frm;
                descontoMaximo = frm.descontoMaximo;
            }
        } 
        
        // aplica as regras aos períodos existentes
        if(listaPeriodos.length > 0){
            for(var i=0; i<listaPeriodos.length; i++){
                // TODO
            }
        }
        
        console.log('formato ATIVO: '+JSON.stringify(formatoAtivo, null, 4));
    }

    function criarPeriodo(){
        listaPeriodos.push(new PeriodoProduto(formatoAtivo));
    }

    function renderProduto(){
        // monta select de produtos
        var listaPs = '';
        for(var i=0; i<selectSegmentacoes.length; i++){ listaPs += '<option value="'+selectSegmentacoes[i]+'">'+selectSegmentacoes[i]+'</option>'; }

        var containerProduto = `
        <div class="cabecalho-produtos">
            <div class="tit-produto">${produtoNome}</div>
            <div class="resumo-veiculo">
                <div style="display:inline-block" id="cab-produto-periodo-${produtoID}">10/10/17 a 10/11/17</div>
                <div style="display:inline-block" id="cab-produto-investimento-${produtoID}">R$ 00.000,00</div>
                <div style="display:inline-block" id="cab-produto-select-segmentacao-${produtoID}">
                    <select id="select-produto-${produtoID}">${listaPs}</select>
                </div>
                <div id="btexcluir-produto-${produtoID}"class="bt-fechar" onclick="">X</div>
            </div>
        </div>
        `;

        $escopoProdutos.append(containerProduto);

        // ativa componentes
        // $escopoProdutos = $('#container-produtos-'+veiculoID);

        $('#select-produto-'+produtoID).on('change', function() { if(this.value != "") ativarSegmentacao( this.value);})

        var idp = produtoID;

        $('#btexcluir-produto-'+produtoID).click(function() { 
            console.log('=====>> '+idp);
            document.dispatchEvent(new CustomEvent("eventoExcluiProduto",{ "detail": {'produtoID':idp} }));
        })

        // ativa a primeira segmentação
        ativarSegmentacao(selectSegmentacoes[0]);
    }

    // métodos públicos
    ProdutoVeiculo.prototype.getID = function(){
        return produtoID;
    }

    ProdutoVeiculo.prototype.excluir = function(){
        
    }

    ProdutoVeiculo.prototype.dados = function(){
        
    }
    // expoe construtor
    return ProdutoVeiculo;
})();



// *********************************************************
// ******************** CARD VEÍCULO ***********************
// *********************************************************


var CardVeiculo = (function (){
    // propriedades privadas
    var veiculoID,      // ID do veículo no banco
        veiculoLogo,    // recebe externo
        veiculoNome,    // recebe externo
        veiculoCor,     // recebe externo
        investTotal,    // resultado do somatório dos produtos
        listaMeses,     // lista de meses da proposta
        mesesUsados,    // [mes de iníco, mes final]
        listaRegras,    // recebe externo - todos os produtos e suas respectivas regras
        $escopoGeral,   // recebe externo - escopo onde os cards serao inseridos
        $escopoProdutos;     // recebe externo - escopo onde os cards serao inseridos
    var produtosAtivos = []; // array com os produtos ativos no card do veículo
    var selectProdutos = []; // array com os títulos dos produtos, para serem selecionados
    var contaProduto   = 0;  // contador de produtos criados
    var ativo = false;       // inicia ativo somente se tiver os dados carregados da base
       
    // propriedades públicas

    // construtor
    function CardVeiculo(id,logo,nome,cor,regras,escopo){
        veiculoID    = id;
        veiculoLogo  = logo;
        veiculoNome  = nome;
        veiculoCor   = cor;
        $escopoGeral = $(escopo);

        configuraRegras(regras);
    }

    // métodos privados
    function configuraRegras(regras){
        listaRegras = regras;

        // inicia gerando o select dos produtos
        for(var i=0; i<listaRegras.length; i++){
            var itemProduto = listaRegras[i];
            selectProdutos.push(itemProduto.nome);
        }
        // TESTE ///////////////////
        // inserirNovoProduto('Rede');
        ////////////////////////////

        // console.log('Montando selectProdutos: '+JSON.stringify(selectProdutos, null, 4));
        // console.log('Montando produtos com as regras: '+JSON.stringify(listaRegras, null, 4));
    }

    function inserirNovoProduto(produto){
        // localiza o produto dentro da lista de regras
        for(var i=0; i<listaRegras.length; i++){
            var itemProduto = listaRegras[i];

            if(itemProduto.nome == produto){ 
                console.log('segmentacoes para: '+produto+' >> '+JSON.stringify(itemProduto.segmentacoes, null, 4));
                var novoProduto = new ProdutoVeiculo(veiculoID+'-'+(++contaProduto) ,itemProduto.nome, itemProduto.segmentacoes, $escopoProdutos);
                produtosAtivos.push(novoProduto);
                console.log('produtos ativos '+produtosAtivos.length)
            }
        }
    }

    function renderContainerCard(){
        // monta select de produtos
        var listaPs = '<option value="">Incluir novo produto</option>';
        for(var i=0; i<selectProdutos.length; i++){ listaPs += '<option value="'+selectProdutos[i]+'">'+selectProdutos[i]+'</option>'; }

        var containerCard = `
        <div class="bloco-card" style="border-left:2px solid ${veiculoCor}">
            <div class="cabecalho-card">
                <div class="logo-veiculo">${veiculoLogo}</div>
                <div class="nome-veiculo">${veiculoNome} (<span id="#cab-veiculo-contagem-${veiculoID}">0</span>)</div>
                <div class="resumo-veiculo">
                    <div style="display:inline-block" id="cab-veiculo-periodo-${veiculoID}">10/10/17 a 10/11/17</div>
                    <div style="display:inline-block" id="cab-veiculo-investimento-${veiculoID}">R$ 00.000,00</div>
                    <div style="display:inline-block; margin-left:5px;">
                        <select id="select-veic-${veiculoID}">${listaPs}</select>
                    </div>
                </div>
            </div>
            <div id="container-produtos-${veiculoID}"></div>
        </div>
        `;
        $escopoGeral.append(containerCard);

        // ativa componentes
        $escopoProdutos = $('#container-produtos-'+veiculoID);

        $('#select-veic-'+veiculoID).on('change', function() { if(this.value != "") inserirNovoProduto( this.value );})
    }

    // métodos públicos
    CardVeiculo.prototype.getID    = function(){ return veiculoID; }
    CardVeiculo.prototype.getNome  = function(){ return veiculoNome; }
    CardVeiculo.prototype.getAtivo = function(){ return ativo; }
    
    CardVeiculo.prototype.ativar = function(meses,idProposta){
        console.log('no ativar...') 
        if(!meses) {
            console.log('ERR. >> Range de meses obrigatórios para ativação do card!');
            return;
        }
        
        listaMeses = meses;

        if(idProposta){
            // TODO //////////////////////////////////
        } else { 
            // insere container card
            renderContainerCard();
        }
    }

    CardVeiculo.prototype.salvar = function(){

    }

    CardVeiculo.prototype.excluir = function(){
        
    }

    CardVeiculo.prototype.reportar = function(){
        
    }

    // EVENTOS
    document.addEventListener('eventoExcluiProduto',function (e) {
        console.log("Excluindo "+e.detail.produtoID);

        for(var i=0; i<produtosAtivos.length; i++){
            var p = produtosAtivos[i];
            console.log('produto '+i+' ID :'+p.getID());
        }
        // 
    });

    // expoe construtor
    return CardVeiculo;
})();

