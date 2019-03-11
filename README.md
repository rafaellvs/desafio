# desafio-dito

Página pro desafio em html, css, bootstrap e js.

# Descrição

A página contém uma tabela com alguns produtos listados, sendo possível vê-los, adicioná-los ao carrinho ou comprá-los. Cada botão gera um evento a um banco local, que pode ser visualizado pelo botão "renderEventsDB". Implementei o serviço de autocomplete por meio de um eventListener que detecta mudanças no input no campo de busca e renderiza, logo abaixo, os resultados encontrados no banco a partir do que está sendo pesquisado. Implementei a timeline mockando o json disponibilizado e manipulando os dados conforme meus conhecimentos. A timeline gerada e ordenada pode ser visualizada pelo botão "renderTimeline".

# Dificuldades

Minha ideia inicial era fazer um banco separado e implementar as APIs como requisitado, mas me precipitei na definição do prazo de entrega. Como tenho pouquíssimo conhecimento sobre banco de dados, me preocupei com uma solução primária e não deu tempo de estudar o que eu precisava pra desenvolver algo mais robusto.
Não consegui buscar o json direto da API, pois o fetch me lançava um erro com o qual eu não soube lidar:

Access to fetch at 'https://storage.googleapis.com/dito-questions/events.json' from origin 'https://www.google.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

Assim, manipulei os dados como consegui, mockando o json dentro do próprio arquivo *functions.js*.

O autocomplete quebra se o campo de busca for apagado usando ctrl+A ou selecionando mais de um caractere.

# Funções

O projeto contém 6 funções e 1 eventListener, brevemente descritos abaixo por ordem de implementação:

### newEvent()
Recebe, do *onclick* nos botões, a id do produto e a descrição do evento. Procura no banco de produtos (*productDB*) pelo id recebido, cria um objeto (contendo o nome do evento, timestamp, nome e preço do produto) e o adiciona ao banco de eventos (eventsDB).

### renderEventsDB()
Renderiza o banco de eventos, numa div logo abaixo do botão. Quebra cada objeto do banco e exibe suas propriedades atualizando o conteúdo html dessa div.

### input eventListener
Identifica cada caractere digitado e o adiciona ou remove do inputData. Verifica se o inputData tem correspondência no banco de eventos e os renderiza na div logo abaixo do campo de busca. Usei uma flag pra me certificar de que o mesmo elemento não é renderizado mais de uma vez e apagar o que já foi renderizado quando o inputData não mais tem correspondência.

### groupTimelineById()
Itera sobre o json e, se a timeline estiver vazia, cria um objeto com formato especificado (timestamp, revenue, transaction_id, store_name e products[]), preenchendo-o a transaction_id e timestamp. Caso contrário, verifica, iterando sobre a timeline, se já existe um evento com determinada transaction_id (cria o objeto em caso negativo). Retorna a timeline agrupada por transaction_ids únicos.

### fillTimeline()
Itera sobre os eventos do json e extrai sua transaction_id. Então, itera sobre a timeline procurando pela id correspondente e preenche seus objetos com base no evento avaliado. Retorna a timeline preenchida e ordenada.

### sortTimeline(timeline)
Recebe a timeline e a ordena.

### renderTimeline()
Renderiza a timeline numa div logo abaixo do botão. Quebra cada objeto e exibe suas propriedades atualizando o conteúdo html dessa div.

# Notas

Não sei se o resultado final está como o esperado. Acredito também que, usando um banco de dados de verdade, as buscas devem ser mais fáceis e eficientes. O que mais me deu trabalho foi quebrar o json. Foi meu primeiro contato real com o formato. O aprendizado foi massa e qualquer feedback é apreciado :)

Abraços,
Rafael
