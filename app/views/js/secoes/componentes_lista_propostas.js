function init_daterangepicker_reservation() {
    
    if( typeof ($.fn.daterangepicker) === 'undefined'){ return; }
      // console.log('init_daterangepicker_reservation');
    var di = new Date(new Date().setDate(new Date().getDate() - 30));
    var df = new Date();

    var dd_di = di.getDate();
    var mm_di = di.getMonth() + 1;
    var aa_di = di.getFullYear();
    
    var dd_df = df.getDate();
    var mm_df = df.getMonth() + 1;
    var aa_df = df.getFullYear();

   

    var dataInit = dd_di+'/'+(mm_di < 10?'0'+mm_di:mm_di)+'/'+aa_di;
    var dataFim  = dd_df+'/'+(mm_df < 10?'0'+mm_df:mm_df)+'/'+aa_df;

    $('#periodoListaPropostas').daterangepicker(
        {
            locale: {
              format: 'DD/MM/YYYY',
              "applyLabel": "Ok",
              "cancelLabel": "Cancelar",
              "daysOfWeek": [
                "Do",
                "Se",
                "Tr",
                "Qa",
                "Qi",
                "Sx",
                "Sa"
            ],
            "monthNames": [
                "Janeiro",
                "Fevereiro",
                "Março",
                "Abril",
                "Maio",
                "Junho",
                "Julho",
                "Agosto",
                "Setembro",
                "Outubro",
                "Novembro",
                "Decembro"
            ],
            },
            startDate: dataInit,
            endDate: dataFim
        }, 
        function(start, end, label) {
        // console.log(start.toISOString(), end.toISOString(), label);
    });

  }

$(document).ready(function() {    
    init_daterangepicker_reservation();

    // tabela dinamica
    $('#tabela-veiculos').dataTable({
        "language": {
            "sProcessing":    "Procesando...",
            "sLengthMenu":    "Mostrar &nbsp; _MENU_  &nbsp; registros por página",
            "sZeroRecords":   "Nenhuma proposta localizada",
            "sEmptyTable":    "Nenhum registro disponível na tabela",
            "sInfo":          "Mostrando registros de _START_ a _END_ de um total de _TOTAL_ registros",
            "sInfoEmpty":     "Mostrando registros de 0 a 0 de um total de 0 registros",
            "sInfoFiltered":  "(filtrado de um total de _MAX_ registros)",
            "sInfoPostFix":   "",
            "sSearch":        "Buscar na tabela:",
            "sUrl":           "",
            "sInfoThousands":  ",",
            "sLoadingRecords": "Carregando...",
            "oPaginate": {
                "sFirst":    "Primeiro",
                "sLast":    "Último",
                "sNext":    "Seguinte",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending":  ": Ativar para ordenar a columna de maneira ascendente",
                "sSortDescending": ": Ativar para ordenar a columna de maneira descendente"
            }
        },
        "pageLength": 50,
        "columnDefs": [ {
            "targets": 'no-sort',
            "orderable": false,
        } ]
    });
});	