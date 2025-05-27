
/*
  Script de login
  - Recebe o evento de submit no html
  - Pega os valores do usuario e testa com a função achouUsuarioCorreto
  - Caso encontre o usuario, direciona para a pagina principal
*/
async function login(event) {
  event.preventDefault(); // segura o envio do formulario

  //pego os valores que o usuario colocou
  const emailDigitado = document.getElementById("email").value;
  const senhaDigitada = document.getElementById("password").value;

  const sucesso = await achouUsuarioCorreto(emailDigitado, senhaDigitada);
  if (sucesso) {
    window.location.href = "index.html";
  }
}


/*
  Confere a autenticidade do usuário que está tentando logar
  - Recebe o email e a senha do usuário
  - Busca os dados no JSON e confere
  - Retorna true se achou o usuário e false se não achou
*/
async function achouUsuarioCorreto(email, senha) {
  console.log("Tentando logar com:", email, senha);

  try {
    const resposta = await fetch("bancoDados/registros.json");
    const usuarios = await resposta.json();

    for (let i = 0; i < usuarios.length; i++) {
      console.log(usuarios[i].email, usuarios[i].senha);
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
