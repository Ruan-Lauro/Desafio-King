using Xunit;
using static findMyTutor.Tests.ContextoBusca;
using findMyTutor.Services.Impl;

namespace findMyTutor.Tests;

public class ProfessorServicesTests
{
    [Fact]
    public void Buscar_ExcluiQuemNaoEnsinaIdiomaOuTemAgendaBloqueada()
    {
        var servico = new ContextoBusca().Servico;

        var resultado = servico.Buscar(Filtros());

        Assert.NotEmpty(resultado.Professores);
        Assert.DoesNotContain(resultado.Professores, p => p.Id == 3 || p.Id == 4);
        Assert.Equal("Agenda bloqueada", resultado.NaoElegiveis.Single(p => p.Id == 3).Motivo);
        Assert.Equal("Não ensina o idioma", resultado.NaoElegiveis.Single(p => p.Id == 4).Motivo);
    }

    [Fact]
    public void Buscar_ExigeMesmoHorarioEmTodosOsDias()
    {
        var servico = new ContextoBusca().Servico;

        var resultado = servico.Buscar(Filtros(dias: ["segunda", "quarta"]));

        Assert.Equal(new[] { 1, 6, 2, 7 }, resultado.Professores.Select(p => p.Id));
        Assert.Equal(new[] { "18:00" }, resultado.Professores.Single(p => p.Id == 1).Horarios);
        Assert.Equal("Sem horário em comum nos dias pedidos",
            resultado.NaoElegiveis.Single(p => p.Id == 8).Motivo);
    }

    [Fact]
    public void Buscar_AulaInteiraDeveCaberNoBlocoENaFaixa()
    {
        var servico = new ContextoBusca().Servico;

        var resultado = servico.Buscar(Filtros(
            dias: ["quarta"], inicio: "18:30", fim: "20:30", duracao: 90));

        Assert.DoesNotContain(resultado.Professores, p => p.Id == 2);
        Assert.Equal(new[] { "18:30" }, resultado.Professores.Single(p => p.Id == 6).Horarios);
        Assert.Equal(new[] { "18:30", "19:00" }, resultado.Professores.Single(p => p.Id == 1).Horarios);
    }

    [Fact]
    public void Buscar_ImpedeConflitoMasPermiteEncostarEmOutraAula()
    {
        var servico = new ContextoBusca().Servico;

        var resultado = servico.Buscar(Filtros(
            idioma: "Espanhol", dias: ["terca"], inicio: "08:00", fim: "10:00", duracao: 30));

        var diego = Assert.Single(resultado.Professores);
        Assert.Equal(4, diego.Id);
        Assert.Equal(new[] { "08:00", "09:00", "09:30" }, diego.Horarios);
    }

    [Fact]
    public void Buscar_OrdenaPorQuantidadeENome_ComIniciosEmHoraCheiaOuMeiaHora()
    {
        var servico = new ContextoBusca().Servico;

        var resultado = servico.Buscar(Filtros(inicio: "18:15"));

        Assert.Equal(new[] { "Elisa", "Fábio", "Bruno", "Gabriela" },
            resultado.Professores.Select(p => p.Nome));
        Assert.Equal(new[] { 0, 1, 2, 2 }, resultado.Professores.Select(p => p.AulasNaSemana));
        Assert.All(resultado.Professores,
            p => Assert.Equal(new[] { "18:30", "19:00" }, p.Horarios));
    }

    [Fact]
    public void Buscar_IdiomaVazio_DeveLancarErro()
    {
        var service = new ContextoBusca().Servico;
        var filtros = Filtros(idioma: "");

        var erro = Assert.Throws<ValidacaoBuscaException>(
            () => service.Buscar(filtros)
        );

        Assert.Equal("Informe o idioma.", erro.Message);

    }

    [Fact]
    public void Buscar_DuracaoInvalida_DeveLancarErro()
    {
        var service = new ContextoBusca().Servico;
        var filtros = Filtros(duracao: 45);
        var erro = Assert.Throws<ValidacaoBuscaException>(
            () => service.Buscar(filtros)
        );
        Assert.Equal("Duração da aula deve ser 30, 60 ou 90 minutos.", erro.Message);
    }
}
