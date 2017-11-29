
<?php
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
    $sheet->getColumnDimension('F')->setWidth(25);
    $sheet->getColumnDimension('G')->setWidth(12);
    $sheet->getColumnDimension('H')->setWidth(12);
    $sheet->getColumnDimension('I')->setWidth(20);
    $sheet->getColumnDimension('K')->setWidth(10);
    $sheet->getColumnDimension('L')->setWidth(10);
    $sheet->getColumnDimension('M')->setWidth(10);
    $sheet->getRowDimension('1')->setRowHeight(10);
    $sheet->getRowDimension('2')->setRowHeight(28);

    // cabeçalho da proposta
    $sheet->mergeCells('B2:C2');
    $sheet->getStyle('B2:C2')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
    $sheet->getStyle('B2:C2')->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
    $sheet->getStyle('B2:C2')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)->getStartColor()->setRGB('cfcfcf');
    $sheet->setCellValue('B2', 'PROPOSTA ALRIGHT');

    $sheet->mergeCells('D2:'.$limiteChar.'2');
    $sheet->getStyle('D2:'.$limiteChar.'2')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
    $sheet->getStyle('D2:'.$limiteChar.'2')->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
    $sheet->getStyle('D2:'.$limiteChar.'2')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)->getStartColor()->setRGB('c6cdf4');
    $sheet->setCellValue('D2', $_POST['titulo']);

    $sheet->mergeCells('B4:C4');
    $sheet->mergeCells('B5:C5');
    $sheet->mergeCells('B6:C6');
    $sheet->getStyle('B4:C6')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_RIGHT);
    $sheet->getStyle('B4:C6')->getFont()->setBold(true);
    $sheet->setCellValue('B4', 'Agência / Cliente: ');
    $sheet->setCellValue('B5', 'Período: ');
    $sheet->setCellValue('B6', 'Investimento total: ');
    $sheet->setCellValue('D4', $_POST['agencia'].' / '.$_POST['cliente']);
    $sheet->setCellValue('D5', $_POST['periodo']);
    $sheet->setCellValue('D6', $_POST['investimento']);

    if(isset($_POST['veiculos'])) renderVeiculos($sheet,$_POST['veiculos'],$limiteChar);

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
        $bordaNome= array(
                    'borders' => array(
                        'allborders' => array(
                            'style' => PHPExcel_Style_Border::BORDER_THIN,
                            'color' => array('rgb' => $v['cor'])
                        )
                    )
                );

        $sheet->mergeCells($cellsNome);
        $sheet->getStyle($cellsNome)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle($cellsNome)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
        $sheet->getStyle($cellsNome)->applyFromArray($bordaNome);
        $sheet->setCellValue('B'.$linha, $v['nome']);

        $cellsCab = 'E'.$linha.':'.$limite.$linha;
        $bordaCab= array(
                'borders' => array(
                    'allborders' => array(
                        'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array('rgb' => $v['cor'])
                    )
                )
            );
        $sheet->mergeCells($cellsCab);
        $sheet->getStyle($cellsCab)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle($cellsCab)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
        $sheet->getStyle($cellsCab)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)->getStartColor()->setRGB($v['cor']);
        $sheet->getStyle($cellsCab)->applyFromArray($invertFont);
        $sheet->getStyle($cellsCab)->applyFromArray($bordaCab);
        $sheet->setCellValue('E'.$linha, 'Período: '.$v['datas'].' | Investimento total: '.$v['investimento'].'   ');

        // head da tabela
        ++$linha;
        $cellHead  = 'B'.$linha.':'.$limite.$linha;
        $bordaHead = array(
                'borders' => array(
                    'allborders' => array(
                        'style' => PHPExcel_Style_Border::BORDER_THIN,
                        'color' => array('rgb' => 'acacac')
                    )
                )
            );
        $sheet->getRowDimension($linha)->setRowHeight(22);
        $sheet->getStyle($cellHead)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle($cellHead)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
        $sheet->getStyle($cellHead)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)->getStartColor()->setRGB('000000');
        $sheet->getStyle($cellHead)->applyFromArray($invertFont);
        $sheet->getStyle($cellHead)->applyFromArray($bordaHead);
        $sheet->fromArray(['Produto','Segmento','Target','Preça','Formato','Início','Fim','Tot. Bruto','Volume','Compra','CUB','CUL','Desc.','CUBN','CULN','Tot. Liq.'], NULL, 'B'.$linha);
        
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
            $sheet->getStyle($cellsDadosTxt)->applyFromArray($bordaHead);

            if(++$ctBloco%2 == 0) $sheet->getStyle($cellsDadosTxt)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)->getStartColor()->setRGB('ececec');
            $sheet->fromArray([$prod['nome'],$prod['segmento'],$prod['target'],$prod['praca'],$prod['formato']], NULL, 'B'.$linha);

            foreach($periodos as $p){
                $sheet->getRowDimension($linha)->setRowHeight(18);
                $sheet->fromArray([$p['dataInit'],$p['dataFim'],$p['totalBruto'],$p['volume'],$p['compra'],$p['cub'],$p['cul'],$p['desconto'],$p['cubn'],$p['culn'],$p['totalLiquido']], NULL, 'G'.$linha);
                ++$linha;
            }

            // insere resumo
            $cellsResumo = 'G'.$linha.':'.$limite.$linha;
            $sheet->getRowDimension($linha)->setRowHeight(18);
            $sheet->mergeCells($cellsResumo);
            $sheet->getStyle($cellsResumo)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle($cellsResumo)->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
            $sheet->getStyle($cellsResumo)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)->getStartColor()->setRGB($v['cor']);
            $sheet->getStyle($cellsResumo)->applyFromArray($invertFont);
            $sheet->getStyle($cellsResumo)->applyFromArray($bordaCab);
            $sheet->setCellValue('G'.$linha, 'Período total: '.$prod['datas'].' - Investimento total: '.$prod['investimento'].'   ');
        }
        
        $linha +=2;
    }
}