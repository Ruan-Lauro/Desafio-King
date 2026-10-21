import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import Icon from './components/Icon'
import Professores from './components/Professores/Professores'
import { diasDaSemana } from './types'
import type { Filtro, ResultadoBusca } from './types'

const apiUrl = (import.meta.env.VITE_API_URL || 'https://localhost:7268').replace(/\/$/, '')
const campo = 'mt-2 h-12 w-full rounded-md border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-800 outline-none transition focus:border-[#014F96] focus:ring-3 focus:ring-blue-100 disabled:opacity-60'
const rotulo = 'block text-[10px] font-bold uppercase tracking-[.14em] text-slate-500'

function mensagemDaApi(dados: unknown): string {
  if (typeof dados !== 'object' || dados === null) {
    return 'Não foi possível realizar a busca. Confira os filtros e tente novamente.'
  }

  const erro = dados as Record<string, unknown>

  if (typeof erro.mensagem === 'string') return erro.mensagem
  if (typeof erro.detail === 'string') return erro.detail

  if (erro.errors && typeof erro.errors === 'object') {
    return Object.values(erro.errors)
      .flat()
      .filter((valor): valor is string => typeof valor === 'string')
      .join(' ') || 'Não foi possível realizar a busca. Confira os filtros e tente novamente.'
  }

  return 'Não foi possível realizar a busca. Confira os filtros e tente novamente.'
}

