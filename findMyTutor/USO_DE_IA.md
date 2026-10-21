# Uso de IA — Back-end

Ferramenta utilizada: Codex (OpenAI).

A IA foi utilizada como apoio na criação das classes de modelo, na revisão de
algumas regras de negócio e na elaboração dos testes automatizados com xUnit.
Os refinamentos envolveram a interseção de horários entre os dias solicitados,
a verificação de sobreposição de aulas e os limites dos intervalos de disponibilidade.

As sugestões foram revisadas e integradas pelo autor à implementação em C#.

## Erro identificado e ajuste

A proposta inicial de testes gerou uma suíte e uma infraestrutura mais complexas
do que o necessário para o projeto. Isso foi identificado na revisão do código.
A suíte foi reduzida aos cinco cenários principais do desafio e, posteriormente,
recebeu dois testes de validação, totalizando sete testes.
