namespace findMyTutor.DTOs
{
    public record ProfessorElegivelDto(
        int Id,
        string Nome,
        int AulasNaSemana,
        List<string> Horarios
    );

    public record ProfessorNaoElegivelDto(
        int Id,
        string Nome,
        string Motivo
    );

    public record ResultadoBuscaDto(
        List<ProfessorElegivelDto> Professores,
        List<ProfessorNaoElegivelDto> NaoElegiveis
    );
}
