

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `senha` varchar(20) DEFAULT NULL,
  `data_cadastro` datetime DEFAULT NULL,
  `data_ultimo_acesso` datetime DEFAULT NULL,
  `acessos` int(11) DEFAULT NULL,
  `nivel_permissao` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Usuário Teste','antonio.santos@bitfans.com.br','333','2017-10-24 00:00:00','2017-10-27 17:56:43',11,1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;



DROP TABLE IF EXISTS `agencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `agencias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) DEFAULT NULL,
  `codigo_externo` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agencias`
--

LOCK TABLES `agencias` WRITE;
/*!40000 ALTER TABLE `agencias` DISABLE KEYS */;
/*!40000 ALTER TABLE `agencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `codigo_externo` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;



--
-- Table structure for table `tipos_compras`
--

DROP TABLE IF EXISTS `tipos_compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tipos_compras` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `multiplicador` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_compras`
--

LOCK TABLES `tipos_compras` WRITE;
/*!40000 ALTER TABLE `tipos_compras` DISABLE KEYS */;
INSERT INTO `tipos_compras` VALUES (1,'CPC',1),(2,'CPM',1000),(3,'CPE',1),(4,'CPV 3s',1),(5,'CPV 6s',1),(6,'CPV 7s',1),(7,'CPV 15s',1),(8,'CPV 30s',1),(9,'CPV físico',1),(10,'CPVisit',1),(11,'CPListening',1),(12,'Diária',1),(13,'Semana',1),(14,'Mensal',1),(15,'Unitário',1);
/*!40000 ALTER TABLE `tipos_compras` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `veiculos`
--

DROP TABLE IF EXISTS `veiculos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `veiculos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `cor` varchar(7) NOT NULL,
  `img_logo_ativo` varchar(100) NOT NULL,
  `img_logo_inativo` varchar(100) NOT NULL,
  `img_thumb` varchar(100) NOT NULL,
  `codigo_externo` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `veiculos`
--

LOCK TABLES `veiculos` WRITE;
/*!40000 ALTER TABLE `veiculos` DISABLE KEYS */;
INSERT INTO `veiculos` VALUES (1,'Alright','#6c00e9','bt-produto-alright-ativo.png','bt-produto-alright-inativo.png','th-alright.jpg',NULL),(2,'SmartClip','#bf534c','bt-produto-smartclip-ativo.png','bt-produto-smartclip-inativo.png','th-smartclip.jpg',NULL),(3,'Audioad','#cf7442','bt-produto-audioad-ativo.png','bt-produto-audioad-inativo.png','th-audioad.jpg',NULL),(4,'Waze','#a5c2ce','bt-produto-waze-ativo.png','bt-produto-waze-inativo.png','th-waze.jpg',NULL),(5,'Buscapé','#eecc4d','bt-produto-buscape-ativo.png','bt-produto-buscape-inativo.png','th-buscape.jpg',NULL),(6,'Facebook','#425893','bt-produto-facebook-ativo.png','bt-produto-facebook-inativo.png','th-facebook.jpg',NULL),(7,'Google','#547cf2','bt-produto-google-ativo.png','bt-produto-google-inativo.png','th-google.jpg',NULL),(8,'Outbrain','#dc8439','bt-produto-outbrain-ativo.png','bt-produto-outbrain-inativo.png','th-outbrain.jpg',NULL),(9,'SuperPlayer','#000000','bt-produto-superplayer-ativo.png','bt-produto-superplayer-inativo.png','th-superplayer.jpg',NULL),(10,'TradeLab','#b1c43f','bt-produto-tradelab-ativo.png','bt-produto-tradelab-inativo.png','th-tradelab.jpg',NULL),(11,'YouTube','#e57c76','bt-produto-youtube-ativo.png','bt-produto-youtube-inativo.png','th-youtube.jpg',NULL),(12,'ModaIt','#ca547b','bt-produto-modait-ativo.png','bt-produto-modait-inativo.png','th-modait.jpg',NULL);
/*!40000 ALTER TABLE `veiculos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `veiculos_formatos`
--

