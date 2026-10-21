# Find My Tutor — Front-end

Interface em React, TypeScript, Vite e Tailwind CSS para consultar professores
disponíveis na API .NET. Inclui filtros, estados de carregamento e erro,
professores não elegíveis e paginação local de três resultados por página.

## Requisitos

- Node.js 22.12 ou superior e npm.
- API em execução em https://localhost:7268, com certificado HTTPS confiável.

## Instalar e executar

Execute a partir da raiz do repositório (`Desafio-King`):

```powershell
cd findMyTutorFront
npm ci
npm run dev
```

Todas as dependências do front-end, incluindo React, Vite e Tailwind CSS, estão
definidas em `findMyTutorFront/package.json`. A instalação é feita somente nessa
pasta. Se o terminal já estiver em `findMyTutorFront`, comece por `npm ci`.

Acesse http://localhost:5173. A porta é fixa; se estiver ocupada, encerre a outra
instância antes de iniciar o front.

## Configurar a API

Por padrão, a aplicação usa `https://localhost:7268`. Para mudar o endereço,
crie um arquivo `.env.local` na pasta `findMyTutorFront`, usando `.env.example`
como referência:

```dotenv
VITE_API_URL=https://localhost:7268
```

Informe apenas a URL base. O formulário envia um POST para
`/api/professores/busca`, com idioma, dias, início e fim da faixa e duração.
Reinicie o Vite após alterar a variável. Para produção, o valor deve ser definido
antes da compilação, pois é incorporado ao bundle.

A API deve permitir a origem do front por CORS. As origens locais na porta 5173
já estão configuradas no back-end; alterações exigem reiniciar a API.

## Compilar

Na pasta `findMyTutorFront`:

```powershell
npm run build
```

O comando verifica o TypeScript e gera os arquivos de produção em `dist`.
Para visualizar essa compilação com o servidor de desenvolvimento parado:

```powershell
npm run preview -- --port 5173 --strictPort
```

A prévia usa a mesma porta autorizada pelo CORS da API.

## Processo de desenvolvimento e decisões técnicas

Após concluir a implementação principal da API, configurei o projeto com React,
TypeScript e Vite e instalei as dependências necessárias. Comecei pela estrutura
do formulário, pelo controle de estado dos campos e pela integração HTTP com
o back-end, organizando o envio dos filtros no `handleSubmit`.

Separei a apresentação dos professores em um componente responsável pela listagem
e pelo estado sem resultados. Mantive a interface simples e focada nos requisitos:
informar os filtros, consultar a API e apresentar os horários disponíveis e os
motivos de exclusão. Escolhi Tailwind CSS pela praticidade na composição do layout
e pela rapidez para ajustar a apresentação diretamente nos componentes.

Usei um formulário da King como referência visual e solicitei apoio da IA para
refinamentos estéticos e para revisar a cobertura dos requisitos. A assistência
também incluiu a paginação da listagem. A proposta visual inicial adicionou mais
elementos do que eu pretendia para o escopo da tela; revisei o resultado, removi
os elementos excedentes e ajustei o layout para manter o formulário e a busca
como foco da interface.

As sugestões da IA passaram por revisão e ajustes manuais antes da finalização
do front-end. O objetivo foi manter uma solução simples, coerente com a proposta
e integrada ao contrato da API.

## Organização da implementação

- `src/App.tsx`: formulário, validação e chamada HTTP no `handleSubmit`.
- `src/components/Professores/Professores.tsx`: resultados, exclusões e paginação.
- `src/types.ts`: tipos da aplicação e valores dos dias da semana.
- Estilização com classes do Tailwind nos componentes.
- Os filtros são obrigatórios; a duração inicial é de 60 minutos.
- Os nomes dos dias são exibidos com acentos, mas enviados como `terca` e `sabado`.
- A paginação ocorre no navegador e preserva a ordenação retornada pela API.

## Escopo e pendências

A interface e a integração local estão implementadas. Não há testes automatizados
do front-end nem configuração de publicação em produção.

Detalhes da assistência por IA: [USO_DE_IA.md](USO_DE_IA.md).
