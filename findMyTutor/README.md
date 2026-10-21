# Find My Tutor — Back-end

API REST em C# e .NET 8 para buscar professores por idioma, dias, faixa de horário
e duração da aula. Os dados são carregados de `findMyTutor/Data/professores.json`
e mantidos em memória. Não é necessário configurar banco de dados.

## Requisitos

- SDK do .NET 8 ou superior, com suporte ao alvo .NET 8.
- Certificado HTTPS de desenvolvimento confiável no computador.

## Compilar e executar

Na raiz do repositório (`Desafio-King`), entre na pasta do back-end:

```powershell
cd findMyTutor
dotnet restore findMyTutor/findMyTutor.csproj
dotnet build findMyTutor/findMyTutor.csproj
dotnet run --project findMyTutor/findMyTutor.csproj --launch-profile https
```

Se o certificado de desenvolvimento ainda não estiver configurado:

```powershell
dotnet dev-certs https --trust
```

- API: https://localhost:7268
- Swagger em desenvolvimento: https://localhost:7268/swagger

## Configuração

As portas e o ambiente de desenvolvimento são definidos em
`findMyTutor/Properties/launchSettings.json`.

A política CORS em `findMyTutor/Program.cs` permite buscas a partir de
`http://localhost:5173` e `http://127.0.0.1:5173`. Caso a origem do front mude,
atualize essa política e reinicie a API. O JSON deve permanecer na pasta `Data`
do projeto da API.

## Busca

`POST /api/professores/busca`

```json
{
  "idioma": "Espanhol",
  "dias": ["segunda"],
  "inicioFaixa": "18:00",
  "fimFaixa": "20:00",
  "duracaoMinutos": 60
}
```

A resposta contém `professores`, com os horários disponíveis e a quantidade de
aulas na semana, e `naoElegiveis`, com os motivos de exclusão. Filtros inválidos
retornam 400; uma busca válida sem resultados retorna 200 com a lista vazia.

## Processo de desenvolvimento e decisões técnicas

Inicialmente, planejei utilizar nomes em inglês. Após analisar a seção "O que
construir" do enunciado, optei por adotar o português nos modelos, DTOs e métodos
relacionados ao domínio, alinhando o vocabulário do código ao contrato apresentado
na proposta. Essa foi uma escolha de padronização, não uma exigência explícita
do desafio.

Comecei pelos modelos para representar a estrutura do JSON e definir os dados
esperados pela aplicação. Mantive as classes em arquivos separados e organizei
o projeto em modelos, repositório, serviço, DTOs e controller, com responsabilidades
distintas. O repositório concentra a leitura e a desserialização do arquivo;
o serviço aplica as regras de negócio; o controller trata a entrada e a resposta HTTP.

Depois de iniciar a estrutura do serviço, priorizei a implementação do repositório
e dos endpoints de consulta para validar o carregamento dos dados e obter um
retorno inicial da API. Em seguida, defini os DTOs de requisição e resposta,
separando os filtros recebidos dos dados de cadastro dos professores e do resultado
calculado pela busca. Isso estabeleceu o contrato da API antes de concluir a lógica.

Com essa estrutura, implementei as regras de disponibilidade, refinei a busca e
revisei a organização do código a partir dos cenários do enunciado. A validação
incluiu requisições manuais pelo Swagger e testes automatizados com xUnit sobre
o serviço. Por preocupação com o prazo, escrevi a implementação antes dos testes,
sem seguir desenvolvimento orientado a testes (TDD). Considero essa sequência um
ponto de melhoria no meu processo: os testes foram adicionados posteriormente
para verificar as regras e os casos de erro.

Também implementei um endpoint para listar os idiomas cadastrados, considerando
que o back-end poderia fornecer as opções do formulário. Ao revisar os requisitos,
percebi que a interface já deveria oferecer Inglês, Espanhol e Francês. Por isso,
mantive essas opções fixas no front-end, sem depender desse endpoint adicional.
O recurso lista idiomas, não cursos, e permanece como uma consulta complementar.

## Comportamentos da busca

- O mesmo início precisa estar disponível em todos os dias solicitados.
- Comparações de idioma e dias ignoram maiúsculas e espaços nas extremidades;
  dias repetidos são considerados uma vez.
- Dias usam os valores `segunda`, `terca`, `quarta`, `quinta`, `sexta`, `sabado`
  e `domingo`.
- Aulas podem encostar, mas não se sobrepor, e começam somente em `:00` ou `:30`.
- A ordenação considera todas as aulas da semana e, no empate, o nome em português.
- Uma faixa menor que a duração ou um idioma sem professores gera resultado vazio.

## Testes

Na pasta `findMyTutor`, execute:

```powershell
dotnet test findMyTutor.Tests/findMyTutor.Tests.csproj
```

São sete testes com xUnit, cobrindo as regras principais e os erros de idioma
vazio e duração inválida. Eles não precisam da API em execução.

## Escopo e pendências

A configuração descrita é para desenvolvimento local; a publicação em produção
não foi configurada. As pastas temporárias dos testes são removidas pelo descarte
do contexto ao final de cada teste.

Detalhes da assistência por IA: [USO_DE_IA.md](USO_DE_IA.md).
