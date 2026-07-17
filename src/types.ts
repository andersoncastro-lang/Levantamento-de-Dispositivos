export interface Dispositivo {
  id: string;
  categoria: string;
  nome: string;
  quantidade: number;
}

export interface Ambiente {
  id: string;
  codigo: string;
  blocoId: string; // ID do Bloco
  tipo: string;
  nome: string;
  area: number; // m²
  peDireito: number; // m
  observacoes: string;
  dispositivos: Dispositivo[];
}

export interface Bloco {
  id: string;
  nome: string;
}

export interface Projeto {
  id: string;
  cliente: string;
  nome: string; // Nome do Projeto
  endereco: string;
  cidade: string;
  estado: string;
  dataVisita: string;
  tecnico: string;
  observacoes: string;
  blocos: Bloco[];
  ambientes: Ambiente[];
  createdAt: string;
}
