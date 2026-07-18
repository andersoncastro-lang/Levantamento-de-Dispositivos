export const CATEGORIAS_DISPOSITIVOS = [
  'Central',
  'Detectores',
  'Acionadores',
  'Avisadores',
  'Interfaces',
  'Módulos',
  'Acessórios'
];

export const DISPOSITIVOS_POR_CATEGORIA: Record<string, string[]> = {
  'Central': [
    'FHT15-Central Alarme SubRede - 21006',
    'FHT7-Central Wireless 7 Polegadas - 21026',
    'FHT15-Central Wireless - 21005',
    'FHT 7-Central Wireless SubRede - 21028'
  ],
  'Detectores': [
    'Detector Fumaça Óptico/Termovelocimétrico 2.0 Entreforro',
    'Detector de Fumaça Óptico Multicritério 2.0'
  ],
  'Acionadores': [
    'Acionador Manual DC IP67 2.0',
    'Acionador Manual DC Classificação EXd',
    'Acionador Manual de Emergência DC IP66',
    'Botão de Pânico - 31511'
  ],
  'Avisadores': [
    'Repetidor AC IP66 Sirene 120 dB/Visual Xênon - 21185',
    'Repetidor Fotovoltáico IP66 Sirene/Visual',
    'Repetidor AC IP66 Sirene bitonal/Visual - 21166'
  ],
  'Interfaces': [
    'Repetidor AC IP66 2 Relês (5A) 21167',
    'Repetidor AC IP62 com Sensor de Gás 21170',
    'Repetidor AC Integração Detector Linear 21173',
    'Monitor de Alertas para Central Cabeada DC',
    'Monitor de Alertas para Chave de Fluxo',
    'Repetidor AC IP66 I/O (5A)'
  ],
  'Módulos': [
    'Supervisora MirrorBox MBM FHT - 21021',
    'Módulo Supervisor MirrorBox - 21020',
    'Repetidor AC IP66 I/O (5A) 21172',
    'Monitor de Alertas Para Temperatura',
    'Monitor de Alertas Porta Aberta c/ Buzzer',
    'Monitor de Alertas Porta Aberta',
    'Monitor de Alertas'
  ],
  'Acessórios': [
    'Repetidor de Sinal Wireless Fotovoltáico IP66',
    'Repetidor AC IP66 21181'
  ]
};

export const TIPOS_AMBIENTE = [
  'Armazenagem',
  'Recebimento',
  'Expedição',
  'CPD',
  'Sala Elétrica',
  'Casa de Bombas',
  'Escritório',
  'Refeitório',
  'Vestiário',
  'Almoxarifado',
  'Outro'
];

export const ESTADOS_BR = [
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
];
