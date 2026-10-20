using findMyTutor.DTOs;
using findMyTutor.Services;
using findMyTutor.Services.Impl;
using Microsoft.AspNetCore.Mvc;

namespace findMyTutor.Controllers
{
    [ApiController]
    [Route("api/professores")]
    public class ProfessorController : ControllerBase
    {
        private readonly IProfessorServices _professorServices;

        public ProfessorController(
            IProfessorServices professorServices)
        {
            _professorServices = professorServices;
        }

        [HttpGet]
        public IActionResult BuscarTodos()
        {
            var professores = _professorServices.BuscarTodos();

            return Ok(professores);
        }

        [HttpPost("busca")]
        public ActionResult<ResultadoBuscaDto> Buscar(
            [FromBody] BuscarProfessoresDto filtros)
        {
            try
            {
                var resultado = _professorServices.Buscar(filtros);

                return Ok(resultado);
            }
            catch (ValidacaoBuscaException ex)
            {
                return BadRequest(new
                {
                    mensagem = ex.Message
                });
            }
        }
    }
}