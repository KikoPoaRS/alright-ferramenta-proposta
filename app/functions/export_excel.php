<?php
error_reporting(E_ALL ^ E_NOTICE);
ini_set("display_errors", 1 );

include_once "connections.php";
require_once "Classes/PHPExcel.php";
$saida = array();

if(isset($_POST['idProposta']) && $_POST['idProposta']>0){
    $objPHPExcel = new PHPExcel();
    $sheet = $objPHPExcel->getActiveSheet();
    
    // $objPHPExcel->getActiveSheet()->setTitle('meu título'); // título da aba
    $limiteChar = 'Q';
/**/
    // define a largura da primeira coluna
    $sheet->setShowGridlines(false);
    $sheet->getColumnDimension('A')->setWidth(3);
    $sheet->getColumnDimension('B')->setWidth(15);
    $sheet->getColumnDimension('C')->setWidth(18);
    $sheet->getColumnDimension('D')->setWidth(18);
    $sheet->getColumnDimension('E')->setWidth(15);
    $sheet->getColumnDimension('F')->setWidth(25);
    $sheet->getColumnDimension('G')->setWidth(12);
    $sheet->getColumnDimension('H')->setWidth(12);
    $sheet->getColumnDimension('I')->setWidth(20);
    $sheet->getColumnDimension('J')->setWidth(15);
    $sheet->getColumnDimension('K')->setWidth(10);
    $sheet->getColumnDimension('L')->setWidth(10);
    $sheet->getColumnDimension('M')->setWidth(10);
    $sheet->getColumnDimension('Q')->setWidth(25);
    $sheet->getRowDimension('1')->setRowHeight(10);
    $sheet->getRowDimension('2')->setRowHeight(33);

    // cabeçalho da proposta
    // $sheet->mergeCells('B2');
    $sheet->getStyle('B2')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
    $sheet->getStyle('B2')->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
    // $sheet->getStyle('B2')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)->getStartColor()->setRGB('cfcfcf');

    // $sheet->setCellValue('B2', 'PROPOSTA ALRIGHT');
    $objDrawing = new PHPExcel_Worksheet_Drawing();
    $objDrawing->setName('logo_alright');
    $objDrawing->setDescription('logo_alright');
    $objDrawing->setPath('exports/logo.png');
    $objDrawing->setCoordinates('B2');                      
    //setOffsetX works properly
    // $objDrawing->setOffsetX(40); 
    // $objDrawing->setOffsetY(5);                
    //set width, height
    $objDrawing->setWidth(105); 
    $objDrawing->setHeight(39); 
    $objDrawing->setWorksheet($sheet);



    $sheet->mergeCells('C2:'.$limiteChar.'2');
    $sheet->getStyle('C2:'.$limiteChar.'2')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
    $sheet->getStyle('C2:'.$limiteChar.'2')->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
    $sheet->getStyle('C2:'.$limiteChar.'2')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)->getStartColor()->setRGB('c6cdf4');
    $sheet->getStyle('C2')->getFont()->setBold(true);
    $sheet->setCellValue('C2', 'PROPOSTA - '.$_POST['titulo']);

    $sheet->mergeCells('F4:'.$limiteChar.'4');
    $sheet->getStyle('F4:'.$limiteChar.'4')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_RIGHT);
    $sheet->getStyle('F4:'.$limiteChar.'4')->applyFromArray(['font'=>['color'=>['rgb'=>'909090']]]);
    $sheet->setCellValue('F4', '* CUB : Custo Unitário Bruto | CUL : Custo Unitário Líquido | CUBN : Custo Unitário Bruto - Negociado | CULN : Custo Unitário Líquido - Negociado');

    $sheet->mergeCells('B4:C4');
    $sheet->mergeCells('B5:C5');
    $sheet->mergeCells('B6:C6');
    $sheet->getStyle('B4:C6')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_RIGHT);
    $sheet->getStyle('B4:C6')->getFont()->setBold(true);
    $sheet->setCellValue('B4', 'Agência / Cliente: ');
    $sheet->setCellValue('B5', 'Período total: ');
    $sheet->setCellValue('B6', 'Investimento total bruto: ');
    $sheet->setCellValue('D4', $_POST['agencia'].' / '.$_POST['cliente']);
    $sheet->setCellValue('D5', $_POST['periodo']);
    $sheet->setCellValue('D6', $_POST['investimento']);

    // if(isset($_POST['veiculos'])) renderVeiculos($sheet,$_POST['veiculos'],$limiteChar);
    $linha = isset($_POST['veiculos']) ? renderVeiculos($sheet,$_POST['veiculos'],$limiteChar) : 9;
    $rodape = 'B'.$linha.':'.$limiteChar.$linha;
    $sheet->mergeCells($rodape);
    $sheet->getStyle($rodape)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_RIGHT);
    $sheet->setCellValue('B'.$linha, 'Validade da proposta: 15 dias  |  Prazo de pagamento: 30 DFM ');

    // exporta os dados

    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment;filename="proposta_alright.xlsx"');
    header('Cache-Control: max-age=0');


    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
    // $arquivo = 
    // $objWriter->save('php://output');
    // make sure you have permission to write to directory
    $arquivo = $_POST['idProposta'].'.xlsx';
    $objWriter->save('exports/'.$arquivo);
    
    $saida['arquivo'] = $arquivo;
} else {
    $saida['erro'] = 'Para exportar um arquivo a proposta deve ter sido salva.';
}