DROP TABLE IF EXISTS `veiculos_formatos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `veiculos_formatos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `veiculos_id` int(11) NOT NULL,
  `formatos` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `veiculos_formatos`
--

LOCK TABLES `veiculos_formatos` WRITE;
/*!40000 ALTER TABLE `veiculos_formatos` DISABLE KEYS */;
INSERT INTO `veiculos_formatos` VALUES (1,1,'Standard IAB, Billboard e Interstitial, Diversos - 1 MM imp, Diversos - 2 MM imp, Video in-banner'),(2,2,'Bumper ads, Pre-roll, Pre-roll sem skip, Display+pre-roll, Diversos'),(3,3,'Áudio + Display'),(4,4,'Pin, Takeover'),(5,5,'Billboard, Dhtml, Superbanner, Retângulo, Halfbanner, Push, E-mail'),(6,6,'Post Engagement, Video 3s Clique para site, Vários, Lead Ads, Event Engagement, Page like'),(7,7,'Links patrocinados, Standard IAB'),(8,8,'Native'),(9,9,'Branded Channels, Playlist Personalizada, Playlist Patrocinada, Video Pre Roll, Spot Áudio, Gravação Spot, Banner 729X90. Fullbanner'),(10,10,'standard IAB, Billboard e Interstitial, Pre-roll'),(11,11,'Pre-roll'),(12,12,'Publipost, Newsletter, Banner Carrossel, Banner Pequeno, Banner Newsletter, Banner, Push');
/*!40000 ALTER TABLE `veiculos_formatos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `veiculos_produtos`
--

DROP TABLE IF EXISTS `veiculos_produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `veiculos_produtos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `veiculos_id` int(11) NOT NULL,
  `produtos` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `veiculos_produtos`
--

LOCK TABLES `veiculos_produtos` WRITE;
/*!40000 ALTER TABLE `veiculos_produtos` DISABLE KEYS */;
INSERT INTO `veiculos_produtos` VALUES (1,1,'Display, Diária RS, Diária Região Sul, Vídeo'),(2,2,'Rede, YouTube, Warner, TV Conectada'),(3,3,'Rede, Soundcloud, Tunein'),(4,4,'Waze'),(5,5,'Diária, Display, Push, Conteúdo'),(6,6,'Facebook Engajament, Facebook CPV, Facebook CPC, Facebook Impressão'),(7,7,'Google Search, Google Display'),(8,8,'Branding, Performance'),(9,9,'Branded Channel, Playlists, Video, Audio, Display'),(10,10,'Display, Vídeo'),(11,11,'YouTube'),(12,12,'Conteúdo, Display, Push');
/*!40000 ALTER TABLE `veiculos_produtos` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `veiculos_segmentacoes`
--

DROP TABLE IF EXISTS `veiculos_segmentacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `veiculos_segmentacoes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `veiculos_id` int(11) NOT NULL,
  `segmentacoes` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `veiculos_segmentacoes`
--

LOCK TABLES `veiculos_segmentacoes` WRITE;
/*!40000 ALTER TABLE `veiculos_segmentacoes` DISABLE KEYS */;
INSERT INTO `veiculos_segmentacoes` VALUES (1,1,'Alcance, Impacto, Apenas RS, Região Sul'),(2,2,'Trueview 30s - 1 min ou mais, Trueview 30s, Trueview 15s, Quartil 7.5s, Swipe, Take Over, Display, Bumper ads, Branding'),(3,3,'RON, Custom Audience'),(4,4,'Local'),(5,5,'Homepage, Internas, Navegg/Tail Target, ROS, Mobile, App, Lojistas'),(6,6,'Varejo, Local/Governo/b2b'),(7,7,'Keyword branded, Keyword genérica, Nacional, Regional/Local'),(8,8,'nacional, Internacional, Regional'),(9,9,'Livre'),(10,10,'Open RTB, Whitelist, Custom Audience, Private Deal, Impacto'),(11,11,'Nacional, Regional/Local'),(12,12,'Nacional, Base Moda It, Nacional');
/*!40000 ALTER TABLE `veiculos_segmentacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `propostas`
--

DROP TABLE IF EXISTS `propostas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `propostas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data_cadastro` datetime NOT NULL,
  `data_atualizacao` datetime NOT NULL,
  `titulo` varchar(50) NOT NULL,
  `agencia_id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `contato` varchar(45) DEFAULT NULL,
  `desconto_cliente` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `propostas`
--

LOCK TABLES `propostas` WRITE;
/*!40000 ALTER TABLE `propostas` DISABLE KEYS */;
/*!40000 ALTER TABLE `propostas` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `veiculos_regras`
--

DROP TABLE IF EXISTS `veiculos_regras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `veiculos_regras` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `veiculos_id` int(11) NOT NULL,
  `produto` varchar(45) NOT NULL,
  `segmentacao` varchar(45) NOT NULL,
  `formato` varchar(45) NOT NULL,
  `investimento_minimo` varchar(10) DEFAULT NULL,
  `tipo_compra_nome` varchar(45) NOT NULL,
  `tipo_compra_multiplicador` varchar(45) DEFAULT NULL,
  `custo_unit_bruto` varchar(10) NOT NULL,
  `desconto_max` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `veiculos_regras`
--

LOCK TABLES `veiculos_regras` WRITE;
/*!40000 ALTER TABLE `veiculos_regras` DISABLE KEYS */;
INSERT INTO `veiculos_regras` VALUES (1,1,'Vídeo','Alcance','Billboard e Interstitial','1.000,00','CPC','1','1,30','20,00'),(2,2,'YouTube','Take Over','Pre-roll sem skip','500,00','CPM','1000','2,00','15,00'),(3,3,'Soundcloud','RON','Áudio + Display','250,00','CPM','1000','0,50','10,00'),(4,4,'Waze','Local','Takeover','','CPV 3s','1','1,32','5,00'),(5,5,'Push','Internas','Halfbanner','500,00','CPV 15s','1','1,35','15,00'),(6,6,'Facebook CPV','Varejo','Vários','','CPV 7s','1','2,33','10,00'),(7,7,'Google Search','Nacional','Links patrocinados','150,00','Diária','1','1,00','20,00'),(8,1,'Diária RS','Impacto','Diversos - 2 MM imp','50,00','CPV 15s','1','1,20','10,00'),(9,1,'Vídeo','Região Sul','Diversos - 1 MM imp','300,00','CPM','1000','2,00','25,00'),(12,2,'TV Conectada','Quartil 7.5s','Diversos','150,00','CPVisit','1','1,50','12,00'),(13,1,'Diária RS','Impacto','Video in-banner','200,00','CPE','1','1,00','15,00'),(14,1,'Display','Impacto','Billboard e Interstitial','100,00','Diária','1','3,00','10,00');
/*!40000 ALTER TABLE `veiculos_regras` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `propostas_periodos`
--

DROP TABLE IF EXISTS `propostas_periodos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `propostas_periodos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `propostas_id` int(11) NOT NULL,
  `veiculos_id` int(11) NOT NULL,
  `veiculos_regras_id` int(11) NOT NULL,
  `grupo` int(11) NOT NULL,
  `target` varchar(45) DEFAULT NULL,
  `praca` varchar(45) DEFAULT NULL,
  `data_inicio` datetime DEFAULT NULL,
  `data_fim` datetime DEFAULT NULL,
  `total_bruto` float DEFAULT NULL,
  `total_liquido` float DEFAULT NULL,
  `desconto_linha` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_propostas_periodos_propostas_idx` (`propostas_id`),
  KEY `fk_propostas_periodos_veiculos_regras1_idx` (`veiculos_regras_id`),
  CONSTRAINT `fk_propostas_periodos_propostas` FOREIGN KEY (`propostas_id`) REFERENCES `propostas` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_propostas_periodos_veiculos_regras1` FOREIGN KEY (`veiculos_regras_id`) REFERENCES `veiculos_regras` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `propostas_periodos`
--

LOCK TABLES `propostas_periodos` WRITE;
/*!40000 ALTER TABLE `propostas_periodos` DISABLE KEYS */;
/*!40000 ALTER TABLE `propostas_periodos` ENABLE KEYS */;
UNLOCK TABLES;

