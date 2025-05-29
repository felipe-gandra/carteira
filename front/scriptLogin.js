var mostrarLogin = false; // Variável para controlar a exibição do formulário de login


function toggleLogin() {
  mostrarLogin = !mostrarLogin; // Inverte o estado da variável
  const titulo = document.getElementById("nomeForms");
  const botaoToggle = document.getElementById("botaoToggle");
  const botaoEnviar = document.getElementById("botaoEnviar");

  if (mostrarLogin){
    titulo.innerHTML = "<h2>Login</h2>";
    botaoToggle.innerHTML = "Criar conta";
    botaoEnviar.innerHTML = "Entrar"; 
  }
  else{
    titulo.innerHTML = "<h2>Cadastro</h2>"; 
    botaoToggle.innerHTML = "Já tenho conta"; 
    botaoEnviar.innerHTML = "Cadastrar";
  }
}

function envioFormulario(event){
  if (mostrarLogin) {
    login(event); // Se mostrarLogin for true, chama a função de login
  }
  else {
    cadastro(event); // tenta fazer o cadastro
  }
}

async function login(event) {
  event.preventDefault(); // segura o envio do formulario

  const emailDigitado = document.getElementById("email").value;
  const senhaDigitada = document.getElementById("password").value;

  const sucesso = await achouUsuarioCorreto(emailDigitado, senhaDigitada);
  if (sucesso) {
    localStorage.setItem('usuarioEmail', emailDigitado);  //armazena o email do usuario que fez login
    window.location.href = "index.html";

  }
}

async function achouUsuarioCorreto(email, senha) {
  try {
    const resposta = await fetch("http://localhost:3000/usuarios");
    const usuarios = await resposta.json();

    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].email === email && usuarios[i].senha === senha) {
        return true;
      }
    }

    alert("Usuário ou senha incorretos.");
    return false;

  } catch (erro) {
    console.error("Erro ao carregar os dados:", erro);
    alert("Erro ao acessar o banco de dados.");
    return false;
  }
}


/*
  - Função verifica se o email existe no banco e chama cadastrarUsuario para realizar 
  um POST no banco
  - Recebe o evento do formulário como parâmetro.
  - Se o email já existir, exibe um alert e não prossegue com o cadastro.
  - Se o email não existir, chama a função cadastrarUsuario para realizar o cadastro.
  - Exibe um alert de sucesso após o cadastro.
*/
async function cadastro(event) {
  event.preventDefault();

  const emailDigitado = document.getElementById("email").value;
  const senhaDigitada = document.getElementById("password").value;

  const emailExiste = await verificaEmailExistente(emailDigitado);
  if (emailExiste) {
    alert("Email já cadastrado. Tente outro.");
    return;
  }

  await cadastrarUsuario(emailDigitado, senhaDigitada);
  alert("Cadastro realizado com sucesso!");
  toggleLogin(); // Atualiza a interface
}

async function verificaEmailExistente(email) {
  try {
    const resposta = await fetch("http://localhost:3000/usuarios");
    const usuarios = await resposta.json();

    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].email === email) {
        return true;
      }
    }
    return false;
  } catch (erro) {
    console.error("Erro ao verificar email:", erro);
    alert("Erro ao acessar o banco de dados.");
    return true;
  }
}


/*
  - Função que faz um POST para cadastrar o usuário.
  - Recebe o email e a senha como parâmetros.
  - Retorna um alert caso ocorra erro ao acessar o banco
*/
async function cadastrarUsuario(email, senha){
  try {
    const novoUsuario = { email, senha, "acoes": {}};

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novoUsuario)
    };

    const resposta = await fetch("http://localhost:3000/usuarios", options);
    const resultado = await resposta.text();
  }
  catch (erro) {
    console.error("Erro ao cadastrar usuário:", erro);
    alert("Erro ao acessar o banco de dados.");
  }
}

window.onload = function() {
  toggleLogin();

  window.toggleLogin = toggleLogin;
  window.envioFormulario = envioFormulario;
}
