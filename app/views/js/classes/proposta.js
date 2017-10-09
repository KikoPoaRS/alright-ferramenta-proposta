

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
    // construtor
    function PeriodoProduto(id, idp, regras, container){
        // objeto com as regras recebidas - nome | descontoMax | investMinimo | tipoCompra | CUB | CUL                     
        this._regrasPeriodo     = regras;
        this._produtoID         = idp;
        this._periodoID         = idp+'_'+id;
        this._$container        = $('#'+container);

        this._listaMeses        = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
        this._listaAnos         = [17,25]; // ano inicial e ano final. O algoritmo deverá fazer a interpolação entre os anos
        this._listaDiasMeses    = [31,28,31,30,31,30,31,31,30,31,30,31];
        this._selectMeses       = '';
        this._selectAnos        = '';
    
        // define valores default para mes ativo e ano ativo
        // this._mesAtivo          = this._listaMeses[parseInt((new Date).getMonth())];
        this._mesAtivo          = (new Date).getMonth()+1;
        this._anoAtivo          = String((new Date).getFullYear()).substring(2,4);
        this._diaInit           = (new Date).getDay();                  
        this._diaFim            = 15;   // valor default
        this._totalCustoBruto   = 0;
        this._volumeContratado  = 0;
        this._desconto          = null;
        this._CUB_N             = null;
        this._CUL_N             = null;
        this._totalCustoLiquido = null;
    
        // elementos html
        this._$elmLPERIODO      = null;
        this._$elmSelectAnos    = null;
        this._$elmSelectMeses   = null;
        this._$elmSliderDias    = null;
        this._$elmTotBruto      = null;
        this._$elmVolContratado = null;
        this._$elmTipoCompra    = null;
        this._$elmCUB           = null;
        this._$elmCUL           = null;
        this._$elmCUB_N         = null;
        this._$elmCUL_N         = null;
        this._$elmDesconto      = null;
        this._$elmTotLiquido    = null;
        
        // configura selects de meses e anos
        for(var i=0; i<this._listaMeses.length; i++){
            var mes = this._listaMeses[i];
            var selected = this._listaMeses[this._mesAtivo-1] == mes ? 'selected' : '';
            this._selectMeses += '<option value="'+mes+'" '+selected+'>'+mes+'</option>';
        }

        for(var i=this._listaAnos[0]; i<this._listaAnos[1]+1; i++){
            var anos = i;
            var selected = this._anoAtivo == anos ? 'selected' : '';
            this._selectAnos += '<option value="20'+anos+'"'+selected+'>'+anos+'</option>';;
        }

       //////////////////////////

        this._renderPeriodo();
    }

    var fn = PeriodoProduto.prototype;
    
    // métodos privados
    fn._anoBissexto = function(ano){ return ((parseInt(ano) % 4) == 0 && (parseInt(ano) % 100)!=0) || ((parseInt(ano) % 100)!=0 ) }

    fn._renderPeriodo = function(){
        var elemPeriodo = `
        <tr id="periodo-${this._periodoID}">
            <td style="padding-left:0; padding-right:0">
                <select id="per-select-mes-${this._periodoID}" class="form-control select-menor" style="width:43px; height:25px; padding-right:0">${this._selectMeses}</select>
            </td>
            <td style="padding-left:0">
                <select id="per-select-ano-${this._periodoID}" class="form-control select-menor" style="width:36px; height:25px;">${this._selectAnos}</select>
            </td>
            <td style="padding-bottom:0; min-width:120px;">
                <input type="text" id="per-slider-${this._periodoID}" name="per-slider-${this._periodoID}" value="" />
            </td>
            <td style="width:100px;"><input id="per-totbruto-${this._periodoID}" style="padding:5px; text-align:right;" type="text" class="form-control" value=""></td>
            <td style="text-align:center;"><span id="per-volcontratado-${this._periodoID}"></span></td>
            <td><span id="per-tipocompra-${this._periodoID}"></span></td>
            <td style="min-width:50px;">R$ <span id="per-CUB-${this._periodoID}"></span></td>
            <td style="min-width:50px;">R$ <span id="per-CUL-${this._periodoID}"></span></td>
            <td style="max-width:65px;"><input id="per-desconto-${this._periodoID}" type="text" class="form-control" value=""></td>
            <td style="min-width:50px;">R$ <span id="per-CUBN-${this._periodoID}"></span></td>
            <td style="min-width:50px;">R$ <span id="per-CULN-${this._periodoID}"></span></td>
            <td style="min-width: 85px;"><div style="color:black; font-weight:600">$R <span id="per-totliquido-${this._periodoID}"></span></div></td>
            <td class="bt-fechar-tabela"><div id="per-btexcluir-${this._periodoID}" class="bt-fechar tabela">X</div></td>
        </tr>
        `;

        this._$container.append(elemPeriodo);

        // atribui referencias dos elentos html
        this._$elmLPERIODO      = $('#periodo-'+this._periodoID);
        this._$elmSelectMeses   = $('#per-select-mes-'+this._periodoID);
        this._$elmSelectAnos    = $('#per-select-ano-'+this._periodoID);
        this._$elmSliderDias    = $('#per-slider-'+this._periodoID);
        this._$elmTotBruto      = $('#per-totbruto-'+this._periodoID);
        this._$elmVolContratado = $('#per-volcontratado-'+this._periodoID);
        this._$elmTipoCompra    = $('#per-tipocompra-'+this._periodoID);
        this._$elmCUB           = $('#per-CUB-'+this._periodoID);
        this._$elmCUL           = $('#per-CUL-'+this._periodoID);
        this._$elmCUB_N         = $('#per-CUBN-'+this._periodoID);
        this._$elmCUL_N         = $('#per-CULN-'+this._periodoID);
        this._$elmDesconto      = $('#per-desconto-'+this._periodoID);
        this._$elmTotLiquido    = $('#per-totliquido-'+this._periodoID);

        this._$elmTotBruto.mask('000.000.000,00', {reverse: true});
        this._$elmDesconto.mask('00,00', {reverse: true});

        this._$elmTotBruto.keyup(function() {
            // console.log('investimento '+this.value)
        });

        this._$elmTotBruto.keyup(function() {
            // console.log('desconto '+this.value)
        });

        // ativa slider de datas
        this._$elmSliderDias.ionRangeSlider({type: "double", min: 1, max: 31, from: this._diaInit, to: this._diaFim, onFinish: this._onSliderDias, self:this});// grid: true,
        this._atualizaInfosSliderDias();

        // ativa bt excluir
        var self = this;
        $('#per-btexcluir-'+this._periodoID).click(function() { console.log('clicando no excluir...'+self._periodoID)
            document.dispatchEvent(new CustomEvent("eventoExcluiPeriodo",{ "detail": {'periodoID':self._periodoID} }));
        })

        this._$elmSelectMeses.on('change', function() { 
            if(this.value != ""){
                self._mesAtivo = self._listaMeses.indexOf(this.value)+1;
                self._mesAtivo = self._mesAtivo < 10 ? '0'+self._mesAtivo : String(self._mesAtivo);
                self._atualizaInfosSliderDias();
            }
        })

        this._$elmSelectAnos.on('change', function() { 
            if(this.value != ""){
                self._anoAtivo = this.value;
                self._atualizaInfosSliderDias();
            }
        })

        // aplica regras
        this.aplicaRegras();
    }

    fn._atualizaInfosSliderDias = function(){
        var posmes  = this._listaMeses.indexOf(this._$elmSelectMeses.val());
        var diasmes = this._listaDiasMeses[posmes];

        if(posmes == 1 && this._anoBissexto(this._$elmSelectAnos.val())) diasmes = 29;
        if(this._diaFim > diasmes) this._diaFim = diasmes;
        
        var sliderDias = this._$elmSliderDias.data("ionRangeSlider");

        sliderDias.update({
           max:diasmes,
           to: this._diaFim,//    from: 1
       })

       // atualiza dados dos cabeçalhos
       document.dispatchEvent(new CustomEvent("eventoAtualizaCabecalhoProduto",{ "detail": {'periodoID':this._periodoID} }));
    }

    fn._onSliderDias = function(data){
        this.self._diaInit = data.from;
        this.self._diaFim = data.to;
        document.dispatchEvent(new CustomEvent("eventoAtualizaCabecalhoProduto",{ "detail": {'periodoID':this.self._periodoID} }));
    }

    fn.aplicaRegras = function(regras){
       if(regras) this._regrasPeriodo = regras;

       // executa os cálculas
       // TODO
       this._totalCustoBruto   = this._$elmTotBruto.val();
       this._volumeContratado  = 0;
       this._desconto          = this._$elmDesconto.val();;
       this._CUB_N             = 0;
       this._CUL_N             = 0;
       this._totalCustoLiquido = 0;

       // configura regras de dias dos meses
       this._atualizaInfosSliderDias();

       // renderiza infos nos elementos

       this._$elmVolContratado.empty();
       this._$elmVolContratado.append(this._formataDado(this._volumeContratado));

       this._$elmTipoCompra.empty();
       this._$elmTipoCompra.append(this._regrasPeriodo.tipoCompra);

       this._$elmCUB.empty();
       this._$elmCUB.append(this._formataDado(this._regrasPeriodo.CUB));

       this._$elmCUL.empty();
       this._$elmCUL.append(this._formataDado(this._regrasPeriodo.CUL));

       this._$elmCUB_N.empty();
       this._$elmCUB_N.append(this._formataDado(this._CUB_N));

       this._$elmCUL_N.empty();
       this._$elmCUL_N.append(this._formataDado(this._CUL_N));

       this._$elmTotLiquido.empty();
       this._$elmTotLiquido.append(this._formataDado(this._totalCustoLiquido));
    }

    fn._formataDado = function(dado, formato = 'R$', reverse = false){
        /**
         * dado: conteúdo a ser formatado
         * reverse: "desformata" o dado, tornando ele compatível ao cálculo
         * Tipo de formatoa aplciado ao dado
         */

        var saida = dado;
       
        if(formato == 'R$'){
            if(dado == '' || dado == undefined || dado == null || dado == 0){
                saida = reverse ? '0.0' : '0,00';
            } else {

                var nros = dado.split(reverse ? ',' : '.');
                var pre = '';
                var pos = '00';
                var saida = '';
                
                var sm = '.';
                var sf = reverse ? '.' : ',';
                
                if(String(nros[0]).length<4){
                    pre = nros[0];    
                } else {
                    if(reverse){
                        pre = String(nros[0]).replace(/\./g, '');
                    } else {
                         if(String(nros[0]).indexOf(",") >= 0){
                            pre = String(nros[0]).replace(/,/g, ".");
                        } else {
                            var p = String(nros[0]);
                            var conta = 0;
                            var final = '';
                            
                            for(var i=p.length-1; i>=0; i--){
                    
                                final = p.charAt(i)+final;
                                
                                if(++conta == 3){
                                    conta = 0;
                                    final = sm+final;
                                }
                            }
                            pre = final;
                        }
                    }
                
                   
                }
                
                if(nros[1]){
                    pos = nros[1];
                    if(String(nros[1]).length == 1) pos += "0";
                }
                
                saida = pre+sf+pos;
            }
        }
        return saida;
    }

    fn.salvar = function(){
        // TODO //////////////////////////////////
    }

    fn.excluir = function(){ 
        this._$elmLPERIODO.remove();
    }

    fn.getID = function (){ return this._periodoID; }

    fn.getDatas = function (){
        
        // this._mesAtivo          = this._listaMeses[parseInt((new Date).getMonth())];
        // this._anoAtivo          = String((new Date).getFullYear()).substring(2,4);
        // this._diaInit           = (new Date).getDay();                  
        // this._diaFim            = 15;   // valor default

        var p = {};
        var di = this._diaInit < 10 ? '0'+this._diaInit : this._diaInit;
        var df = this._diaFim < 10 ? '0'+this._diaFim : this._diaFim;

        p.diaInit  = di;
        p.diaFim   = df;
        p.mes      = this._mesAtivo;
        p.ano      = this._anoAtivo;
        p.fullInit = di+'/'+this._mesAtivo+'/'+this._anoAtivo;
        p.fullFim  = df+'/'+this._mesAtivo+'/'+this._anoAtivo;
        
        return p;
    }
    
    fn.getDados = function (){
        // TODO //////////////////////////////////
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
        this._dataInit           = '--';
        this._dataFim            = '--';

        // elementos html
        this._$elmSelectFormatos = null;
        this._$elmDescontoMax    = null;
        this._$elmTabelaPeriodos = null;
        this._$elmCabProdutoPer  = null;

        ///////////////////////////////////////////
        // EVENTOS ////////////////////////////////

        var self = this;
             
        document.addEventListener('eventoExcluiPeriodo',function (e) {
            var posPeriodo = -1;

            if(self._listaPeriodos.length == 1){
                callModalMenor('Este período não pode ser excluido!', 'Cada produto selecionado deve ter no mínimo um período definido.'); // chamada à função externa da modal
            } else {
                for(var i=0; i<self._listaPeriodos.length; i++){
                    var p = self._listaPeriodos[i];

                    if(e.detail.periodoID == p.getID()){
                        p.excluir();
                        self._listaPeriodos[i] = p = null;
                        posPeriodo = i;
                    }
                }

                // remove o período do array
                if(posPeriodo > -1){
                    self._listaPeriodos.splice(posPeriodo,1);
                    self.atualizaDadosCabecalho();
                } 
            }
        });

        document.addEventListener('eventoAtualizaCabecalhoProduto',function (e) {
            for(var i=0; i<self._listaPeriodos.length; i++){
                var p = self._listaPeriodos[i];
                
                if(e.detail.periodoID == p.getID()){
                    self.atualizaDadosCabecalho();
                    document.dispatchEvent(new CustomEvent("eventoAtualizaCabecalhoVeiculo",{ "detail": {'produtoID':self._produtoID} }));
                }
            }
        })
        
        
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

            if(segmentacao == seg.nome){ // console.log('dados seg : '+JSON.stringify(seg, null, 4));
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

                this._aplicarFormato(seg.formatos[0].nome);

                // console.log('Montando formatos: '+JSON.stringify(this._listaFormatos, null, 4));
            }
        }
    }

    fn._aplicarFormato = function(formato){ //console.log('>>>> '+formato)
        for(var i=0; i<this._listaFormatos.length; i++){
            var frm = this._listaFormatos[i];
            if(formato == frm.nome){ //console.log('nome: '+frm.nome+' | desk max '+frm.descontoMax)

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
        
        //console.log('formato ATIVO: '+JSON.stringify(frm, null, 4));
    }

    fn._criarPeriodo = function(){
        var novoPeriodo = new PeriodoProduto(this._listaPeriodos.length, this._produtoID, this._formatoAtivo, this._$elmTabelaPeriodos.attr('id'));
        this._listaPeriodos.push(novoPeriodo);
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
                <div class="panel-body" style="padding: 7px 0; height: 52px;">
                    <div class="col-md-12 col-sm-12 col-xs-12 form-group" style="padding: 0;">
                        <label class="col-sm-1 colunas-label-produtos form-group" style="width: 35px;">Target</label>
                        <div class="col-sm-2 colunas-form-produtos form-group">
                            <input id="target-${this._produtoID}" type="text" placeholder="Digite o target" class="form-control">
                        </div>
                        
                        <label class="col-sm-1 colunas-label-produtos form-group" style="width: 33px;">Praça</label>
                        <div class="col-sm-2 colunas-form-produtos form-group">
                            <input id="praca-${this._produtoID}" type="text" placeholder="Digite a praça" class="form-control">
                        </div>
                        
                        <label class="col-sm-1 colunas-label-produtos form-group" style="width: 47px;">Formato</label>
                        <div class="col-sm-2 colunas-form-produtos form-group">
                            <select id="formato-${this._produtoID}" class="form-control select-menor"></select>
                        </div>
                        
                        <label class="col-sm-1 colunas-label-produtos form-group" style="width: 82px;">Desc. máximo</label>
                        <div id="desconto-${this._produtoID}" class="col-sm-2 colunas-form-produtos form-group" style="font-weight:600; color:black; padding-top:4px; width: 15px; font-size:9pt;"></div>

                        <div class="col-sm-2 colunas-form-produtos form-group" style="padding-right: 0; position: relative; float: right;width: 95px;">
                            <button type="button" id="btn-insert-periodo-${this._produtoID}" class="btn btn-default" style="font-size: 8pt; color:#9c9b9b; float:right; margin-right:0; padding:4px 12px;">Inserir período</button>
                        </div>

                    </div>
                </div>

                <div class="container-periodos">
                    <table class="table">
                        <thead>
                            <tr>
                            <th style="width:47px; padding-right:0">Mês</th>
                            <th style="width:47px;">Ano</th>
                            <th>Dias</th>
                            <th style="min-width:85px;">Tot. bruto (R$)</th>
                            <th style="min-width:72px;">Vol. contrat.</th>
                            <th style="min-width: 76px;">Tipo compra</th>
                            <th>CUB*</th>
                            <th>CUL*</th>
                            <th style="min-width:65px;">Desc.(%)</th>
                            <th>CUBN*</th>
                            <th>CULN*</th>
                            <th>Tot. líquido</th>
                            <th class="bt-fechar-tabela"></th>
                            </tr>
                        </thead>
                        <tbody id="tabela-periodos-${this._produtoID}"></tbody>
                    </table>
                </div>

                <div class="infos-rodape-produto">
                * <strong>CUB</strong> : Custo Unitário Bruto  |  <strong>CUL</strong> : Custo Unitário Líquido  |  <strong>CUBN</strong> : Custo Unitário Bruto - Negociado  |  <strong>CULN</strong> : Custo Unitário Líquido - Negociado
                </div>

            </div>
        </div>
        `;
        
        // ativa componentes
        this._$escopoProdutos.append(containerProduto);
        this._$elementoProduto   = $('#el-produto-'+this._produtoID);
        this._$elmSelectFormatos = $('#formato-'+this._produtoID);
        this._$elmDescontoMax    = $('#desconto-'+this._produtoID);
        this._$elmTabelaPeriodos = $('#tabela-periodos-'+this._produtoID);
        this._$elmCabProdutoPer  = $('#cab-produto-periodo-'+this._produtoID);

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
            // TODO
            self._criarPeriodo();
        })

        // var idp = this._produtoID;

        $('#btexcluir-produto-'+this._produtoID).click(function() { 
            document.dispatchEvent(new CustomEvent("eventoExcluiProduto",{ "detail": {'produtoID':self._produtoID} }));
        })

        // ativa a primeira segmentação
        this._ativarSegmentacao(this._selectSegmentacoes[0]);
        this._criarPeriodo();
    }

    
    fn.atualizaDadosCabecalho = function(){ // console.log('atualizando dados cabecalho...')
        ////////////////////////////////////////////////
        // atualiza dados do período

        var dataInit, dataFim, di, df;

        for(var i=0; i<this._listaPeriodos.length; i++){
            var pr = this._listaPeriodos[i];
            var p = pr.getDatas();
            
            if(i == 0){
                dataInit = parseInt(p.ano+p.mes+p.diaInit);
                dataFim  = parseInt(p.ano+p.mes+p.diaInit);

                this._dataInit = p.fullInit;
                this._dataFim  = p.fullFim;

            } else {
                di = parseInt(p.ano+p.mes+p.diaInit);
                df = parseInt(p.ano+p.mes+p.diaInit);

                if(di < dataInit){
                    dataInit = di;
                    this._dataInit = p.fullInit;
                }

                if(df > dataFim){
                    dataFim = df;
                    this._dataFim  = p.fullFim;
                }
            }
        }

        // renderiza dados do período
        this._$elmCabProdutoPer.empty();
        this._$elmCabProdutoPer.append('De '+this._dataInit+' a '+this._dataFim);

        ////////////////////////////////////////////////
        // atualiza dados do período
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
                // TODO ////////////////////////////
            }
        });

        document.addEventListener('eventoAtualizaCabecalhoVeiculo',function (e) { console.log('no veiculo evento '+e.detail.produtoID)
            for(var i=0; i<self._produtosAtivos.length; i++){
                var p = self._produtosAtivos[i];

                if(e.detail.produtoID == p.getID()){
                    // TODO ////////////////////////////
                }
            }
        })

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
    
    
    fn.salvar = function(){
        // TODO //////////////////////////////////
    }

    fn.excluir = function(){
        // TODO //////////////////////////////////
    }

    fn.getID    = function (){ return this._veiculoID; }
    fn.getNome  = function (){ return this._veiculoNome; }
    fn.getAtivo = function (){ return this._ativo; }
    fn.getDados = function (){
        // TODO //////////////////////////////////
    }
    

    // expoe construtor
    return CardVeiculo;
})();

