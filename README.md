# Sobre
Este é um projeto Angular focado no Frontend onde foi utilizado tecnologias/bibliotecas como PrimeNG, TailwindCSS,  JSON Server, NgRx e muitas outras. Foi criado usando o conceito de mobile-first onde foi decidido construir a versão mobile primeiro, usando como padrão uma largura de 350px. Por padrão os nomes de classe, função, entre outros, estão seguindo a convenção de nomes em inglês.

O projeto se define em um site para cadastrar clientes, fazer o login com sua própria conta e analisar os clientes já cadastrados em uma lista paginada com filtros de país e estado, com opções de deletar e editar clientes.

# Como executar a aplicação?
1. Baixe ou clone o projeto e abra a pasta que contém todos os arquivos e configurações no editor de código.
2. Abra o terminal e execute `npm install` para baixar a biblioteca e dependências e aguarde a instalação.
3. No mesmo terminal, execute `ng serve` para executar a aplicação.
4. Abra um novo terminal e execute `json-server db.json` para ligar o servidor mockado e rodar a API. Após isso a aplicação está completamente funcional.

Para a execução de testes unitários, execute em outro terminal o comando `ng test` para executar os testes. Para obter a porcentagem de cobertura de teste do código, execute `ng test --code-coverage`
Obs: Para executar os comandos de teste é necessário ter o Google Chrome instalado

Para observar a cobertura de código de maneira mais visual, após executar o comando de code coverage, busque no diretório do projeto a pasta "coverage" e após isso entre na pasta do projeto "sign-up-form" e execute o arquivo "index.html"
`Projeto > coverage > sign-up-form > index.html`

# Páginas
## Registro
Na página de registro é um formulário com oito campos, sendo esses: nome, email, país, estado, CPF, data de nascimento, número de contato e o tipo do número (residencial, WhatsApp, celular). Praticamente todos os campos são obrigatório, tirando CPF em certas condições. Quando o usuário é registrado, aparece um toast e o redireciona para a página de Login caso seja uma operação bem sucedida e aparece erro, caso contrário. 

1. Nome: Foi utilizado o componente do PrimeNGcontém de input text e o campo contém duas validações, além de ser obrigatório, sendo essas:
    - Tamanho mínimo de caracteres, sendo apenas três caracteres.
    - Tamanho máximo de 120 de caracteres.

2. Email: contém a validação própria graças aos Validators do Angular Forms, onde não necessário a criação de uma validação mais rígida.

3. País: Foi utilizado o componente do PrimeNG p-autocomplete para que quando o usuário começasse a digitar, sugestões de países fossem fornecidas com base nos dígitos do usuário, facilitando a utilização. Os paises estão mockados no arquivo de database do JSON Server, onde foi criado alguns com o intuito de tornar a aplicação funcional.

4. Estado: É um campo de autocomplete, desativado inicialmente, que é ativado apenas quando o usuário selecionar um país previamente. Após selecionar um país, é realizado a busca pelos estados do país em questão e é retornado ao usuário como sugestões quando o mesmo começar a digitar. Caso o estado seja preenchido e o usuário apague o campo de país, o estado é zerado e desabilitado até que um seja selecionado novamente.

5. CPF: contém uma validação de diretiva pois foi decidido criar uma que fosse capaz de validar se um CPF é válido ou não através de calculos matemáticos, além disso, é um campo opcional por padrão, mas pode ser obrigatório se o país selecionado for Brasil.

6. Data de Nascimento: Foi utilizado o componente p-date-picker do PrimeNG onde, ao clique, abre a seleção de datas para o usuário escolher. Por PrimeNG não ter uma tradução, foi criado um arquivo na pasta de locale para traduzir certos parâmetros da biblioteca em questão, permitindo que as semanas e os meses fossem em português. Foi escolhido o **p-date-picker** ao invés de p-calendar pois nas versões mais recentes do PrimeNG, **p-calendar** está **depreciado**.

7. Número de contato: É um input text com máscara dinâmica onde, ao digitar, é formatado automática com as adições de parentêses e hífen. Conforme digita, é verificado se o número digitado é válido ou não, se atende o tamanho mínimo e se os números de celular, após o DDD, iniciam com zero.

8. Tipo de número: Com base no que o usuário digitou no campo de número de contato, ele modifica dinamicamente o tipo de número para que o usuário não precise selecionar obrigatoriamente, apenas seria necessário caso ele explicitamente defina como WhatsApp, onde as validações entre número residencial e celular não são aplicadas.

## Login 
O login é um pouco mais simples, onde não há campo de senha, apenas email. O email faz uma verificação adicional onde, quando o usuário digitar um email inexistente, é retornado uma notificação que determinado email não existe. Caso o email digitado for correto, o usuário entra e é redirecionado para a página principal e o email é salvo no local storage para permitir o acesso a Home.

## Home
A Home é a página principal, onde é apenas acessivel caso o usuário esteja logado. Nela é possível observar informações limitadas de cada cliente, sendo essas nome, país e estado, além das informações detalhadas do usuário logado. 

Na home é possível:
- Ver os clientes em uma lista paginada com filtros de país e estado.
- Deletar clientes, onde aparece uma modal de confirmação de exclusão e toast com base em seu sucesso ou erro.
- Editar clientes ou editar a própria conta logada, onde é redirecionado para a página de edição onde os valores de cada campo já são preenchidos automaticamente pelas informações de cada cliente.
- Sair da conta, onde seria redirecionado para a página de Login.

Na lista paginada com filtros, é possível que o usuário escolha quantos clientes aparecem por vez em cada página e selecionar os filtros de país e estado. Ao invés do autocomplete do PrimeNG, foi utilizado o **p-select** para a seleção de país e estado, além disso, não foi utilizado o **p-dropdown** pois está **depreciado** nas versões mais recentes. Os filtros selecionados e os clientes exibidos são tudo dados guardados na store do NgRx.

No menu no topo, é possível que o usuário clique para abrir uma modal contendo suas informações, sendo tudo completamente responsivo, além disso é possível que ele vá para a página para cadastrar um novo cliente e também retorne para a home independentemente de em qual página se encontre.

## Edição de conta
É uma página semelhante a página de cadastro, por isso foi decidido criar uma classe abstrata contendo as funções e condições de ambas para que tanto a página de cadastro e edição pudessem herdar e reutilizar o código sem a necessidade de o replicar. Elas funcionam de maneira independente, onde na página de edição, os campos do formulário são preenchidos automaticamente com base nas informações da conta selecionada para edição.

# Referências
- PrimeNG: [https://primeng.org](https://primeng.org)
- TailwindCSS: [https://tailwindcss.com](https://tailwindcss.com)
- NgRx: [https://ngrx.io](https://ngrx.io)