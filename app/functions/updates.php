
<?php 
include_once "connections.php";

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
// Iniciamos o "contador"

list($usec, $sec) = explode(' ', microtime());
$script_start = (float) $sec + (float) $usec;
/**/
 ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
/* SEU CÓDIGO PHP */
 /*
$clientes = cliente::all();
echo 'CLIENTES<br><br>';
foreach($clientes as $c){
    $nome = $c->nome;
    $d = array();
    $d['nome'] =  str_replace('"', '', $nome);
    $c->update_attributes($d);
    echo $nome.'  >> '.$d['nome'].'<br>';
}
echo '------------<br><br>';

$agencias = agencia::all();
echo 'AGENCIAS<br><br>';
foreach($agencias as $c){
    $nome = $c->nome;
    $d = array();
    $d['nome'] =  str_replace('"', '', $nome);
    $c->update_attributes($d);
    echo $nome.'  >> '.$d['nome'].'<br>';
}*/



function getCSV($name) {
    $file = fopen($name, "r");
    $result = array();
    $i = 0;
    while (!feof($file)){
        if (substr(($result[$i] = fgets($file)), 0, 10) !== ',,,,,,,') $i++;
    }
       
    fclose($file);
    return $result;
 }
 
 $registros = getCSV('clientes_agencias.csv');

 function getLine($array, $index) {
    return explode(',', $array[$index]);
 }

$novo = 0;


for ($i = 0; $i < count($registros); $i++) {
    $dadoN = getLine($registros, $i);
    $dados = $dadoN[0] == null ? null : str_replace('"', '', $dadoN[0]);


    if($i>0 && $dados !='' && $dados!=null){
        $tipoAgencia = strripos($dados,'(');
        $nome = array();
        $nome['nome'] = $dados;

        if($tipoAgencia){
            $agencia = agencia::find_by_nome($dados);
            if(!$agencia){
                $agencia = agencia::create($nome);
                $agencia->save(); 
                ++$novo;
                // echo '------ AGENCIA: '.$dados.'<br>';
                echo '------ AGENCIA: '.$agencia->id.' :: '.$agencia->nome.'<br>';
            }
            
        } else {
            $cliente = cliente::find_by_nome($dados);
            if(!$cliente){
                $cliente = cliente::create($nome);
                $cliente->save(); 
                ++$novo;
                // echo 'CLIENTE: '.$dados.'<br>';
                echo 'CLIENTE: '.$cliente->id.' :: '.$cliente->nome.'<br>';
            }
        }
    }
 }

 echo 'Total de registros no ARQUIVO  : '.(count($registros)-1).'<br>';
 echo 'Total de registros CRIADOS : '.$novo.'<br><br>';



////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
 // Terminamos o "contador" e exibimos
list($usec, $sec) = explode(' ', microtime());
$script_end = (float) $sec + (float) $usec;
$elapsed_time = round($script_end - $script_start, 5);
// Exibimos uma mensagem
echo '<br><br><br>////////////////////////////////////////////////////<br>';
echo 'Tempo de execução: ', $elapsed_time, ' segundos. Memória utilizada: ', round(((memory_get_peak_usage(true) / 1024) / 1024), 2), 'Mb';
echo '<br>////////////////////////////////////////////////////<br>';
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

