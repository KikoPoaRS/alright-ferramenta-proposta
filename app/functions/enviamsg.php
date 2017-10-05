

<?php 

require "../../vendor/phpmailer/phpmailer/PHPMailerAutoload.php";

$saida  = array();
$erros  = array();

$erros['infos'] = 'Falha de envio! Sua mensagem não pode ser encaminhada, tente novamente mais tarde.';

if(isset($_POST['nome']) && isset($_POST['fone']) && isset($_POST['mail']) && isset($_POST['msg'])){

	$nome      = $_POST['nome'];
    $remetente = $_POST['mail'];
    $fone      = $_POST['fone'];
    $mensagem  = $_POST['msg'];

    $body  = '<lu><li>De: '.$nome.'</li>';
    $body .= '<li>E-mail: <a href="'.$remetente.'">'.$remetente.'</a></li>';
    $body .= '<li>Telefone: '.$fone.'</li></lu><br><hr><br>';
    $body .= $mensagem;
    /////////////////////////////////////

    $mail = new PHPMailer();
    $mail->setLanguage('pt');
    $mail->SMTPOptions = array( 'ssl' => array( 'verify_peer' => false, 'verify_peer_name' => false, 'allow_self_signed' => true));

    $from     = 'contato@bitfans.com.br';
    $fromName = 'Bitfans';
    $host     = 'mail.bitfans.com.br';
    $username = $from;
    $password = 'C0nt4t0';
    
    $port     = 25;
    $secure   = false;

    $mail->isSMTP();
    $mail->Host       = $host;
    $mail->SMTPAuth   = true;
    $mail->Username   = $username;
    $mail->Password   = $password;
    $mail->Port       = $port;
    $mail->SMTPSecure = $secure;


    $mail->From     = $from;
    $mail->FromName = $fromName;

    $mail->addAddress($from,$fromName);

    $mail->isHTML(true);
    $mail->CharSet = 'utf-8';
    $mail->WordWrap = 300;

    $mail->Subject = 'CONTATO VIA SITE';
    $mail->Body = $body;

    if($mail->Send()){
        $msgFinal   = '<p>Sua mensagem foi enviada, aguarde nosso retorno. Obrigado!</p>';
    } else {
        $msgFinal   = '<p>Erro de envio: '.$mail->ErrorInfo.'</p>';
    }
} else {
    $saida['erro'] = 'Dados de envio incompletos!';
}

echo json_encode($saida,JSON_UNESCAPED_UNICODE);