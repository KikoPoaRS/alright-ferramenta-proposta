

function infosErros(tipoErro,refs = []){
    switch (tipoErro) {
        case 'target_praca': return 'Defina o target e a praça corretamente para o produto <strong>'+refs[0]+'</strong> do veículo <strong>'+refs[1]+'</strong>'; break;
        case 'total_bruto': return 'Defina um total bruto para o produto <strong>'+refs[0]+'</strong> do veículo <strong>'+refs[1]+'</strong>'; break;
    }
}

//////////////////////////////////////////////////////////////
// FUNÇÕES DE SUPORTE ////////////////////////////////////////

function excluirVeiculo(idv,nome){
    callModalMenor('CONFIRMA EXCLUIR VEÍCULO <strong>'+nome+'</strong>?', 
    'Todos os produtos e períodos do veículo selecionado serão excluidos imediatamente da tela de edição e da base de dados.',
    function(){document.dispatchEvent(new CustomEvent("eventoExcluiCard",{ "detail": {'veiculoID':idv} }));});
}


//////////////////////////////////////////////////////////////
// CLASSES DE CONTROLE ///////////////////////////////////////

// *********************************************************
// ****************** BOTÕES PRODUTO ***********************
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
        
        $(escopo).append('<div id="btGeral-produto_'+id+'"></div>');
        
        this._$escopo  = $('#btGeral-produto_'+id);

        this._btATIVO  = `
        <a class="btn btn-app ativo" style="border-bottom: 3px solid ${cor};">
            <img src="${baseHTML}imgs/${logo.ativo}">
        </a>
        `;
        
        this._btINATIVO = `
        <a id="btp_${id}" class="btn btn-app">
            <img src="${baseHTML}imgs/${logo.inativo}">
        </a>
        `;
        
        this._renderBt();
    }

    var fn = BtVeiculo.prototype;
   
    fn._renderBt = function(){  
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

        $('#btp_'+this._id).click(function() {

            if(IDProposta == 0){
                chamaModalFeedback('NÃO FOI POSSÍVEL INCLUIR VEÍCULO!','Para incluir um novo veículo é necessário antes salvar os DADOS GERAIS da proposta!');
            } else {
                if(!self._status){
                    document.dispatchEvent(new CustomEvent("eventoCriaCard",{ "detail": {'veiculoID':self._id} }));
                    self.ativar();
                }
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
    function PeriodoProduto(vid, linha, grupo, idproduto, regras, container, idTabela = 0){
        // objeto com as regras recebidas - id | nome | descontoMax | investMinimo | tipoCompra | CUB | CUL                     
        this._veiculoID         = vid;
        this._regrasPeriodo     = regras;
        this._regrasPeriodo.CUB = parseFloat(formataDado(this._regrasPeriodo.CUB,'R$',true));
        this._produtoID         = idproduto;
        this._grupo             = grupo;
        this._linha             = linha;
        this._periodoID         = idproduto+'_'+linha; // id do elemento html
        this._periodoIDtabela   = idTabela; // id do registro na tabela
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
        this._diaFim            = (new Date).getDay() <= 15 ? 15 : this._listaDiasMeses[this._mesAtivo-1];   // valor default
        this._totalCustoBruto   = 0;
        this._volumeContratado  = 0;
        this._desconto          = 0;
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
        <tr id="periodo_${this._periodoID}">
            <td style="padding-left:0; padding-right:0">
                <select id="per-select-mes_${this._periodoID}" class="form-control select-menor" style="width:43px; height:25px; padding-right:0">${this._selectMeses}</select>
            </td>
            <td style="padding-left:0">
                <select id="per-select-ano_${this._periodoID}" class="form-control select-menor" style="width:36px; height:25px;">${this._selectAnos}</select>
            </td>
            <td style="padding-bottom:0; min-width:120px;">
                <input type="text" id="per-slider_${this._periodoID}" name="per-slider_${this._periodoID}" value="" />
            </td>
            <td style="width:100px;"><input id="per-totbruto_${this._periodoID}" style="padding:5px; text-align:right;" type="text" class="form-control" value=""></td>
            <td style="text-align:center;"><span id="per-volcontratado_${this._periodoID}"></span></td>
            <td><span id="per-tipocompra_${this._periodoID}"></span></td>
            <td style="min-width:50px;">R$ <span id="per-CUB_${this._periodoID}"></span></td>
            <td style="min-width:50px;">R$ <span id="per-CUL_${this._periodoID}"></span></td>
            <td style="max-width:65px;"><input id="per-desconto_${this._periodoID}" type="text" class="form-control" value="" style="width:55px;"></td>
            <td style="min-width:50px;">R$ <span id="per-CUBN_${this._periodoID}"></span></td>
            <td style="min-width:50px;">R$ <span id="per-CULN_${this._periodoID}"></span></td>
            <td style="min-width: 85px;"><div style="color:black; font-weight:600">R$ <span id="per-totliquido_${this._periodoID}"></span></div></td>
            <td class="bt-fechar-tabela"><div  id="per-btexcluir_${this._periodoID}" class="bt-fechar tabela">X</div></td>
        </tr>
        `;

        this._$container.append(elemPeriodo);

        // atribui referencias dos elentos html
        this._$elmLPERIODO      = $('#periodo_'+this._periodoID);
        this._$elmSelectMeses   = $('#per-select-mes_'+this._periodoID);
        this._$elmSelectAnos    = $('#per-select-ano_'+this._periodoID);
        this._$elmSliderDias    = $('#per-slider_'+this._periodoID);
        this._$elmTotBruto      = $('#per-totbruto_'+this._periodoID);
        this._$elmVolContratado = $('#per-volcontratado_'+this._periodoID);
        this._$elmTipoCompra    = $('#per-tipocompra_'+this._periodoID);
        this._$elmCUB           = $('#per-CUB_'+this._periodoID);
        this._$elmCUL           = $('#per-CUL_'+this._periodoID);
        this._$elmCUB_N         = $('#per-CUBN_'+this._periodoID);
        this._$elmCUL_N         = $('#per-CULN_'+this._periodoID);
        this._$elmDesconto      = $('#per-desconto_'+this._periodoID);
        this._$elmTotLiquido    = $('#per-totliquido_'+this._periodoID);

        this._$elmTotBruto.mask('000.000.000,00', {reverse: true});
        this._$elmDesconto.mask('00,00', {reverse: true});

        // eventos de controles
        var self = this;

        document.addEventListener('aplicaRegrasProdutoss',function (e) {
            // e.detail.periodoID)
            self.aplicaRegras();
        });
        
        this._$elmTotBruto.keyup(function() {
           var valor = this.value;
            if( valor == '') valor = '0';
            self._totalCustoBruto = parseFloat(formataDado(valor, 'R$', true));
            self.aplicaRegras();
            document.dispatchEvent(new CustomEvent("eventoAtualizaCabecalhoProduto",{ "detail": {'periodoID':self._periodoID} }));
        });

        this._$elmDesconto.keyup(function() {
            var valor = this.value;
            if( valor == '') valor = '0';
            self._desconto = parseFloat(formataDado(valor, 'R$', true));
            self.aplicaRegras();
            document.dispatchEvent(new CustomEvent("eventoAtualizaCabecalhoProduto",{ "detail": {'periodoID':self._periodoID} }));
        });

        this._$elmDesconto.blur(function(){
            var dmax = parseFloat(formataDado(self._regrasPeriodo.descontoMax,'R$',true));
            if(parseFloat(self._desconto)>dmax){
                self._desconto = dmax;
                self._$elmDesconto.val(self._regrasPeriodo.descontoMax);
                // chamas modal de alert para aviso sobre limite de desconto
                callModalMenor('ATENÇÃO : Limite de desconto excedido!', 'O desconto máximo a ser aplicado ao cliente deve ser de <strong>'+self._regrasPeriodo.descontoMax+'%<strong>');
            }
        })

        // ativa slider de datas
        this._$elmSliderDias.ionRangeSlider({type: "double", min: 1, max: 31, from: this._diaInit, to: this._diaFim, onFinish: this._onSliderDias, self:this});// grid: true,
        this._atualizaInfosSliderDias();

        // ativa bt excluir
       
        $('#per-btexcluir_'+this._periodoID).click(function() {
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
        if(regras) {
            this._regrasPeriodo = regras;
            this._regrasPeriodo.CUB =  parseFloat(formataDado(this._regrasPeriodo.CUB,'R$',true));
        }

        var descontoCliente = $inputDescClientes.val() == 0 || $inputDescClientes.val() == '' ? 20 : parseFloat(formataDado($inputDescClientes.val(),'R$',true));
        // executa os cálculas                  
        // this._regrasPeriodo.nome | .descontoMax | .investMinimo | .tipoCompra | .CUB | .CUL
        this._totalCustoBruto   = this._$elmTotBruto.val() == '' ? 0 : parseFloat(formataDado(this._$elmTotBruto.val(),'R$',true));
        this._desconto          = this._$elmDesconto.val() == '' ? 0 : parseFloat(formataDado(this._$elmDesconto.val(),'R$',true));
        this._regrasPeriodo.CUL = (this._regrasPeriodo.CUB * (1-(descontoCliente/100))).toFixed(2);
        this._CUB_N             = (this._regrasPeriodo.CUB * (1-(this._desconto/100))).toFixed(2);
        this._CUL_N             = (this._regrasPeriodo.CUL * (1-(this._desconto/100))).toFixed(2);
        this._totalCustoLiquido = (this._totalCustoBruto   * (1-(descontoCliente/100))).toFixed(2);
        this._volumeContratado  = parseInt(Math.round(this._totalCustoBruto / this._CUB_N) * this._regrasPeriodo.tipoCompra[1]);

        // configura regras de dias dos meses
        this._atualizaInfosSliderDias();

        // renderiza infos nos elementos

        this._$elmVolContratado.empty();
        this._$elmVolContratado.append(formataDado(this._volumeContratado,'int'));

        this._$elmTipoCompra.empty();
        this._$elmTipoCompra.append(this._regrasPeriodo.tipoCompra[0]);

        this._$elmCUB.empty();
        this._$elmCUB.append(formataDado(this._regrasPeriodo.CUB));

        this._$elmCUL.empty();
        this._$elmCUL.append(formataDado(this._regrasPeriodo.CUL));

        this._$elmCUB_N.empty();
        this._$elmCUB_N.append(formataDado(this._CUB_N));

        this._$elmCUL_N.empty();
        this._$elmCUL_N.append(formataDado(this._CUL_N));

        this._$elmTotLiquido.empty();
        this._$elmTotLiquido.append(formataDado(this._totalCustoLiquido));
    }

    // fn.salvar = function(vid,target,praca){
    // }

    // fn._onDadosSalvos = function(data){
    // }

    fn.excluir = function(){ 
        this._$elmLPERIODO.remove();
    }

    fn.getDados = function (target,praca){
        // TODO //////////////////////////////////
        var dadosPeriodo = {};
        var datas = this.getDatas(true);

        dadosPeriodo.idPeriodo    = this._periodoIDtabela;
        dadosPeriodo.idProposta   = IDProposta;
        dadosPeriodo.idVeiculo    = this._veiculoID;
        dadosPeriodo.idRegras     = this._regrasPeriodo.id;
        dadosPeriodo.grupo        = this._grupo;
        dadosPeriodo.linha        = this._linha;
        dadosPeriodo.target       = target;
        dadosPeriodo.praca        = praca;
        dadosPeriodo.dataInit     = datas.fullInit; 
        dadosPeriodo.dataFim      = datas.fullFim; 
        dadosPeriodo.totalBruto   = this._totalCustoBruto;
        dadosPeriodo.totalLiquido = this._totalCustoLiquido;
        dadosPeriodo.desconto     = parseFloat(this._desconto);

        if(dadosPeriodo.totalBruto == '' || dadosPeriodo.totalBruto == 0) return false;

        return dadosPeriodo;
    }

    fn.getID = function (){ return this._periodoID; }

    fn.getDatas = function (salvar = false){
        var p = {};
        var di = this._diaInit < 10 ? '0'+this._diaInit : this._diaInit;
        var df = this._diaFim < 10 ? '0'+this._diaFim : this._diaFim;

        p.diaInit  = di;
        p.diaFim   = df;
        p.mes      = this._mesAtivo;
        p.ano      = this._anoAtivo;

        if(salvar){
            p.fullInit = this._anoAtivo+'/'+this._mesAtivo+'/'+di;
            p.fullFim  = this._anoAtivo+'/'+this._mesAtivo+'/'+df;
        } else {
            p.fullInit = di+'/'+this._mesAtivo+'/'+this._anoAtivo;
            p.fullFim  = df+'/'+this._mesAtivo+'/'+this._anoAtivo;
        }

        return p;
    }

    fn.getInvestimento = function(){ return this._totalCustoBruto; }

    fn.getDesconto = function(){ return this._desconto; }
    
    fn.getIDtabela = function(){ return this._periodoIDtabela; }
    

    // expoe construtor
    return PeriodoProduto;
})();





// *********************************************************
// ****************** PRODUTO VEÍCULO **********************
// *********************************************************

var ProdutoVeiculo = (function(){

    // construtor
    function ProdutoVeiculo(idv, nomev, idp, nome, segmentacoes, escopo){
        this._veiculoID          = idv;
        this._veiculoNome        = nomev;
        this._grupo              = idp;
        this._produtoID          = idv+'_'+idp;
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
        this._investimentoTotal  = 0;
        this._contaPeriodos      = 0;

        // elementos html
        this._$elmSelectFormatos = null;
        this._$elmDescontoMax    = null;
        this._$elmTabelaPeriodos = null;
        this._$elmCabProdutoPer  = null;
        this._$elmCabProdutoInv  = null;
        this._$elmTarget         = null;
        this._$elmPraca          = null;

        ///////////////////////////////////////////
        // EVENTOS ////////////////////////////////

        var self = this;
             
        document.addEventListener('eventoExcluiPeriodo',function (e) {
            var posPeriodo = -1;

            if(self._listaPeriodos.length == 1){
                callModalMenor('ESTE PERÍODO NÃO PODE SER EXCLUIDO!', 'Cada produto selecionado deve ter no mínimo um período definido.'); // chamada à função externa da modal
            } else {
                callModalMenor('CONFIRMA EXCLUIR PERÍODO?', 
                'Os dados relativos a este período serão excluidos imediatamente da tela de edição e da base de dados.',
                function(){self._excluiPeriodos(e.detail.periodoID)});
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
        this.atualizaDadosCabecalho();

    }

    var fn = ProdutoVeiculo.prototype;

    // métodos privados
    fn._excluiPeriodos = function(idp){
        if(this._listaPeriodos.length > 0){
            for(var i=0; i<this._listaPeriodos.length; i++){
                var p = this._listaPeriodos[i];

                if(!idp || idp == p.getID()){
                    // REMOVE DO BANCO
                    if(p.getIDtabela() != 0){

                    }

                    p.excluir();
                    this._listaPeriodos[i] = p = null;
                    posPeriodo = i;

                }
            }

            // remove o período do array
            if(!idp){
                this._listaPeriodos = [];
            } else {
                if(posPeriodo > -1) this._listaPeriodos.splice(posPeriodo,1);
            }
            
            this.atualizaDadosCabecalho();
        }
    }

    fn._configuraSegmentacoes = function(){
        this._selectSegmentacoes = [];

        for(var i=0; i< this._listaSegmentacoes.length; i++){
            var itemSegmentacao =  this._listaSegmentacoes[i];
             this._selectSegmentacoes.push(itemSegmentacao.nome);
        }

        this._renderProduto();
    }

    fn._ativarSegmentacao = function(segmentacao){ 
        //console.log(this._produtoID+' :: segmentacao ativa '+segmentacao);
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
        var novoPeriodo = new PeriodoProduto(this._veiculoID, ++this._contaPeriodos, this._grupo, this._produtoID, this._formatoAtivo, this._$elmTabelaPeriodos.attr('id'),0);
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
        <div class="panel" id="el-produto_${this._produtoID}">
            <a class="panel-heading" role="tab" id="cab-a-produto_${this._produtoID}" data-toggle="collapse" data-parent="#container-produtos_${this._produtoID}" href="#ac_${this._produtoID}" aria-expanded="true" aria-controls="ac_${this._produtoID}">
                <h4 class="panel-title" style="display:inline-block">${this._produtoNome}</h4>
            </a>

            <div class="resumo-veiculo" style="margin-top:-34px;">
                <div style="display:inline-block" id="cab-produto-periodo_${this._produtoID}">De --- a ---</div>
                <div style="display:inline-block">&nbsp | &nbsp  Investimento total: R$ <span id="cab-produto-investimento_${this._produtoID}" style="font-weight:600; color:#738cb9">0,00</span></div>

                <div style="display:inline-block; margin-left:5px;" id="cab-produto-select-segmentacao_${this._produtoID}">
                    <select id="select-produto-segmentacao_${this._produtoID}" class="form-control select-menor">${listaSegs}</select>
                </div>
                <div id="btexcluir-produto_${this._produtoID}" class="bt-fechar">X</div>
            </div>

            <div id="ac_${this._produtoID}" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="cab-a-produto_${this._produtoID}">
                <div class="panel-body" style="padding: 7px 0; height: 52px;">
                    <div class="col-md-12 col-sm-12 col-xs-12 form-group" style="padding: 0;">
                        <label class="col-sm-1 colunas-label-produtos form-group" style="width: 35px;">Target</label>
                        <div class="col-sm-2 colunas-form-produtos form-group">
                            <input id="target_${this._produtoID}" type="text" placeholder="Digite o target" class="form-control">
                        </div>
                        
                        <label class="col-sm-1 colunas-label-produtos form-group" style="width: 33px;">Praça</label>
                        <div class="col-sm-2 colunas-form-produtos form-group">
                            <input id="praca_${this._produtoID}" type="text" placeholder="Digite a praça" class="form-control">
                        </div>
                        
                        <label class="col-sm-1 colunas-label-produtos form-group" style="width: 47px;">Formato</label>
                        <div class="col-sm-2 colunas-form-produtos form-group">
                            <select id="formato-pr_${this._produtoID}" class="form-control select-menor"></select>
                        </div>
                        
                        <label class="col-sm-1 colunas-label-produtos form-group" style="width: 82px;">Desc. máximo</label>
                        <div id="desconto_${this._produtoID}" class="col-sm-2 colunas-form-produtos form-group" style="font-weight:600; color:black; padding-top:4px; width: 15px; font-size:9pt;"></div>

                        <div class="col-sm-2 colunas-form-produtos form-group" style="padding-right: 0; position: relative; float: right;width: 95px;">
                            <button type="button" id="btn-insert-periodo_${this._produtoID}" class="btn btn-default" style="font-size: 8pt; color:#9c9b9b; float:right; margin-right:0; padding:4px 12px; height:25px;">Inserir período</button>
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
                        <tbody id="tabela-periodos_${this._produtoID}"></tbody>
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
        this._$elementoProduto   = $('#el-produto_'+this._produtoID);
        this._$elmSelectFormatos = $('#formato-pr_'+this._produtoID);
        this._$elmTarget         = $('#target_'+this._produtoID);
        this._$elmPraca          = $('#praca_'+this._produtoID);
        this._$elmDescontoMax    = $('#desconto_'+this._produtoID);
        this._$elmTabelaPeriodos = $('#tabela-periodos_'+this._produtoID);
        this._$elmCabProdutoPer  = $('#cab-produto-periodo_'+this._produtoID);
        this._$elmCabProdutoInv  = $('#cab-produto-investimento_'+this._produtoID);

        var self = this; //

        $('#select-produto-segmentacao_'+this._produtoID).on('change', function() { 
            if(this.value != ""){
                self._ativarSegmentacao(this.value);
            }
        })

        $('#formato_'+this._produtoID).on('change', function() { 
            if(this.value != ""){
                self._aplicarFormato(this.value);
            }
        })

        $('#btn-insert-periodo_'+this._produtoID).click(function() { 
            // TODO
            self._criarPeriodo();
        })

        // var idp = this._produtoID;

        $('#btexcluir-produto_'+this._produtoID).click(function() { 
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

        this._investimentoTotal = 0;

        for(var i=0; i<this._listaPeriodos.length; i++){
            var pr = this._listaPeriodos[i];
            var p = pr.getDatas();
            
            if(i == 0){
                dataInit = parseInt(p.ano+p.mes+p.diaInit);
                dataFim  = parseInt(p.ano+p.mes+p.diaFim);

                this._dataInit = p.fullInit;
                this._dataFim  = p.fullFim;

            } else {
                di = parseInt(p.ano+p.mes+p.diaInit);
                df = parseInt(p.ano+p.mes+p.diaFim);

                if(di < dataInit){
                    dataInit = di;
                    this._dataInit = p.fullInit;
                }

                if(df > dataFim){
                    dataFim = df;
                    this._dataFim  = p.fullFim;
                }
            }

            // soma os custos brutos
            this._investimentoTotal  += parseFloat(isNaN(pr.getInvestimento())?0:pr.getInvestimento()); 
        }

        this._investimentoTotal = this._investimentoTotal.toFixed(2);

        // renderiza dados do período
        this._$elmCabProdutoPer.empty();
        this._$elmCabProdutoPer.append('De '+this._dataInit+' a '+this._dataFim);
        
        this._$elmCabProdutoInv.empty();
        this._$elmCabProdutoInv.append(formataDado(this._investimentoTotal));

        ////////////////////////////////////////////////
        // atualiza dados do período
    }
    

    fn.toogleAba = function(s){ // s == 'show' | 'hide'
        var $aba = $('#ac_'+this._produtoID);
        if(s == undefined){
            $aba.collapse('toggle');
        } else {
            $aba.collapse(s);
        }
    }

    fn.getID = function(){ return this._produtoID; }

    fn.getDados = function(){ 
        this._target = this._$elmTarget.val();
        this._praca = this._$elmPraca.val();

        if(this._target == '' || this._praca == '') return {erro:infosErros('target_praca',[this._produtoNome,this._veiculoNome])};
        
        var DADOS = [];
        
        if(this._listaPeriodos.length > 0){
            for(var i=0; i<this._listaPeriodos.length; i++){
                var p = this._listaPeriodos[i];
                var dados = p.getDados(this._target,this._praca);

                if(dados){
                    DADOS.push(dados);
                } else {
                    return {erro:infosErros('total_bruto',[this._produtoNome,this._veiculoNome])};
                }
            }
        }

        return DADOS;
    }

    fn.getDatas = function(){
        return {dataInit:this._dataInit, dataFim:this._dataFim};
    }

    fn.getInvestimento = function(){
        return this._investimentoTotal;
    }

    fn.excluirProduto = function(){
        this._excluiPeriodos();
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
        this._listaRegras     = regras; // recebe externo - todos os produtos e suas respectivas regras
        this._$escopoProdutos = null;   // recebe externo - escopo onde os cards serao inseridos
        this._$painelXCard    = null;   // 
        this._produtosAtivos  = [];     // array com os produtos ativos no card do veículo
        this._selectProdutos  = [];     // array com os títulos dos produtos, para serem selecionados
        this._contaProduto    = 0;      // contador de produtos criados
        this._ativo           = false;  // inicia ativo somente se tiver os dados carregados da base
        this._dataInit           = '--';
        this._dataFim            = '--';
        this._investimentoTotal  = 0;

        // referencias a componentes html
        this._$escopoGeral       = $(escopo);
        // this._$elmPeriodo           = null;
        // this._$elmInvestimentoTotal = null;
        // this._$elmTotalProdutos     = null;

        ///////////////////////////////////////////
        // EVENTOS ////////////////////////////////

        var self = this;

        document.addEventListener('eventoExcluiProduto',function (e) {
            self._excluiProdutos(e.detail.produtoID);
        });

        document.addEventListener('eventoCriaCard',function (e) {
            if(e.detail.veiculoID == self._veiculoID){
                self.ativar();
            }
        });

        document.addEventListener('eventoExcluiCard',function (e) {
            if(e.detail.veiculoID == self._veiculoID){
                self._excluiProdutos();
                self.excluir();
            }
        });

        document.addEventListener('eventoAtualizaCabecalhoVeiculo',function (e) { //console.log('no veiculo evento '+e.detail.produtoID)
            for(var i=0; i<self._produtosAtivos.length; i++){
                var p = self._produtosAtivos[i];

                if(e.detail.produtoID == p.getID()){
                    // TODO ////////////////////////////
                }
            }
            self.atualizaDadosCabecalho();
        })

        ////////////////////////////////////////////
        ////////////////////////////////////////////

        this._configuraRegras();

        // cria o botao do veículo
        this._btVeiculo = new BtVeiculo(id,logo,nome,cor,status,escopoBt,baseHTML);

        // se tiver status ativo carrega dados 
        if(status)_carregaDadosVeiculos();
    }

    var fn = CardVeiculo.prototype;

    // métodos privados
    fn._carregaDadosVeiculo = function(){
        var DADOS {};
        
        DADOS.carregaVeiculo = 1;
        DADOS.IDVeiculo      = this._veiculoID;
        DADOS.IDProposta     = this.IDProposta;

        $.ajax({
            type: 'POST',
            dataType: "json",
            url: arqCriaEdita,
            data: DADOS,
            cache: false,
            success: this._onDadosCarregados,
            error: function(errorThrown){
                console.log("Falha no AJAX! -- envio de dados página");
                // str = JSON.stringify(errorThrown, null, 4);
                // console.log('+++ '+errorThrown.responseText);
                var saidaErr = _.unescape(errorThrown.responseText); 
                window.open('about:blank').document.body.innerHTML = saidaErr;
            } 
        });
    }

    fn._onDadosCarregados = function(data){
        if(!data.erro){
            this.ativar();

            // IMPLEMENTAR CARREGAMENTO DOS DADOS DE PRODUTOS E PERÍODOS

        } else {

        }
        
    }

    fn._excluiProdutos = function(idp){
        var posProduto = -1;
        
        for(var i=0; i<this._produtosAtivos.length; i++){
            var p = this._produtosAtivos[i];

            if(!idp || idp == p.getID()){
                p.excluirProduto();
                this._produtosAtivos[i] = p = null;
                posProduto = i;
            }
        }

        // remove o produto do array de ativos
        if(!idp){
            this._produtosAtivos = [];
        } else {
            if(posProduto > -1) this._produtosAtivos.splice(posProduto,1);
        }
        
        this.atualizaDadosCabecalho();
    }

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

                var novoProduto = new ProdutoVeiculo(this._veiculoID, this._veiculoNome, ++this._contaProduto ,itemProduto.nome, itemProduto.segmentacoes, this._$escopoProdutos);

                this._produtosAtivos.push(novoProduto);
                this.atualizaDadosCabecalho();
            }
        }
    }

    fn._renderContainerCard = function(){
        // monta select de produtos
        var self    = this;
        var listaPs = '<option value="">Incluir novo produto</option>';
       
        for(var i=0; i<this._selectProdutos.length; i++){ listaPs += '<option value="'+this._selectProdutos[i]+'">'+this._selectProdutos[i]+'</option>'; }

        var containerCard = `
        <div id="painel-x-card_${this._veiculoID}" class="x_panel" style="border-left: 3px solid ${this._veiculoCor};">
            <div class="x_title">
                <img class="logo-ico-veiculo" src="${this._baseHtml}imgs/${this._veiculoLogo.ativo}">
                <h2>${this._veiculoNome} (&nbsp<span id="cab-veiculo-contagem_${this._veiculoID}" style="color:inherit; margin: 0 -2px 0 -2px;">0</span>&nbsp)</h2>
                <ul class="nav navbar-right panel_toolbox">
                    <li><a id="cl_${this._veiculoID}" class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                    </li>
                </ul>

                <div class="resumo-veiculo">
                    <div style="display:inline-block" id="cab-veiculo-periodo_${this._veiculoID}">De 10/10/17 a 10/11/17</div>
                    <div style="display:inline-block" > &nbsp | &nbsp  Investimento total: R$ <span id="cab-veiculo-investimento_${this._veiculoID}" style="font-weight:600; color:#738cb9">0,00</span></div>
                    <div style="display:inline-block; margin-left:5px;">
                        <select class="form-control select-menor" id="select-veic_${this._veiculoID}">${listaPs}</select>
                    </div>
                </div>

                <div class="clearfix"></div>
            </div>
            <div class="x_content">
                <div id="container-produtos_${this._veiculoID}"  class="accordion" role="tablist" aria-multiselectable="true"></div>

                <div class="col-xs-12" style="margin: 6px 0 -6px 0; padding-right:0;">
                    <button class="btn btn-primary" style="float:right; font-size: 9pt; margin-left:5px;" type="button" onclick="salvarProposta()">Salvar veículo</button>
                    <button class="btn btn-danger" style="float:right; font-size: 9pt;" type="button" onclick="excluirVeiculo(${this._veiculoID},'${this._veiculoNome}')">Excluir veículo</button>
                </div>
            </div>
        </div>
        `;

        this._$escopoGeral.append(containerCard);

        // ativa componentes
        this._$escopoProdutos = $('#container-produtos_'+this._veiculoID);
        this._$painelXCard    = $('#painel-x-card_'+this._veiculoID);
       
        $('#select-veic_'+this._veiculoID).on('change', function() { 
            if(this.value != "") {
                self._inserirNovoProduto( this.value );
                $(this).val("").attr("selected", true);
            }
        })

        // chamada à função externa para ativar
        // a função de collapse do painel
        ativaColapsedPanel("#cl_"+this._veiculoID);
    }



    // métodos públicos
   fn.ativar = function (){
        this._ativo = true;
        this._renderContainerCard();
    }


    fn.atualizaDadosCabecalho = function(){
        // this._produtosAtivos
        var dataInit, dataFim, di, df;
        this._investimentoTotal = 0;
        
        for(var i=0; i<this._produtosAtivos.length; i++){
            var pr = this._produtosAtivos[i];
            var datas = pr.getDatas(); 
            var arDi = datas.dataInit.split('/');
            var arDf = datas.dataFim.split('/');
        
            if(i == 0){
                dataInit = parseInt(arDi[2]+arDi[1]+arDi[0]);
                dataFim  = parseInt(arDf[2]+arDf[1]+arDf[0]);

                this._dataInit = datas.dataInit;
                this._dataFim  = datas.dataFim;

            } else {
                di = parseInt(arDi[2]+arDi[1]+arDi[0]);
                df = parseInt(arDf[2]+arDf[1]+arDf[0]);

                if(di < dataInit){
                    dataInit = di;
                    this._dataInit = datas.dataInit;
                }
    
                if(df > dataFim){
                    dataFim = df;
                    this._dataFim  = datas.dataFim;
                }
            }

            this._investimentoTotal  += parseFloat(isNaN(pr.getInvestimento())?0:pr.getInvestimento()); 
        }
        
        this._investimentoTotal = this._investimentoTotal.toFixed(2);
        //////////////
        $('#cab-veiculo-contagem_'+this._veiculoID).empty();
        $('#cab-veiculo-contagem_'+this._veiculoID).append(this._produtosAtivos.length);

        $('#cab-veiculo-periodo_'+this._veiculoID).empty();
        $('#cab-veiculo-periodo_'+this._veiculoID).append('De '+this._dataInit+' a '+this._dataFim);

        $('#cab-veiculo-investimento_'+this._veiculoID).empty(); //console.log('invest depois total '+this._investimentoTotal)
        $('#cab-veiculo-investimento_'+this._veiculoID).append(formataDado(this._investimentoTotal));
    }
    
    
    fn.salvar = function(){
        // TODO //////////////////////////////////
    }

    fn.excluir = function(){
        this._$painelXCard.remove(); 
        this._btVeiculo.desativar();
        this._ativo = false;
    }

    fn.getID    = function (){ return this._veiculoID; }
    fn.getNome  = function (){ return this._veiculoNome; }
    fn.getAtivo = function (){ return this._ativo; }

    fn.getDados = function (){
        var DADOS = [];
        
        if(this._produtosAtivos.length > 0){
            for(var i=0; i<this._produtosAtivos.length; i++){
                var p = this._produtosAtivos[i];
                var dadosProdutos = p.getDados();
                
                if(dadosProdutos.erro){
                    return {erro: dadosProdutos.erro};
                } else {
                    DADOS = DADOS.concat(dadosProdutos);
                }
            }
        }

        return DADOS;
    }
    

    // expoe construtor
    return CardVeiculo;
})();




