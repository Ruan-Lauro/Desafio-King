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

## Decisões da implementação

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
não foi configurada. O auxiliar dos testes ainda cria pastas temporárias sem
descarte explícito nos testes.

Detalhes da assistência por IA: [USO_DE_IA.md](USO_DE_IA.md).
