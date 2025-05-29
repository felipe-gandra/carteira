var usuarioLogado = localStorage.getItem("usuarioEmail");

async function getUsuarios(){

  try{
    const resposta = await fetch("http://localhost:3000/usuarios");
    const usuarios = await resposta.json()

    return usuarios;
  }
  catch(erro){
    alert("Erro ao acessar o banco de dados");
    return null;
  }
}

async function procuraAtivos(email){
  const usuarios = await getUsuarios();
  
  for (let u of usuarios){
    if (u.email == email){
      const usuario = u //procura pelo usurario correto

      console.log(usuario.ativos);
    }
  }

  
}

function atualizaAtivos(ativos){
  //todo
}