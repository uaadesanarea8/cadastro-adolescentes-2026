// -------- LOGIN -------- //
function login(){
    let user = document.getElementById("user").value;
    let pass = document.getElementById("pass").value;

    if(user === "admin" && pass === "admin"){
        localStorage.setItem("logado", "true");
        window.location = "dashboard.html";
    } else {
        alert("Usuário ou senha incorretos.");
    }
}

function checkLogin(){
    if(localStorage.getItem("logado") != "true"){
        window.location = "index.html";
    }
}

function logout(){
    localStorage.removeItem("logado");
    window.location = "index.html";
}


// -------- BANCO DE DADOS -------- //
function salvarCadastro(){
    const form = document.getElementById("formCadastro");
    const dados = new FormData(form);

    let fotoBase64 = "";
    const foto = dados.get("foto");

    // Se tiver imagem, converter para Base64
    if(foto && foto.size > 0){
        const reader = new FileReader();
        reader.onload = function(e){
            fotoBase64 = e.target.result;
            salvarFinal();
        };
        reader.readAsDataURL(foto);
    } else {
        salvarFinal();
    }

    function salvarFinal(){
        let cadastro = {};
        dados.forEach((v,k)=>cadastro[k]=v);
        cadastro.id = Date.now();
        cadastro.foto = fotoBase64;

        let lista = JSON.parse(localStorage.getItem("cadastros") || "[]");
        lista.push(cadastro);
        localStorage.setItem("cadastros", JSON.stringify(lista));

        alert("Cadastro salvo com sucesso!");
        window.location = "dashboard.html";
    }
}



// -------- CARREGAR LISTA NO DASHBOARD -------- //
function carregarLista(){
    let lista = JSON.parse(localStorage.getItem("cadastros") || "[]");

    let busca = document.getElementById("busca")?.value.toLowerCase() || "";
    let filtroDescricao = document.getElementById("filtroDescricao")?.value || "";
    let filtroCargo = document.getElementById("filtroCargo")?.value || "";
    let filtroCong = document.getElementById("filtroCong")?.value || "";

    let filtrada = lista.filter(p => 
        p.nome.toLowerCase().includes(busca) &&
        (filtroDescricao=="" || p.descricao == filtroDescricao) &&
        (filtroCargo=="" || p.cargo == filtroCargo) &&
        (filtroCong=="" || p.congregacao == filtroCong)
    );

    const ul = document.getElementById("listaCadastros");
    ul.innerHTML = "";

    filtrada.reverse().forEach(p=>{
        ul.innerHTML += `
            <li style="margin:8px 0; list-style:none;">
                <b>${p.nome}</b> - ${p.descricao} | ${p.congregacao}
                <button onclick="abrir(${p.id})">Ver</button>
            </li>
        `;
    });
}

function abrir(id){
    localStorage.setItem("ver", id);
    window.location = "ver.html";
}

// -------- VISUALIZAR CADASTRO -------- //
function verCadastro(){
    let id = localStorage.getItem("ver");
    let lista = JSON.parse(localStorage.getItem("cadastros") || "[]");
    let p = lista.find(x=>x.id == id);

    if(!p){
        document.getElementById("dados").innerHTML = "<p>Cadastro não encontrado!</p>";
        return;
    }

    document.getElementById("dados").innerHTML = `
        <h2>${p.nome}</h2>
        ${p.foto ? `<img src="${p.foto}" width="150">` : "<i>Sem foto</i>"}
        <br><br>
        <p><b>Status:</b> ${p.status}</p>
        <p><b>Descrição:</b> ${p.descricao}</p>
        <p><b>Cargo:</b> ${p.cargo}</p>
        <p><b>Congregação:</b> ${p.congregacao}</p>
        <p><b>Data de Nascimento:</b> ${p.nascimento}</p>
        <p><b>Sexo:</b> ${p.sexo}</p>
        <p><b>Contato:</b> ${p.contato}</p>

        <h3>Endereço</h3>
        <p>${p.rua}, nº ${p.numero}, ${p.bairro}</p>

        <h3>Escolar</h3>
        <p>Série: ${p.serie} | Turno: ${p.turno}</p>

        <h3>Responsável</h3>
        <p>${p.responsavel} - ${p.parentesco} - ${p.telresponsavel}</p>

        <h3>Informações Complementares</h3>
        <p>Batizado águas: ${p.batismo}</p>
        <p>E. Santo: ${p.espirito}</p>
        <p>EBD: ${p.ebd}</p>
        <p>Ensino no Lar: ${p.ensino}</p>
        <p>Tem Bíblia: ${p.tembiblia}</p>
        <p>Tem Harpa: ${p.temharpa}</p>
    `;
}
// ----- EXCLUIR CADASTRO ----- //
function excluirCadastro(){
    if(!confirm("Tem certeza que deseja excluir?")) return;

    let id = localStorage.getItem("ver");
    let lista = JSON.parse(localStorage.getItem("cadastros") || "[]");
    let nova = lista.filter(x=>x.id != id);

    localStorage.setItem("cadastros", JSON.stringify(nova));
    alert("Cadastro removido.");
    window.location = "dashboard.html";
}


