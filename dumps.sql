INSERT INTO alright.veiculos (`nome`,`cor`,`img_logo_ativo`,`img_logo_inativo`,`img_thumb`) VALUES
('Alright',     '#6c00e9', 'bt-produto-alright-ativo.png','bt-produto-alright-inativo.png','th-alright.jpg'),
('SmartClip',   '#bf534c', 'bt-produto-smartclip-ativo.png','bt-produto-smartclip-inativo.png','th-smartclip.jpg'),
('Audioad',     '#cf7442', 'bt-produto-audioad-ativo.png','bt-produto-audioad-inativo.png','th-audioad.jpg'),
('Waze',        '#a5c2ce', 'bt-produto-waze-ativo.png','bt-produto-waze-inativo.png','th-waze.jpg'),
('Buscapé',     '#eecc4d', 'bt-produto-buscape-ativo.png','bt-produto-buscape-inativo.png','th-buscape.jpg'),
('Facebook',    '#425893', 'bt-produto-facebook-ativo.png','bt-produto-facebook-inativo.png','th-facebook.jpg'),
('Google',      '#547cf2', 'bt-produto-google-ativo.png','bt-produto-google-inativo.png','th-google.jpg'),
('Outbrain',    '#dc8439', 'bt-produto-outbrain-ativo.png','bt-produto-outbrain-inativo.png','th-outbrain.jpg'),
('SuperPlayer', '#000000', 'bt-produto-superplayer-ativo.png','bt-produto-superplayer-inativo.png','th-superplayer.jpg'),
('TradeLab',    '#b1c43f', 'bt-produto-tradelab-ativo.png','bt-produto-tradelab-inativo.png','th-tradelab.jpg'),
('YouTube',     '#e57c76', 'bt-produto-youtube-ativo.png','bt-produto-youtube-inativo.png','th-youtube.jpg'),
('ModaIt',      '#ca547b', 'bt-produto-modait-ativo.png','bt-produto-modait-inativo.png','th-modait.jpg');


INSERT INTO alright.veiculos_produtos (`veiculos_id`,`produtos`) VALUES
(1,'Display, Diária RS, Diária Região Sul, Vídeo'),
(2,'Rede, YouTube, Warner, TV Conectada'),
(3,'Rede, Soundcloud, Tunein'),
(4,'Waze'),
(5,'Diária, Display, Push, Conteúdo'),
(6,'Facebook Engajament, Facebook CPV, Facebook CPC, Facebook Impressão'),
(7,'Google Search, Google Display'),
(8,'Branding, Performance'),
(9,'Branded Channel, Playlists, Video, Audio, Display'),
(10,'Display, Vídeo'),
(11,'YouTube'),
(12,'Conteúdo, Display, Push');


INSERT INTO alright.veiculos_segmentacoes (`veiculos_id`,`segmentacoes`) VALUES
(1,'Alcance, Impacto, Apenas RS, Região Sul'),
(2,'Trueview 30s - 1 min ou mais, Trueview 30s, Trueview 15s, Quartil 7.5s, Swipe, Take Over, Display, Bumper ads, Branding'),
(3,'RON, Custom Audience'),
(4,'Local'),
(5,'Homepage, Internas, Navegg/Tail Target, ROS, Mobile, App, Lojistas'),
(6,'Varejo, Local/Governo/b2b'),
(7,'Keyword branded, Keyword genérica, Nacional, Regional/Local'),
(8,'nacional, Internacional, Regional'),
(9,'Livre'),
(10,'Open RTB, Whitelist, Custom Audience, Private Deal, Impacto'),
(11,'Nacional, Regional/Local'),
(12,'Nacional, Base Moda It, Nacional');



INSERT INTO alright.veiculos_formatos (`veiculos_id`,`formatos`) VALUES
(1,'Standard IAB, Billboard e Interstitial, Diversos - 1 MM imp, Diversos - 2 MM imp, Video in-banner'),
(2,'Bumper ads, Pre-roll, Pre-roll sem skip, Display+pre-roll, Diversos'),
(3,'Áudio + Display'),
(4,'Pin, Takeover'),
(5,'Billboard, Dhtml, Superbanner, Retângulo, Halfbanner, Push, E-mail'),
(6,'Post Engagement, Video 3s Clique para site, Vários, Lead Ads, Event Engagement, Page like'),
(7,'Links patrocinados, Standard IAB'),
(8,'Native'),
(9,'Branded Channels, Playlist Personalizada, Playlist Patrocinada, Video Pre Roll, Spot Áudio, Gravação Spot, Banner 729X90. Fullbanner'),
(10,'standard IAB, Billboard e Interstitial, Pre-roll'),
(11,'Pre-roll'),
(12,'Publipost, Newsletter, Banner Carrossel, Banner Pequeno, Banner Newsletter, Banner, Push');

INSERT INTO alright.tipos_compras (`nome`,`multiplicador`) VALUES
('CPC',1),
('CPM',1000),
('CPE',1),
('CPV 3s',1),
('CPV 6s',1),
('CPV 7s',1),
('CPV 15s',1),
('CPV 30s',1),
('CPV físico',1),
('CPVisit',1),
('CPListening',1),
('Diária',1),
('Semana',1),
('Mensal',1),
('Unitário',1);