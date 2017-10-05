

// *********************************************************
// ****************** BOTÕES PRODUTO **********************
// *********************************************************
var BtVeiculo = (function(){
    // construtor
    function BtVeiculo(id,logo,nome,cor,status,escopo,baseHTML,veiculo){

        this._id       = id;
        this._logo     = logo;
        this._cor      = cor;
        this._nome     = nome;
        this._status   = status;
        this._baseHtml = baseHTML;
        this._$escopo  = $(escopo).append('<div id="btGeral-produto-'+id+'"></div>');

        this._btATIVO   = `
        <a class="btn btn-app ativo" style="border-bottom: 3px solid #6c00e9;">
            <img src="${baseHTML}imgs/${logo}-ativo.png">
        </a>
        `;
        
        this._btINATIVO = `
        <a id="btp-${id}" class="btn btn-app">
            <img src="${baseHTML}imgs/${logo}-inativo.png">
        </a>
        `;
        
        this._renderBt();
    }

    var fn = BtVeiculo.prototype;
   
    fn._renderBt = function(){
        var self = this;        
        this._$escopo.append(this._status ?  this.ativar() :  this.desativar());
    }

    fn.ativar = function(){
        this._status = 1;
        this._$escopo.empty();
        this._$escopo.append(this._btATIVO);
    }

    fn.desativar = function(){
        var self = this;
        this._status = 0;
        this._$escopo.empty();
        this._$escopo.append(this._btINATIVO);

        $('#btp-'+this._id).click(function() {
            if(!self._status){
                document.dispatchEvent(new CustomEvent("eventoCriaCard",{ "detail": {'veiculoID':self._id} }));
                self.ativar();
            }
            
        })
    }

    // expoe construtor
    return BtVeiculo;
})();



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

    // construtor
    function ProdutoVeiculo(idv, idp, nome, segmentacoes, escopo){
        this._veiculoID          = idv;
        this._produtoID          = idv+'-'+idp;
        this._produtoNome        = nome;
        this._$escopoProdutos    = escopo;
        this._listaSegmentacoes  = segmentacoes;
        this._descontoMaximo     = null;
        this._target             = null;
        this._praca              = null;
        this._formatoAtivo       = null;
        this._$elementoProduto   = null;
        this._selectSegmentacoes = [];
        this._listaFormatos      = [];
        this._selectFormatos     = [];
        this._listaPeriodos      = [];

        // elemento html do select de formatos
        this._$elmSelectFormatos = null;
        this._$elmDescontoMax    = null;

        console.log('***************************************');
        console.log('Criando produto '+this._produtoID+' :: '+nome);
        console.log('***************************************');
        
        this._configuraSegmentacoes();
    }

    var fn = ProdutoVeiculo.prototype;

    // métodos privados
    fn._configuraSegmentacoes = function(){
        this._selectSegmentacoes = [];

        for(var i=0; i< this._listaSegmentacoes.length; i++){
            var itemSegmentacao =  this._listaSegmentacoes[i];
             this._selectSegmentacoes.push(itemSegmentacao.nome);
        }

        this._renderProduto();
    }

    fn._ativarSegmentacao = function(segmentacao){ //console.log(this._produtoID+' :: segmentacao ativa '+segmentacao);
        // configura select de formatos    
        for(var i=0; i<this._listaSegmentacoes.length; i++){
            var seg = this._listaSegmentacoes[i];

            if(segmentacao == seg.nome){ console.log('dados seg : '+JSON.stringify(seg, null, 4));
                // monta select de formatos
                this._listaFormatos  = [];
                this._selectFormatos = [];

                for(var j=0; j<seg.formatos.length; j++){
                    var formato = seg.formatos[j];
                    this._listaFormatos.push(formato);
                    this._selectFormatos.push(formato.nome);
                }

                // aplica as opções de formatos
               var listaFrm = '';

                for(k=0; k<this._selectFormatos.length; k++){
                    var frms = this._selectFormatos[k];
                    listaFrm += '<option value="'+frms+'">'+frms+'</option>';
                }  
                
                this._$elmSelectFormatos.empty();
                this._$elmSelectFormatos.append(listaFrm);

                this._aplicarFormato(formato.nome);

                // console.log('Montando formatos: '+JSON.stringify(this._listaFormatos, null, 4));
            }
        }
    }

    fn._aplicarFormato = function(formato){ console.log('>>>> '+formato)
        for(var i=0; i<this._listaFormatos.length; i++){
            var frm = this._listaFormatos[i];
            if(formato == frm.nome){ console.log('desk max '+frm.descontoMax)

                // APLICA TODAS AS DEMAIS REGRAS DA SEGMENTAÇÃO
                this._formatoAtivo   = frm;
                this._descontoMaximo = frm.descontoMax;

                 // renderiza desconto máximo
                this._$elmDescontoMax.empty();
                this._$elmDescontoMax.append(frm.descontoMax+'%');
            }
        } 
        
        // aplica as regras aos períodos existentes
        if(this._listaPeriodos.length > 0){
            for(var i=0; i<this._listaPeriodos.length; i++){
                // TODO
            }
        }
        
        console.log('formato ATIVO: '+JSON.stringify(frm, null, 4));
    }


    fn._criarPeriodo = function(){
        this._listaPeriodos.push(new PeriodoProduto(this._formatoAtivo));
    }


    fn._renderProduto = function(){
        // monta select de produtos
        var listaSegs = '';

        for(var i=0; i<this._selectSegmentacoes.length; i++){ 
            var segs = this._selectSegmentacoes[i];
            listaSegs += '<option value="'+segs+'">'+segs+'</option>'; 
        }

        var containerProduto = `
        <div class="panel" id="el-produto-${this._produtoID}">
            <a class="panel-heading" role="tab" id="headingOne1" data-toggle="collapse" data-parent="#container-produtos-${this._produtoID}" href="#ac-${this._produtoID}" aria-expanded="true" aria-controls="collapseOne">
                <h4 class="panel-title" style="display:inline-block">${this._produtoNome}</h4>
            </a>

            <div class="resumo-veiculo" style="margin-top:-34px;">
                <div style="display:inline-block" id="cab-produto-periodo-${this._produtoID}">De --- a ---</div>
                <div style="display:inline-block">&nbsp | &nbsp  Investimento total: <span id="cab-produto-investimento-${this._produtoID}" style="font-weight:600; color:#738cb9">R$ 0,00</span></div>

                <div style="display:inline-block; margin-left:5px;" id="cab-produto-select-segmentacao-${this._produtoID}">
                    <select id="select-produto-segmentacao-${this._produtoID}" class="form-control select-menor">${listaSegs}</select>
                </div>
                <div id="btexcluir-produto-${this._produtoID}" class="bt-fechar" onclick="">X</div>
            </div>

            <div id="ac-${this._produtoID}" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                <div class="panel-body" style="padding: 7px 0;">
                    <div class="col-md-12 col-sm-12 col-xs-12 form-group" style="padding: 0;">
                        <label class="col-sm-1 colunas-label-produtos form-group" style="width: 35px;">Target</label>
                        <div class="col-sm-2 colunas-form-produtos form-group">
                            <input id="target-${this._produtoID}" type="text" placeholder="AB+18" class="form-control">
                        </div>
                        
                        <label class="col-sm-1 colunas-label-produtos form-group" style="width: 33px;">Praça</label>
                        <div class="col-sm-2 colunas-form-produtos form-group">
                            <input id="praca-${this._produtoID}" type="text" placeholder="AB+18" class="form-control">
                        </div>
                        
                        <label class="col-sm-1 colunas-label-produtos form-group" style="width: 47px;">Formato</label>
                        <div class="col-sm-2 colunas-form-produtos form-group">
                            <select id="formato-${this._produtoID}" class="form-control select-menor"></select>
                        </div>
                        
                        <label class="col-sm-1 colunas-label-produtos form-group" style="width: 82px;">Desc. máximo</label>
                        <div id="desconto-${this._produtoID}" class="col-sm-2 colunas-form-produtos form-group" style="font-weight:600; color:black; padding-top:4px; width: 15px; font-size:9pt;"></div>

                        <div class="col-sm-2 colunas-form-produtos form-group" style="padding-right: 0; position: relative; float: right;width: 95px;">
                            <button type="button" id="btn-insert-periodo-${this._produtoID}" class="btn btn-default" style="font-size: 8pt; color:#9c9b9b; float:right; margin-right:0; padding:5px 12px;">Inserir período</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        `;
        
        // ativa componentes
        this._$escopoProdutos.append(containerProduto);
        this._$elementoProduto   = $('#el-produto-'+this._produtoID);
        this._$elmSelectFormatos = $('#formato-'+this._produtoID);
        this._$elmDescontoMax    = $('#desconto-'+this._produtoID);
        // $escopoProdutos = $('#container-produtos-'+veiculoID);

        var self = this; //

        $('#select-produto-segmentacao-'+this._produtoID).on('change', function() { 
            if(this.value != ""){
                self._ativarSegmentacao(this.value);
            }
        })

        $('#formato-'+this._produtoID).on('change', function() { 
            if(this.value != ""){
                self._aplicarFormato(this.value);
            }
        })

        $('#btn-insert-periodo-'+this._produtoID).click(function() { 
            console.log('INSERINDO PERÍODO E APLICANDO REGRAS');
            // TODO
        })

        // var idp = this._produtoID;

        $('#btexcluir-produto-'+this._produtoID).click(function() { 
            document.dispatchEvent(new CustomEvent("eventoExcluiProduto",{ "detail": {'produtoID':self._produtoID} }));
        })

        // ativa a primeira segmentação
        this._ativarSegmentacao(this._selectSegmentacoes[0]);
    }

    fn.toogleAba = function(s){ // s == 'show' | 'hide'
        var $aba = $('#ac-'+this._produtoID);
        if(s == undefined){
            $aba.collapse('toggle');
        } else {
            $aba.collapse(s);
        }
    }

    fn.getID = function(){
        return this._produtoID;
    }

    fn.getDados = function(){
        
    }

    fn.excluir = function(){
        this._$elementoProduto.remove();
    }
    // expoe construtor
    return ProdutoVeiculo;
})();