// ----- EDITAR CADASTRO ----- //
function editarCadastro(){
    window.location = "cadastro.html?edit=" + localStorage.getItem("ver");
}


// ----- CARREGAR FORMULÁRIO PARA EDIÇÃO ----- //
if(window.location.href.includes("cadastro.html?edit=")){
    window.onload = function(){
        checkLogin();
        let id = window.location.href.split("edit=")[1];
        let lista = JSON.parse(localStorage.getItem("cadastros") || "[]");
        let p = lista.find(x=>x.id == id);

        if(p){
            const form = document.getElementById("formCadastro");
            Object.keys(p).forEach(key=>{
                if(form[key] && key!="foto"){
                    form[key].value = p[key];
                }
            });

            // Salvar edição
            form.onsubmit = function(e){
                e.preventDefault();

                Object.keys(p).forEach(key=>{
                    if(form[key]){
                        p[key] = form[key].value;
                    }
                });

                let nova = lista.map(x=> x.id==id ? p : x);
                localStorage.setItem("cadastros", JSON.stringify(nova));

                alert("Cadastro atualizado!");
                window.location="ver.html";
            }
        }
    }
}

let editIndex = null; // controla se está editando

// Carregar registros do localStorage
function carregarRegistros() {
    tabela.innerHTML = "";
    let dados = JSON.parse(localStorage.getItem("registros")) || [];

    dados.forEach((item, index) => {
        let row = `<tr>
            <td>${item.tipo}</td>
            <td>${item.cargo}</td>
            <td>${item.nome}</td>
            <td>${item.nascimento}</td>
            <td>${item.telefone}</td>
            <td>${item.email}</td>
            <td>${item.endereco}</td>
            <td>
                <button onclick="editar(${index})">✏ Editar</button>
                <button onclick="excluir(${index})">🗑 Excluir</button>
            </td>
        </tr>`;
        tabela.innerHTML += row;
    });
}

function cadastrar() {
    let dados = JSON.parse(localStorage.getItem("registros")) || [];

    let registro = {
        tipo: tipo.value,
        cargo: cargo.value,
        nome: nome.value,
        nascimento: nascimento.value,
        telefone: telefone.value,
        email: email.value,
        endereco: endereco.value
    };

    // MODO EDIÇÃO
    if (editIndex !== null) {
        if(confirm("Deseja realmente salvar as alterações?")){
            dados[editIndex] = registro;
            localStorage.setItem("registros", JSON.stringify(dados));
            alert("Alteração salva com sucesso!");
        }
        editIndex = null;

        btnCadastrar.textContent = "Cadastrar"; // restaura
        form.reset();
        carregarRegistros();
        return;
    }

    // CADASTRO NORMAL
    dados.push(registro);
    localStorage.setItem("registros", JSON.stringify(dados));
    alert("Cadastro realizado!");
    form.reset();
    carregarRegistros();
}

// Função para editar
function editar(index) {
    let dados = JSON.parse(localStorage.getItem("registros")) || [];
    let item = dados[index];

    tipo.value = item.tipo;
    cargo.value = item.cargo;
    nome.value = item.nome;
    nascimento.value = item.nascimento;
    telefone.value = item.telefone;
    email.value = item.email;
    endereco.value = item.endereco;

    editIndex = index;

    btnCadastrar.textContent = "Salvar Alterações";
    window.scrollTo({ top:0, behavior:'smooth' });
}

// Função excluir
function excluir(index) {
    if(confirm("Tem certeza que deseja excluir?")){
        let dados = JSON.parse(localStorage.getItem("registros")) || [];
        dados.splice(index,1);
        localStorage.setItem("registros", JSON.stringify(dados));
        carregarRegistros();
    }
}
carregarRegistros();
