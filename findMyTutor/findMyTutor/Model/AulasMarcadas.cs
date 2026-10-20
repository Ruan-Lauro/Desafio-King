namespace findMyTutor.Model
{
    public class AulasMarcadas
    {
        public required string Dia { get; set; }

        public TimeOnly Inicio { get; set; }

        public int DuracaoMinutos { get; set; }
    }
}
