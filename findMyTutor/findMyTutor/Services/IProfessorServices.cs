using findMyTutor.DTOs;
using findMyTutor.Model;

namespace findMyTutor.Services
{
    public interface IProfessorServices
    {
        ResultadoBuscaDto Buscar(BuscarProfessoresDto filtros);
        List<Professor> BuscarTodos();
        List<string> ListarIdiomas();
    }
}
