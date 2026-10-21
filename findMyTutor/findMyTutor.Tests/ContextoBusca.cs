using System.Text.Json;
using findMyTutor.DTOs;
using findMyTutor.Model;
using findMyTutor.Repositories;
using findMyTutor.Services.Impl;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.FileProviders;

namespace findMyTutor.Tests;

internal sealed class ContextoBusca : IDisposable
{
    private readonly string _pasta = Path.Combine(
        Path.GetTempPath(), "findMyTutor.Tests", Guid.NewGuid().ToString("N"));

    public ProfessorServicesImpl Servico { get; }

    public ContextoBusca(IEnumerable<Professor>? professores = null)
    {
        Directory.CreateDirectory(Path.Combine(_pasta, "Data"));
        var destino = Path.Combine(_pasta, "Data", "professores.json");

        if (professores is null)
        {
            File.Copy(Path.Combine(AppContext.BaseDirectory, "Data", "professores.json"), destino);
        }
        else
        {
            var options = new JsonSerializerOptions(JsonSerializerDefaults.Web);
            options.Converters.Add(new TimeOnlyJsonConverter());
            var dados = new ProfessoresData { Professores = professores.ToList() };
            File.WriteAllText(destino, JsonSerializer.Serialize(dados, options));
        }

        var repository = new ProfessorRepository(new AmbienteTeste(_pasta));
        Servico = new ProfessorServicesImpl(repository);
    }

    public static BuscarProfessoresDto Filtros(
        string idioma = "Inglês", string[]? dias = null,
        string inicio = "18:00", string fim = "20:00", int duracao = 60) => new()
    {
        Idioma = idioma,
        Dias = (dias ?? ["segunda"]).ToList(),
        InicioFaixa = inicio,
        FimFaixa = fim,
        DuracaoMinutos = duracao
    };

    public static Professor ProfessorLivre(
        int id = 1, string nome = "Professor teste",
        params Disponibilidade[] blocos) => new()
    {
        Id = id,
        Nome = nome,
        Idiomas = ["Inglês"],
        AgendaBloqueada = false,
        Disponibilidade = blocos.Length == 0
            ? [Bloco("segunda", "18:00", "22:00")]
            : blocos.ToList()
    };

    public static Disponibilidade Bloco(string dia, string inicio, string fim) => new()
    {
        Dia = dia,
        Inicio = TimeOnly.ParseExact(inicio, "HH:mm"),
        Fim = TimeOnly.ParseExact(fim, "HH:mm")
    };

    public void Dispose() => Directory.Delete(_pasta, recursive: true);

    private sealed class AmbienteTeste(string raiz) : IWebHostEnvironment
    {
        public string ApplicationName { get; set; } = "findMyTutor.Tests";
        public string EnvironmentName { get; set; } = "Testing";
        public string ContentRootPath { get; set; } = raiz;
        public string WebRootPath { get; set; } = raiz;
        public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
        public IFileProvider WebRootFileProvider { get; set; } = new NullFileProvider();
    }
}
