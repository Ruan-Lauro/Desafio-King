using findMyTutor.DTOs;
using findMyTutor.Model;
using findMyTutor.Repositories;
using System.Globalization;

namespace findMyTutor.Services.Impl
{
    public class ValidacaoBuscaException : Exception
    {
        public ValidacaoBuscaException(string mensagem)
            : base(mensagem)
        {
        }
    }
    public class ProfessorServicesImpl : IProfessorServices
    {

        private readonly ProfessorRepository _repository;

        private static readonly HashSet<string> DiasValidos =
           new(StringComparer.OrdinalIgnoreCase)
           {
                "segunda",
                "terca",
                "quarta",
                "quinta",
                "sexta",
                "sabado",
                "domingo"
           };

        public ProfessorServicesImpl(ProfessorRepository repository)
        {
            _repository = repository;
        }


        public ResultadoBuscaDto Buscar(BuscarProfessoresDto filtros)
        {
            if(filtros is null)
            {
                throw new ValidacaoBuscaException("Informe os filtros de busca.");
            }

            if (string.IsNullOrWhiteSpace(filtros.Idioma))
            {
                throw new ValidacaoBuscaException("Informe o idioma.");
            }

            if (filtros.Dias is null || filtros.Dias.Count == 0)
            {
                throw new ValidacaoBuscaException("Informe pelo menos um dia da semana.");
            }

            var possuiDiasInvalidos = filtros.Dias.Any(dia => 
                string.IsNullOrWhiteSpace(dia) || 
                !DiasValidos.Contains(dia.Trim())
            );
            
            if (possuiDiasInvalidos)
            {
                throw new ValidacaoBuscaException(
                    "Dia inválido. Use segunda, terca, quarta, " +
                    "quinta, sexta, sabado ou domingo."
                );
            }

            var inicioFaixa = LerHorario(filtros.InicioFaixa, "Inicio da Faixa");
            var fimFaixa = LerHorario(filtros.FimFaixa, "Fim da Faixa");

            if(inicioFaixa >= fimFaixa)
            {
                throw new ValidacaoBuscaException(
                    "Inicio de Faixa deve ser menor que Fim da Faixa."
                );
            }

            if(filtros.DuracaoMinutos is not (30 or 60 or 90))
            {
                throw new ValidacaoBuscaException(
                    "Duração da aula deve ser 30, 60 ou 90 minutos."
                );
            }

            var idioma = filtros.Idioma.Trim();
            var dias = filtros.Dias.Select(dia => dia.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray();

            var duracao = filtros.DuracaoMinutos;

            var elegiveis = new List<ProfessorElegivelDto>();

            var naoElegiveis = new List<ProfessorNaoElegivelDto>();

            var professores = _repository.BuscarTodos();

            foreach (var professor in professores)
            {
                var ensinaIdioma = professor.Idiomas.Any(
                    idiomaProfessor => string.Equals(
                        idiomaProfessor,
                        idioma,
                        StringComparison.OrdinalIgnoreCase
                    )
                );

                if (!ensinaIdioma)
                {
                    naoElegiveis.Add(new(
                        professor.Id,
                        professor.Nome,
                        "Não ensina o idioma"
                    ));

                    continue;
                }

                if (professor.AgendaBloqueada)
                {
                    naoElegiveis.Add(new(
                        professor.Id,
                        professor.Nome,
                        "Agenda bloqueada"
                    ));

                    continue;
                }

                var horarios = Enumerable
                    .Range(0, 48)
                    .Select(posicao => posicao * 30)
                    .Where(inicio =>
                        inicio >= inicioFaixa &&
                        inicio + duracao <= fimFaixa
                    )
                    .Where(inicio =>
                        dias.All(dia =>
                            PodeDarAula(
                                professor,
                                dia,
                                inicio,
                                inicio + duracao
                            )
                        )
                    )
                    .Select(inicio =>
                        new TimeOnly(inicio / 60, inicio % 60)
                            .ToString(
                                "HH:mm",
                                CultureInfo.InvariantCulture
                            )
                    )
                    .ToList();

                if (horarios.Count == 0)
                {
                    naoElegiveis.Add(new(
                        professor.Id,
                        professor.Nome,
                        "Sem horário em comum nos dias pedidos"
                    ));

                    continue;
                }
       
                elegiveis.Add(new(
                    professor.Id,
                    professor.Nome,
                    professor.AulasMarcadas.Count,
                    horarios
                ));
            } 

            var ordenados = elegiveis
                .OrderBy(professor => professor.AulasNaSemana)
                .ThenBy(
                    professor => professor.Nome,
                    StringComparer.Create(
                        CultureInfo.GetCultureInfo("pt-BR"),
                        ignoreCase: true
                    )
                )
                .ThenBy(professor => professor.Id)
                .ToList();

            return new ResultadoBuscaDto(
                ordenados,
                naoElegiveis
            );

        }

        private static bool PodeDarAula(
            Professor professor,
            string dia,
            int inicio,
            int fim
        )
        {
            var cabeEmUmBloco = professor.Disponibilidade.Any(
                bloco =>
                    string.Equals(
                        bloco.Dia,
                        dia,
                        StringComparison.OrdinalIgnoreCase
                    )
                    && inicio >= Minutos(bloco.Inicio)
                    && fim <= Minutos(bloco.Fim)
            );

            if (!cabeEmUmBloco)
            {
                return false;
            }

            var temConflito = professor.AulasMarcadas.Any(
                aula =>
                    string.Equals(
                        aula.Dia,
                        dia,
                        StringComparison.OrdinalIgnoreCase
                    )
                    && inicio <
                        Minutos(aula.Inicio) + aula.DuracaoMinutos
                    && fim > Minutos(aula.Inicio)
            );

            return !temConflito;
        }

        private static int LerHorario(string? valor, string campo)
        {
            if (
                valor is null ||
                valor.Length != 5 ||
                !TimeOnly.TryParseExact(
                    valor,
                    "HH:mm",
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.None,
                    out var horario
                )
            )
            {
                throw new ValidacaoBuscaException(
                    $"{campo} deve ser um horário válido " +
                    "no formato HH:mm."
                );
            }

            return Minutos(horario);
        }

        private static int Minutos(TimeOnly horario)
        {
            return horario.Hour * 60 + horario.Minute;
        }

        public List<Professor> BuscarTodos()
        {
            return _repository.BuscarTodos();
        }

        public List<string> ListarIdiomas()
        {
            var professores = _repository.BuscarTodos();
            var idiomas = professores
                .SelectMany(professor => professor.Idiomas)
                .Distinct()
                .ToList();
            return idiomas;
        }
    }
}