// *********************************************************
// ******************** CARD VEÍCULO ***********************
// *********************************************************


var CardVeiculo = (function (){
    // construtor
    function CardVeiculo(id,logo,nome,cor,regras,status,escopo,escopoBt,baseHTML){
        this._veiculoID       = id;
        this._veiculoLogo     = logo;
        this._veiculoNome     = nome;
        this._veiculoCor      = cor;
        this._baseHtml        = baseHTML;
        this._investTotal     = null;   // resultado do somatório dos produtos
        this._listaMeses      = null;   // lista de meses da proposta
        this._mesesUsados     = null;   // [mes de iníco, mes final]
        this._listaRegras     = regras; // recebe externo - todos os produtos e suas respectivas regras
        this._$escopoProdutos = null;   // recebe externo - escopo onde os cards serao inseridos
        this._produtosAtivos  = [];     // array com os produtos ativos no card do veículo
        this._selectProdutos  = [];     // array com os títulos dos produtos, para serem selecionados
        this._contaProduto    = 0;      // contador de produtos criados
        this._ativo           = false;  // inicia ativo somente se tiver os dados carregados da base

        // referencias a componentes html
        this._$escopoGeral          = $(escopo);
        // this._$elmPeriodo           = null;
        // this._$elmInvestimentoTotal = null;
        // this._$elmTotalProdutos     = null;

        ///////////////////////////////////////////
        // EVENTOS ////////////////////////////////

        var self = this;

        document.addEventListener('eventoExcluiProduto',function (e) {
            var posProduto = -1;

            for(var i=0; i<self._produtosAtivos.length; i++){
                var p = self._produtosAtivos[i];

                if(e.detail.produtoID == p.getID()){
                    p.excluir();
                    self._produtosAtivos[i] = p = null;
                    posProduto = i;
                    
                }
            }

            // remove o produto do array de ativos
            if(posProduto > -1){
                self._produtosAtivos.splice(posProduto,1);
                self.atualizaDadosCabecalho('contagem',self._produtosAtivos.length);
            } 
        });

        document.addEventListener('eventoCriaCard',function (e) {
            if(e.detail.veiculoID == self._veiculoID){
                self.ativar(_MESES_PROPOSTA_);
            }
        });

        document.addEventListener('eventoExcluiCard',function (e) {
            if(e.detail.veiculoID == self._veiculoID){
                
            }
        });


        ////////////////////////////////////////////
        ////////////////////////////////////////////

        this._configuraRegras();

        // cria o botao do veículo
        this._btVeiculo = new BtVeiculo(id,logo,nome,cor,status,escopoBt,baseHTML);
    }

    var fn = CardVeiculo.prototype;

    // métodos privados
    fn._configuraRegras = function(){
        // inicia gerando o select dos produtos
        for(var i=0; i<this._listaRegras.length; i++){
            var itemProduto = this._listaRegras[i];
            this._selectProdutos.push(itemProduto.nome);
        }
    }

    fn._inserirNovoProduto = function(produto){
        // localiza o produto dentro da lista de regras
        for(var i=0; i<this._listaRegras.length; i++){
            var itemProduto = this._listaRegras[i];

            if(itemProduto.nome == produto){
                // fecha abas dos produtos abertos, se hovuer
                if(this._produtosAtivos.length>0){
                    for(var j=0; j<this._produtosAtivos.length; j++){
                        var p = this._produtosAtivos[j];
                        p.toogleAba('hide');
                    }
                }

                var novoProduto = new ProdutoVeiculo(this._veiculoID,++this._contaProduto ,itemProduto.nome, itemProduto.segmentacoes, this._$escopoProdutos);

                this._produtosAtivos.push(novoProduto);
                this.atualizaDadosCabecalho('contagem',this._produtosAtivos.length);
            }
        }
    }

    fn._renderContainerCard = function(){
        // monta select de produtos
        var self    = this;
        var listaPs = '<option value="">Incluir novo produto</option>';
       
        for(var i=0; i<this._selectProdutos.length; i++){ listaPs += '<option value="'+this._selectProdutos[i]+'">'+this._selectProdutos[i]+'</option>'; }

        var containerCard = `
        <div class="x_panel" style="border-left: 3px solid ${this._veiculoCor};">
            <div class="x_title">
                <img class="logo-ico-veiculo" src="${this._baseHtml}imgs/${this._veiculoLogo}-ativo.png">
                <h2>${this._veiculoNome} (&nbsp<span id="cab-veiculo-contagem-${this._veiculoID}" style="color:inherit; margin: 0 -2px 0 -2px;">0</span>&nbsp)</h2>
                <ul class="nav navbar-right panel_toolbox">
                    <li><a id="cl-${this._veiculoID}" class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                    </li>
                </ul>

                <div class="resumo-veiculo">
                    <div style="display:inline-block" id="cab-veiculo-periodo-${this._veiculoID}">De 10/10/17 a 10/11/17</div>
                    <div style="display:inline-block" > &nbsp | &nbsp  Investimento total: <span id="cab-veiculo-investimento-${this._veiculoID}" style="font-weight:600; color:#738cb9">R$ 0,00</span></div>
                    <div style="display:inline-block; margin-left:5px;">
                        <select class="form-control select-menor" id="select-veic-${this._veiculoID}">${listaPs}</select>
                    </div>
                </div>

                <div class="clearfix"></div>
            </div>
            <div class="x_content">
                <div id="container-produtos-${this._veiculoID}"  class="accordion" role="tablist" aria-multiselectable="true"></div>
            </div>
        </div>
        `;

       

        this._$escopoGeral.append(containerCard);

        // ativa componentes
        this._$escopoProdutos       = $('#container-produtos-'+this._veiculoID);
        // this._$elmPeriodo           = $('#cab-veiculo-periodo-'+this._veiculoID);
        // this._$elmInvestimentoTotal = $('#cab-veiculo-investimento-'+this._veiculoID);
        // this._$elmTotalProdutos     = $('#cab-veiculo-contagem-'+this._veiculoID);
        

        $('#select-veic-'+this._veiculoID).on('change', function() { 
            if(this.value != "") {
                self._inserirNovoProduto( this.value );
                $(this).val("").attr("selected", true);
            }
        })

        // chamada à função externa para ativar
        // a função de collapse do painel
        ativaColapsedPanel("#cl-"+this._veiculoID);
    }



    // métodos públicos
    fn.getID    = function (){ return this._veiculoID; }
    fn.getNome  = function (){ return this._veiculoNome; }
    fn.getAtivo = function (){ return this._ativo; }
    
    fn.ativar = function (meses,idProposta){
        if(!meses) {
            console.log('ERR. >> Range de meses obrigatórios para ativação do card!');
            return;
        }
        
        this._listaMeses = meses;

        if(idProposta){
            // TODO //////////////////////////////////
        } else { 
            // insere container card
            this._renderContainerCard();
        }
    }



    fn.atualizaDadosCabecalho = function(elm,info){
        // elm == 'periodo' | 'investimento' | 'contagem'
        $('#cab-veiculo-'+elm+'-'+this._veiculoID).empty();
        $('#cab-veiculo-'+elm+'-'+this._veiculoID).append(info);
    }
    
    fn.salvar = function(){}
    fn.excluir = function(){}
    fn.getDados = function(){}


    // expoe construtor
    return CardVeiculo;
})();

