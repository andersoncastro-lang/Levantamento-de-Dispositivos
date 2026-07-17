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
    'Central de Incêndio Endereçável 1 Laço',
    'Central de Incêndio Endereçável 2 Laços',
    'Central de Incêndio Endereçável 4 Laços',
    'Central de Incêndio Convencional',
    'Painel Repetidor de Alarme',
    'Subcentral de Comando',
  ],
  'Detectores': [
    'Detector Óptico de Fumaça Endereçável',
    'Detector Termovelocimétrico Endereçável',
    'Detector de Temperatura Fixo Endereçável',
    'Detector de Fumaça por Amostragem de Ar (Vesda)',
    'Detector Linear de Fumaça (Beam Detector)',
    'Detector Óptico de Fumaça Convencional',
    'Detector Termovelocimétrico Convencional',
    'Detector de Chama UV/IR',
  ],
  'Acionadores': [
    'Acionador Manual Endereçável (Botoeira - Quebre o Vidro)',
    'Acionador Manual Endereçável com Martelo',
    'Acionador Manual Endereçável de Dupla Ação (Puxe e Aperte)',
    'Acionador Manual Convencional',
    'Acionador de Emergência para Abandono de Área',
  ],
  'Avisadores': [
    'Sirene Audiovisual Endereçável de Parede',
    'Sirene Audiovisual Convencional',
    'Sirene de Alarme Somente Áudio Bitonal',
    'Giroflex / Estrobo de Alerta Visual',
    'Campainha de Incêndio Industrial',
    'Sirene Direcional por Voz',
  ],
  'Interfaces': [
    'Módulo Isolador de Laço',
    'Módulo de Entrada Endereçável (Monitor de Contato)',
    'Módulo de Saída Relé Endereçável',
    'Módulo de Controle de Sirenes (Kits de Disparo)',
    'Módulo de Controle de Válvulas / Damper',
  ],
  'Módulos': [
    'Módulo de Zona Convencional (MZC)',
    'Módulo de Interface Convencional/Endereçável',
    'Módulo de Entrada e Saída Integrado (MIO)',
    'Módulo Repetidor de Sinal',
  ],
  'Acessórios': [
    'Bateria Selada 12V 7Ah',
    'Bateria Selada 12V 18Ah',
    'Cabo de Incêndio Blindado 2x1.5mm² (por metro)',
    'Cabo de Incêndio Blindado 3x1.5mm² (por metro)',
    'Protetor Acrílico para Acionador Manual',
    'Caixa de Sobrepor para Botoeira',
    'Fonte Auxiliar de Alimentação 24V',
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
