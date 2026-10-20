namespace findMyTutor.Model
{
    public class Professor
    {
        public int Id { get; set; }
        public required string Nome { get; set; }
        public required List<string> Idiomas { get; set; }
        public required bool AgendaBloqueada { get; set; }
        public List<Disponibilidade> Disponibilidade { get; set; } = [];
        public List<AulasMarcadas> AulasMarcadas { get; set; } = [];

    }
}
