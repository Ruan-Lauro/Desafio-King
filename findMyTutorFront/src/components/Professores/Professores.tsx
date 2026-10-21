import { useState } from 'react'
import Icon from '../Icon'
import { diasDaSemana } from '../../types'
import type { Filtro, ResultadoBusca } from '../../types'

const porPagina = 3

export default function Professores({ resultado, filtros }: { resultado: ResultadoBusca; filtros: Filtro }) {
  const [pagina, setPagina] = useState(1)
  const total = resultado.professores.length
  const totalPaginas = Math.ceil(total / porPagina)
  const professores = resultado.professores.slice((pagina - 1) * porPagina, pagina * porPagina)
  const dias = diasDaSemana.filter(dia => filtros.semana.includes(dia.valor)).map(dia => dia.curto).join(' · ')

  return (
    <section className="mx-auto max-w-6xl scroll-mt-8 px-3 py-14 sm:px-8 sm:py-16" id="resultados" aria-labelledby="result-title">
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h2 id="result-title" className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{total ? 'Encontramos o seu encaixe.' : 'Vamos tentar outro horário?'}</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">{total ? `${total} ${total === 1 ? 'professor disponível' : 'professores disponíveis'} para a sua rotina.` : 'Nenhum professor disponível para essa combinação. Ajuste os dias ou a faixa de horário e busque novamente.'}</p>
        </div>
        <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-xs font-semibold text-[#014F96]"><Icon name="globe" className="size-4" />{filtros.idioma}<span className="text-slate-300">·</span>{filtros.duracao} min</span>
      </div>

      {total > 0 && <>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {professores.map(professor => (
            <article className="flex flex-col rounded-md border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md" key={professor.id}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-900">{professor.nome}</h3>
                  <p className="mt-1 text-xs text-slate-500">{professor.aulasNaSemana} {professor.aulasNaSemana === 1 ? 'aula marcada' : 'aulas marcadas'} na semana</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-700"><span className="size-1.5 rounded-full bg-emerald-600" />Disponível</span>
              </div>
              <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-500"><Icon name="calendar" className="size-4 shrink-0 text-[#014F96]" /><span>{dias}</span><span className="ml-auto shrink-0">{filtros.duracao} min / aula</span></div>
              <p className="mb-3 mt-5 text-xs font-medium text-slate-500">Horários de início em comum</p>
              <ul className="mb-6 flex flex-wrap gap-2" aria-label={`Horários disponíveis de ${professor.nome}`}>
                {professor.horarios.map(horario => <li className="rounded-md border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold tabular-nums text-[#014F96]" key={horario}>{horario}</li>)}
              </ul>
              <p className="mt-auto flex items-start gap-1.5 text-[10px] leading-4 text-slate-500"><Icon name="check" className="size-3.5 shrink-0 text-emerald-600" />Mesmo horário em todos os dias escolhidos</p>
            </article>
          ))}
        </div>
        <nav className="mb-8 mt-6 flex flex-wrap items-center justify-between gap-4" aria-label="Paginação dos professores">
          <p className="text-xs text-slate-500">Mostrando {(pagina - 1) * porPagina + 1}–{Math.min(pagina * porPagina, total)} de {total} professores</p>
          {totalPaginas > 1 && <div className="flex gap-1.5">
            <button className="grid size-9 cursor-pointer place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35" type="button" disabled={pagina === 1} onClick={() => setPagina(pagina - 1)} aria-label="Página anterior"><Icon name="chevron" className="size-4 rotate-180" /></button>
            {Array.from({ length: totalPaginas }, (_, indice) => indice + 1).map(numero => (
              <button className={`grid size-9 cursor-pointer place-items-center rounded-lg border text-xs font-semibold ${pagina === numero ? 'border-[#014F96] bg-[#014F96] text-white' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-100'}`} type="button" key={numero} aria-label={`Página ${numero}`} aria-current={pagina === numero ? 'page' : undefined} onClick={() => setPagina(numero)}>{numero}</button>
            ))}
            <button className="grid size-9 cursor-pointer place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35" type="button" disabled={pagina === totalPaginas} onClick={() => setPagina(pagina + 1)} aria-label="Próxima página"><Icon name="chevron" className="size-4" /></button>
          </div>}
        </nav>
      </>}

      {resultado.naoElegiveis.length > 0 && <details className="group mt-7 rounded-md border border-slate-200 bg-white">
        <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 text-xs font-medium text-slate-600 [&::-webkit-details-marker]:hidden">Por que os outros professores não apareceram?<span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px]">{resultado.naoElegiveis.length}</span><Icon name="chevron" className="ml-auto size-4 shrink-0 transition-transform group-open:rotate-90" /></summary>
        <ul className="px-5 pb-2">{resultado.naoElegiveis.map(professor => 
          <li className="flex flex-col justify-between gap-1 border-t border-slate-100 py-3 text-xs sm:flex-row sm:gap-5" key={professor.id}>
            <strong className="font-semibold text-slate-700">{professor.nome}</strong>
            <span className="text-slate-500">{professor.motivo}</span>
          </li>)}
        </ul>
      </details>}
    </section>
  )
}
