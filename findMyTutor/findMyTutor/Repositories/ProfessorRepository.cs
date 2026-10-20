using findMyTutor.Model;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Globalization;

namespace findMyTutor.Repositories
{
    public class ProfessorRepository
    {
        private readonly List<Professor> _professores;

        public ProfessorRepository(IWebHostEnvironment environment)
        {
            var caminho = Path.Combine(
                environment.ContentRootPath,
                "Data",
                "professores.json"
            );

            var json = File.ReadAllText(caminho);

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            options.Converters.Add(
                new TimeOnlyJsonConverter()
            );

            var dados = JsonSerializer.Deserialize<ProfessoresData>(
                json,
                options
            );

            _professores = dados?.Professores ?? [];
        }

        public List<Professor> BuscarTodos()
        {
            return _professores;
        }
    }

    public class TimeOnlyJsonConverter : JsonConverter<TimeOnly>
    {
        private const string Formato = "HH:mm";

        public override TimeOnly Read(
            ref Utf8JsonReader reader,
            Type typeToConvert,
            JsonSerializerOptions options)
        {
            var valor = reader.GetString();

            if (TimeOnly.TryParseExact(
                valor,
                Formato,
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out var horario))
            {
                return horario;
            }

            throw new JsonException(
                $"Horário inválido: '{valor}'. Use o formato HH:mm."
            );
        }

        public override void Write(
            Utf8JsonWriter writer,
            TimeOnly value,
            JsonSerializerOptions options)
        {
            writer.WriteStringValue(
                value.ToString(Formato, CultureInfo.InvariantCulture)
            );
        }
    }
}