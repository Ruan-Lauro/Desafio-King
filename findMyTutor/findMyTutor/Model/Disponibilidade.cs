namespace findMyTutor.Model
{
    public class Disponibilidade
    {
        public required string Dia { get; set; }

        public TimeOnly Inicio { get; set; }

        public TimeOnly Fim { get; set; }
    }
}
