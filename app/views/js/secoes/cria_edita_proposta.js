var regrasAR = [
    { // produto
        nome:"Rede",
        segmentacoes:[
            {
                nome: "Trueview 30s - 1min ou mais",
                formatos: [
                    {
                        nome: "Pre-roll e intext",
                        descontoMax: 20,
                        investMinimo:"",
                        tipoCompra: "CPV 30s",
                        CUB: "6.00",
                        CUL: "4.80"
                    }
                ]
            },
            {
                nome: "Trueview 30s",
                formatos: [
                    {
                        nome: "Pre-roll e intext",
                        descontoMax: 12,
                        investMinimo:"",
                        tipoCompra: "CPV 30s",
                        CUB: "6.00",
                        CUL: "4.80"
                    }
                ]
            },
            {
                nome: "Quartil 7,5s",
                formatos: [
                    {
                        nome: "Pre-roll e intext",
                        descontoMax: 15,
                        investMinimo:"",
                        tipoCompra: "CPV 7s",
                        CUB: "6.00",
                        CUL: "4.80"
                    }
                ]
            },
            {
                nome: "Swipe",
                formatos: [
                    {
                        nome: "Swipe to engage",
                        descontoMax: 10,
                        investMinimo:"",
                        tipoCompra: "CPE",
                        CUB: "6.00",
                        CUL: "4.80"
                    }
                ]
            },
            {
                nome: "Take over",
                formatos: [
                    {
                        nome: "Takeover",
                        descontoMax: 25,
                        investMinimo:"",
                        tipoCompra: "CPV 30s",
                        CUB: "6.00",
                        CUL: "4.80"
                    }
                ]
            },
            {
                nome: "Display",
                formatos: [
                    {
                        nome: "Standard AB",
                        descontoMax: 25,
                        investMinimo:"",
                        tipoCompra: "CPM",
                        CUB: "6.00",
                        CUL: "4.80"
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
                        nome: "Pre-roll",
                        descontoMax: 20,
                        investMinimo:"",
                        tipoCompra: "CPV 30s",
                        CUB: "6.00",
                        CUL: "4.80"
                    }
                ]
            },
            {
                nome: "Trueview 30s",
                formatos: [
                    {
                        nome: "Pre-roll",
                        descontoMax: 20,
                        investMinimo:"",
                        tipoCompra: "CPV 30s",
                        CUB: "6.00",
                        CUL: "4.80"
                    }
                ]
            },
            {
                nome: "Bumper Ads",
                formatos: [
                    {
                        nome: "Bumper Ads",
                        descontoMax: 20,
                        investMinimo:"",
                        tipoCompra: "CPV 6s",
                        CUB: "6.00",
                        CUL: "4.80"
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
                        nome: "Pre-roll",
                        descontoMax: 10,
                        investMinimo:"50000.00",
                        tipoCompra: "CPV 15s",
                        CUB: "6.00",
                        CUL: "4.80"
                    },
                    {
                        nome: "Pre-roll sem skip",
                        descontoMax: 15,
                        investMinimo:"50000.00",
                        tipoCompra: "CPV 15s",
                        CUB: "6.00",
                        CUL: "4.80"
                    }
                ]
            },
            {
                nome: "Trueview 30s",
                formatos: [
                    {
                        nome: "Pre-roll",
                        descontoMax: 10,
                        investMinimo:"50000.00",
                        tipoCompra: "CPV 15s",
                        CUB: "6.00",
                        CUL: "4.80"
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
                        nome: "Display + pre-roll",
                        descontoMax: 20,
                        investMinimo:"25000.00",
                        tipoCompra: "CPM",
                        CUB: "6.00",
                        CUL: "4.80"
                    }
                ]
            }
        ]
    }
];

// simula dados recebidos do banco
var Alright = {logo:'bt-produto-alright', nome:'Alright', cor: '#6c00e9', regras:regrasAR, status:0};
var todosVeiculos = [Alright];
var VEICULOS = [];

///////// 

var containerVeiculos    = '#container-veiculos';
var containerBtsVeiculos = '#container-bts-veiculos';
var _MESES_PROPOSTA_     = ['Nov 2017', 'Dez 2017', 'Jan 2018', 'Fev 2018'];

// zera o container dos botoes de veículos
$(containerBtsVeiculos).empty();

for(var i=0; i<todosVeiculos.length; i++){
    var veiculo = todosVeiculos[i];
    VEICULOS.push(new CardVeiculo(i,veiculo.logo, veiculo.nome, veiculo.cor, veiculo.regras, veiculo.status,containerVeiculos, containerBtsVeiculos, __BASEHTML__));
}

function novoVeiculo(id){ 
    for(var i=0; i<VEICULOS.length; i++){
        var veiculo = VEICULOS[i];
        
        if(veiculo.getID() == id){ 
            if(!veiculo.getAtivo()){
                console.log('veiculo '+veiculo.getNome()+' criado com sucesso');
                veiculo.ativar(['Nov 2017', 'Dez 2017', 'Jan 2018', 'Fev 2018']);               
            } else {
                console.log('veiculo '+veiculo.getNome()+' já está ativo e nao pode ser criado novamente');
               
            }
        }
    }
}