function App() {
  const [filtro, setFiltro] = useState<Filtro>({ idioma: '', semana: [], inicio: '', fim: '', duracao: 60 })
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [resultado, setResultado] = useState<ResultadoBusca | null>(null)
  const [buscaRealizada, setBuscaRealizada] = useState<Filtro | null>(null)

  useEffect(() => {
    if (resultado) {
      document.getElementById('resultados')?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        block: 'start',
      })
    }
  }, [resultado])

  function alternarDia(dia: string) {
    setFiltro(atual => ({
      ...atual,
      semana: atual.semana.includes(dia) ? atual.semana.filter(valor => valor !== dia) : [...atual.semana, dia],
    }))
    setErro('')
  }

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (carregando) return
    setErro('')
    if (!filtro.semana.length) {
      setErro('Escolha pelo menos um dia da semana.')
      return
    }
    if (filtro.fim <= filtro.inicio) {
      setErro('O horário final deve ser posterior ao horário inicial.')
      return
    }

    setCarregando(true)
    setResultado(null)

    try {
      const resposta = await fetch(`${apiUrl}/api/professores/busca`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idioma: filtro.idioma,
          dias: filtro.semana,
          inicioFaixa: filtro.inicio,
          fimFaixa: filtro.fim,
          duracaoMinutos: filtro.duracao,
        }),
      })
      const dados = await resposta.json().catch(() => null)
      if (!resposta.ok) throw new Error(mensagemDaApi(dados))
      if (!dados || !Array.isArray(dados.professores) || !Array.isArray(dados.naoElegiveis)) {
        throw new Error('Não foi possível ler o resultado da busca. Tente novamente.')
      }
      setBuscaRealizada({ ...filtro, semana: [...filtro.semana] })
      setResultado(dados)
    } catch (falha) {
      if (falha instanceof DOMException && falha.name === 'AbortError') {
        setErro('A busca demorou mais que o esperado. Tente novamente.')
      } else if (falha instanceof TypeError) {
        setErro('Não foi possível conectar à busca de professores. Tente novamente em instantes.')
      } else {
        setErro(falha instanceof Error ? falha.message : 'Algo deu errado. Tente novamente.')
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] font-sans text-slate-900 antialiased selection:bg-rose-200 selection:text-slate-900 [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-[#014F96]">
      <div className="relative isolate overflow-hidden bg-[linear-gradient(125deg,#014F96_0%,#073e73_48%,#071e37_100%)] text-white">
        <header className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-3 py-7 sm:px-8">
          <a href="#" aria-label="Find My Tutor, início" className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight">
            <span className="grid size-10 place-items-center rounded-xl bg-[#CC213A] shadow-lg shadow-black/10"><Icon name="book" className="size-5" /></span>
            <span>find<span className="font-normal text-blue-200">my</span>tutor<span className="text-[#f27e90]">.</span></span>
          </a>
        </header>

        <main>
          <section className="mx-auto max-w-6xl flex flex-col lg:flex-row max-lg:items-center items-self gap-10 px-3 pb-16 pt-5 sm:px-8 lg:gap-16 lg:pb-20 lg:pt-9" aria-labelledby="hero-title">
            <div className="max-w-xl pb-1 lg:pb-8 max-lg:text-center">
              <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-[9px] font-semibold tracking-[.18em] text-blue-100 sm:text-[10px]"><span className="size-1.5 rounded-full bg-[#f66b80]" />NOVO IDIOMA</p>
              <h1 id="hero-title" className="text-4xl md:text-5xl xl:text-6xl font-bold">Encontre o<br />professor correto<br />que siga <span className="relative inline-block text-blue-200">o ritmo.<span aria-hidden="true" className="absolute -bottom-2 left-0 h-1 w-full -rotate-2 rounded-full bg-[#CC213A]" /></span></h1>
              <p className="mt-8 max-w-97.5 text-[15px] leading-7 text-blue-100/85">Encontre o professor de acordo com sua disponibilidade e preferências.</p>
            </div>

            <div className="w-full max-w-lg justify-self-center lg:justify-self-end">
              <div className="rounded-md border border-white/40 bg-white p-6 text-slate-900 shadow-2xl shadow-[#00162f]/25 sm:p-8">
                <h2 className="text-[26px] font-bold mb-5">Preencha o formulário</h2>
                <form onSubmit={handleSubmit} aria-describedby={erro ? 'form-error' : undefined} className="flex flex-col">
                  <fieldset disabled={carregando} className="space-y-5 disabled:opacity-70">
                    <div>
                      <label htmlFor="idioma" className={rotulo}>Qual idioma você quer aprender?</label>
                      <select id="idioma" name="idioma" className={campo} value={filtro.idioma} onChange={evento => setFiltro({ ...filtro, idioma: evento.target.value })} required>
                        <option value="" disabled>Selecione um idioma</option>
                        {['Inglês', 'Espanhol', 'Francês'].map(idioma => <option key={idioma} value={idioma}>{idioma}</option>)}
                      </select>
                    </div>

                    <fieldset aria-describedby="dias-ajuda">
                      <legend className={rotulo}>Quais dias funcionam para você?</legend>
                      <div className="mt-3 grid grid-cols-7 gap-1.5">
                        {diasDaSemana.map(dia => <label key={dia.valor} className="cursor-pointer">
                          <input className="peer sr-only" type="checkbox" id={`dia-${dia.valor}`} name="dias" value={dia.valor} checked={filtro.semana.includes(dia.valor)} onChange={() => alternarDia(dia.valor)} aria-label={dia.nome} />
                          <span className="flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white text-[11px] font-semibold text-slate-500 transition hover:border-blue-300 peer-checked:border-[#014F96] peer-checked:bg-[#014F96] peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#014F96]">{dia.curto}</span>
                        </label>)}
                      </div>
                      <p id="dias-ajuda" className="mt-2 text-[10px] text-slate-400">Pode escolher mais de um dia.</p>
                    </fieldset>

                    <div>
                      <p className={rotulo}>Em qual faixa de horário?</p>
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        <div><label htmlFor="inicio" className="text-[11px] text-slate-500">A partir de</label><input className={`${campo} mt-1.5 min-w-0`} type="time" id="inicio" name="inicioFaixa" step="60" value={filtro.inicio} onChange={evento => setFiltro({ ...filtro, inicio: evento.target.value })} required /></div>
                        <div><label htmlFor="fim" className="text-[11px] text-slate-500">Até</label><input className={`${campo} mt-1.5 min-w-0`} type="time" id="fim" name="fimFaixa" step="60" value={filtro.fim} onChange={evento => setFiltro({ ...filtro, fim: evento.target.value })} required /></div>
                      </div>
                    </div>

                    <fieldset>
                      <legend className={rotulo}>Quanto tempo para cada aula?</legend>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {[30, 60, 90].map(duracao => <label key={duracao} className="cursor-pointer">
                          <input className="peer sr-only" type="radio" name="duracaoMinutos" value={duracao} checked={filtro.duracao === duracao} onChange={() => setFiltro({ ...filtro, duracao })} />
                          <span className="flex h-10 items-center justify-center gap-1 rounded-md border border-slate-200 text-xs font-medium text-slate-500 transition hover:border-blue-300 peer-checked:border-[#014F96] peer-checked:bg-blue-50 peer-checked:font-bold peer-checked:text-[#014F96] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#014F96]">{duracao}<span className="font-normal">min</span></span>
                        </label>)}
                      </div>
                    </fieldset>

                    {erro && <p id="form-error" role="alert" className="rounded-md border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs leading-5 text-[#a01830]">{erro}</p>}

                    <button type="submit" disabled={carregando} className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-md bg-[#CC213A] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-900/15 transition  hover:bg-[#b41c32] active:translate-y-0 disabled:cursor-wait disabled:opacity-70 motion-reduce:transform-none">
                      {carregando ? <><span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white motion-reduce:animate-none" />Buscando professores...</> : <>Encontrar professor<Icon name="arrow" className="size-4" /></>}
                    </button>
                  </fieldset>
                  <p className="mt-4 text-center text-[10px] text-slate-400">Todos os campos são obrigatórios.</p>
                </form>
              </div>
              
            </div>
          </section>
        </main>
      </div>

      <div role="status" aria-live="polite" className="sr-only">{carregando ? 'Buscando professores.' : resultado ? `${resultado.professores.length} professores encontrados.` : ''}</div>

      {resultado && buscaRealizada ? 
        <Professores resultado={resultado} filtros={buscaRealizada} /> 
      : carregando ? (
        <section aria-label="Carregando professores" className="mx-auto max-w-6xl px-6 py-14 sm:px-8">
          <p className="mb-6 text-sm text-slate-500">Procurando professores na sua semana...</p>
          <div aria-hidden="true" className="grid gap-5 md:grid-cols-3">{[1, 2, 3].map(numero => <div key={numero} className="h-60 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 motion-reduce:animate-none" />)}
          </div>
        </section>
      ) : null}

    </div>
  )
}

export default App