echo json_encode($saida,JSON_UNESCAPED_UNICODE);


//// FUNÇ˜ÕES DE SUPORTE /////////////////////////

function renderVeiculos($sheet,$veics,$limite,$linha=8){
    foreach($veics as $v){
        $invertFont = ['font'=>['color'=>['rgb'=>'FFFFFF']]];

        // cabecalho do veículo
        $sheet->getRowDimension($linha)->setRowHeight(35);
        $cellsNome = 'B'.$linha.':D'.$linha;

        $sheet->mergeCells($cellsNome);
        $sheet->getStyle($cellsNome)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle($cellsNome)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
        $sheet->getStyle($cellsNome)->applyFromArray(bordaCor($v['cor']));
        $sheet->setCellValue('B'.$linha, $v['nome']);

        $cellsCab = 'E'.$linha.':'.$limite.$linha;
        $sheet->mergeCells($cellsCab);
        $sheet->getStyle($cellsCab)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle($cellsCab)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
        $sheet->getStyle($cellsCab)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)->getStartColor()->setRGB($v['cor']);
        $sheet->getStyle($cellsCab)->applyFromArray($invertFont);
        $sheet->getStyle($cellsCab)->getFont()->setBold(true);
        $sheet->getStyle($cellsCab)->applyFromArray(bordaCor($v['cor']));
        $sheet->setCellValue('E'.$linha, 'Período do veículo:  '.$v['datas'].'   |   Investimento no veículo:  '.$v['investimento'].'   ');

        // head da tabela
        ++$linha;
        $cellHead  = 'B'.$linha.':'.$limite.$linha;
        $sheet->getRowDimension($linha)->setRowHeight(22);
        $sheet->getStyle($cellHead)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle($cellHead)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
        $sheet->getStyle($cellHead)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)->getStartColor()->setRGB('666666');
        $sheet->getStyle($cellHead)->applyFromArray($invertFont);
        $sheet->getStyle($cellHead)->applyFromArray(bordaCor('acacac'));
        $sheet->fromArray(['Produto','Segmento','Target','Praça','Formato','Início','Fim','Tot. Bruto','Volume','Compra','CUB*','CUL*','Desc.','CUBN*','CULN*','Tot. Liq.'], NULL, 'B'.$linha);
        
        $ctBloco = 0;
        foreach($v['produtos'] as $prod){
            ++$linha;
            $periodos = $prod['periodos'];
            $alt = count($periodos)-1;
            $cellsDadosTxt = 'B'.$linha.':'.$limite.($linha+$alt);
            $sheet->mergeCells('B'.$linha.':'.'B'.($linha+$alt));
            $sheet->mergeCells('C'.$linha.':'.'C'.($linha+$alt));
            $sheet->mergeCells('D'.$linha.':'.'D'.($linha+$alt));
            $sheet->mergeCells('E'.$linha.':'.'E'.($linha+$alt));
            $sheet->mergeCells('F'.$linha.':'.'F'.($linha+$alt));
            $sheet->getStyle($cellsDadosTxt)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle($cellsDadosTxt)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
            $sheet->getStyle($cellsDadosTxt)->applyFromArray(bordaCor('acacac'));

            if(++$ctBloco%2 == 0) $sheet->getStyle($cellsDadosTxt)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)->getStartColor()->setRGB('ececec');
            $sheet->fromArray([$prod['nome'],$prod['segmento'],$prod['target'],$prod['praca'],$prod['formato']], NULL, 'B'.$linha);

            foreach($periodos as $p){
                $p['volume'] .= ' '; //str_replace(',','.',$p['volume']);
                $sheet->getRowDimension($linha)->setRowHeight(18);
                $sheet->fromArray([$p['dataInit'],$p['dataFim'],$p['totalBruto'],$p['volume'],$p['compra'],$p['cub'],$p['cul'],$p['desconto'],$p['cubn'],$p['culn'],$p['totalLiquido']], NULL, 'G'.$linha);
                ++$linha;
            }

            // insere resumo
            $cellsResumo = 'G'.$linha.':'.$limite.$linha;
            $sheet->getRowDimension($linha)->setRowHeight(22);
            $sheet->mergeCells($cellsResumo);
            $sheet->getStyle($cellsResumo)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle($cellsResumo)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
            $sheet->getStyle($cellsResumo)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)->getStartColor()->setRGB(blendColor($v['cor'],25));
            $sheet->getStyle($cellsResumo)->getFont()->setBold(true);
            $sheet->getStyle($cellsResumo)->applyFromArray(bordaCor('acacac'));
            $sheet->setCellValue('G'.$linha, 'Período:  '.$prod['datas'].'   -   Investimento:  '.$prod['investimento'].'   ');
        }
        
        $linha +=2;
    }
    return $linha + 1;
}


