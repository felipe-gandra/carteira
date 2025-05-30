var mostrarLogin = false; // Variável para controlar a exibição do formulário de login

/**
 * Função para controlar o formato do formulário da página de login.
 * Mostra Login/Registre-se baseado na flag mostrarLogin e permite a troca
 * de funcionalidade.
 */
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


/**
 * Função que lida com o envio do formulário html. Tenta realizar login ou cadastro
 * baseado na flag mostrarLogin
 * @param {evento de envio do formulário html} event 
 */
function envioFormulario(event){
  if (mostrarLogin) {
    login(event); // Se mostrarLogin for true, chama a função de login
  }
  else {
    cadastro(event); // tenta fazer o cadastro
  }
}

/**
 * Realiza o login a partir dos dados inseridos no formulário html
 * @param {evento de envio do formulário html} event 
 */
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

/**
 * Verifica se existe um usuário com determinado login e senha no banco de dados. Realiza a validação de login
 * @param {email a ser verificado} email 
 * @param {senha a ser verificada} senha 
 * @returns true se achou, false se não achou
 */
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


/**
 * Tenta realizar o cadastro dos dados inseridos no formulário html
 * @param {evento de envio do formulário html} event 
 * 
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

/**
 * Verifica se já existe um determinado email no banco de dados
 * @param {email a ser verificado} email 
 * @returns true se já exite ou false se não existir
 */
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


/**
 * Faz um POST no banco de dados com o email e senha cadastrados e sem ativos financeiros
 * @param {*} email email cadastrado
 * @param {*} senha senha cadastrado
 */
async function cadastrarUsuario(email, senha){
  try {
    const novoUsuario = { email, senha, "ativos" : {"acoes": {} , "cripto": {}, "fundos":{}}};

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


/**
 * Ao iniciar a página o localStorage é esvaziado e o formulário é setado para login
 */
window.onload = function() {
  toggleLogin();
  localStorage.removeItem("usuarioEmail");
  window.toggleLogin = toggleLogin;
  window.envioFormulario = envioFormulario;
}

