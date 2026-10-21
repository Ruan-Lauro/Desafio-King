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
npm ci
cd findMyTutorFront
npm ci
npm run dev
```

A instalação na raiz é necessária porque as dependências do Tailwind estão no
`package.json` da raiz. React e Vite são instalados na pasta do front-end.

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

## Organização e decisões

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
