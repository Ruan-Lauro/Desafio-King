export type Filtro = {
  idioma: string
  semana: string[]
  inicio: string
  fim: string
  duracao: number
}

export type Professor = {
  id: number
  nome: string
  aulasNaSemana: number
  horarios: string[]
}

export type ResultadoBusca = {
  professores: Professor[]
  naoElegiveis: { id: number; nome: string; motivo: string }[]
}

export const diasDaSemana = [
  { valor: 'segunda', nome: 'Segunda', curto: 'Seg' },
  { valor: 'terca', nome: 'Terça', curto: 'Ter' },
  { valor: 'quarta', nome: 'Quarta', curto: 'Qua' },
  { valor: 'quinta', nome: 'Quinta', curto: 'Qui' },
  { valor: 'sexta', nome: 'Sexta', curto: 'Sex' },
  { valor: 'sabado', nome: 'Sábado', curto: 'Sáb' },
  { valor: 'domingo', nome: 'Domingo', curto: 'Dom' },
]