function bordaCor($cor){
    return array(
        'borders' => array(
            'allborders' => array(
                'style' => PHPExcel_Style_Border::BORDER_THIN,
                'color' => array('rgb' => $cor)
            )
        )
    );
}

function blendColor($foreground, $opacity, $background=null ) {
    static $colors_rgb=array(); // stores colour values already passed through the hexdec() functions below.
    
    if( is_null($background) )
        $background = 'FFFFFF'; // default background.

    $pattern = '~^[a-f0-9]{6,6}$~i'; // accept only valid hexadecimal colour values.
    if( !@preg_match($pattern, $foreground)  or  !@preg_match($pattern, $background) ){
        trigger_error( "Invalid hexadecimal colour value(s) found", E_USER_WARNING );
        return false;
    }
        
    $opacity = intval( $opacity ); // validate opacity data/number.
    if( $opacity>100  || $opacity<0 ){
        trigger_error( "Opacity percentage error, valid numbers are between 0 - 100", E_USER_WARNING );
        return false;
    }

    if( $opacity==100 )    // $transparency == 0
        return strtoupper( $foreground );
    if( $opacity==0 )    // $transparency == 100
        return strtoupper( $background );
    // calculate $transparency value.
    $transparency = 100-$opacity;

    if( !isset($colors_rgb[$foreground]) ){ // do this only ONCE per script, for each unique colour.
        $f = array(  'r'=>hexdec($foreground[0].$foreground[1]),
                     'g'=>hexdec($foreground[2].$foreground[3]),
                     'b'=>hexdec($foreground[4].$foreground[5])    );
        $colors_rgb[$foreground] = $f;
    } else { // if this function is used 100 times in a script, this block is run 99 times.  Efficient.
        $f = $colors_rgb[$foreground];
    }
    
    if( !isset($colors_rgb[$background]) ) { // do this only ONCE per script, for each unique colour.
        $b = array(  'r'=>hexdec($background[0].$background[1]),
                     'g'=>hexdec($background[2].$background[3]),
                     'b'=>hexdec($background[4].$background[5])    );
        $colors_rgb[$background] = $b;
    } else { // if this FUNCTION is used 100 times in a SCRIPT, this block will run 99 times.  Efficient.
        $b = $colors_rgb[$background];
    }
    
    $add = array(    'r'=>( $b['r']-$f['r'] ) / 100,
                     'g'=>( $b['g']-$f['g'] ) / 100,
                     'b'=>( $b['b']-$f['b'] ) / 100    );
                    
    $f['r'] += intval( $add['r'] * $transparency );
    $f['g'] += intval( $add['g'] * $transparency );
    $f['b'] += intval( $add['b'] * $transparency );
    
    return sprintf( '%02X%02X%02X', $f['r'], $f['g'], $f['b'] );
}