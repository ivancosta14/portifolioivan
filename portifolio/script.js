// =========================================================
// Portfólio de Ivan Costa
// Este arquivo faz funcionar a amostra do Vitrine do Futebol
// que aparece dentro do celular, na abertura da página.
// A lógica é a mesma do aplicativo de verdade:
// filtrar por cidade e categoria, e mostrar primeiro
// as peneiras da cidade do jogador.
// =========================================================

// Peneiras de exemplo (as mesmas do banco de dados do TCC)
const peneiras = [
    { titulo: 'Peneira Sub-17 EC São Leopoldo', clube: 'EC São Leopoldo', data: '2026-12-20', cidade: 'São Leopoldo', categoria: 'Sub-17' },
    { titulo: 'Avaliação Sub-20 Esteio FC', clube: 'Esteio FC', data: '2026-12-27', cidade: 'Esteio', categoria: 'Sub-20' },
    { titulo: 'Peneira Sub-15 EC São Leopoldo', clube: 'EC São Leopoldo', data: '2027-01-10', cidade: 'São Leopoldo', categoria: 'Sub-15' },
    { titulo: 'Peneira Geral NH Talentos', clube: 'NH Talentos', data: '2027-01-17', cidade: 'Novo Hamburgo', categoria: 'Sub-13' },
    { titulo: 'Peneira Sub-17 NH Talentos', clube: 'NH Talentos', data: '2027-01-24', cidade: 'Novo Hamburgo', categoria: 'Sub-17' }
];

// Jogador de exemplo que está "logado" na amostra
const usuario = { nome: 'Lucas', dataNasc: '2009-03-10', cidade: 'São Leopoldo' };

// Guarda os títulos das peneiras em que o visitante clicou em "Inscrever-se"
const inscricoes = [];

// Elementos da página que o script usa
const campoCidade = document.getElementById('filtro-cidade');
const campoCategoria = document.getElementById('filtro-categoria');
const botaoIdade = document.getElementById('botao-idade');
const lista = document.getElementById('app-lista');
const contagem = document.getElementById('app-contagem');

// Calcula a idade a partir da data de nascimento (formato AAAA-MM-DD)
function calcularIdade(dataNasc) {
    const partes = dataNasc.split('-');
    const ano = Number(partes[0]);
    const mes = Number(partes[1]);
    const dia = Number(partes[2]);
    const hoje = new Date();

    let idade = hoje.getFullYear() - ano;
    const aindaNaoFezAniversario =
        hoje.getMonth() + 1 < mes || (hoje.getMonth() + 1 === mes && hoje.getDate() < dia);
    if (aindaNaoFezAniversario) {
        idade = idade - 1;
    }
    return idade;
}

// Descobre a categoria do jogador pela idade
function categoriaPelaIdade(idade) {
    if (idade <= 13) return 'Sub-13';
    if (idade <= 15) return 'Sub-15';
    if (idade <= 17) return 'Sub-17';
    return 'Sub-20';
}

// Transforma 2026-12-20 em 20/12/2026
function formatarData(texto) {
    const partes = texto.split('-');
    return partes[2] + '/' + partes[1] + '/' + partes[0];
}

// Monta o cartão de uma peneira
function criarCartao(peneira) {
    const cartao = document.createElement('li');
    cartao.className = 'app-cartao';

    const titulo = document.createElement('strong');
    titulo.className = 'app-cartao-titulo';
    titulo.textContent = peneira.titulo;

    const clube = document.createElement('span');
    clube.className = 'app-cartao-clube';
    clube.textContent = peneira.clube;

    const info = document.createElement('span');
    info.className = 'app-cartao-info';
    info.textContent = formatarData(peneira.data) + ', ' + peneira.cidade;

    const rodape = document.createElement('span');
    rodape.className = 'app-cartao-rodape';

    const etiqueta = document.createElement('span');
    etiqueta.className = 'app-etiqueta';
    etiqueta.textContent = peneira.categoria;

    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'app-inscrever';

    if (inscricoes.includes(peneira.titulo)) {
        // Já se inscreveu: no app, a inscrição fica pendente até o clube responder
        botao.textContent = 'Inscrição pendente';
        botao.classList.add('inscrito');
        botao.disabled = true;
    } else {
        botao.textContent = 'Inscrever-se';
        botao.addEventListener('click', function () {
            inscricoes.push(peneira.titulo);
            mostrarPeneiras();
        });
    }

    rodape.append(etiqueta, botao);
    cartao.append(titulo, clube, info, rodape);
    return cartao;
}

// Mensagem para quando nenhum filtro encontra peneiras
function criarAvisoVazio() {
    const aviso = document.createElement('li');
    aviso.className = 'app-vazio';
    aviso.textContent = 'Nenhuma peneira com esses filtros.';

    const limpar = document.createElement('button');
    limpar.type = 'button';
    limpar.className = 'app-botao-idade';
    limpar.textContent = 'Limpar filtros';
    limpar.addEventListener('click', function () {
        campoCidade.value = '';
        campoCategoria.value = '';
        mostrarPeneiras();
    });

    aviso.append(document.createElement('br'), limpar);
    return aviso;
}

// Filtra, ordena e desenha a lista de peneiras
function mostrarPeneiras() {
    const cidade = campoCidade.value.trim().toLowerCase();
    const categoria = campoCategoria.value.trim().toLowerCase();

    // 1. Fica só com as peneiras que combinam com os dois filtros
    const filtradas = peneiras.filter(function (peneira) {
        const combinaCidade = cidade === '' || peneira.cidade.toLowerCase().includes(cidade);
        const combinaCategoria = categoria === '' || peneira.categoria.toLowerCase().includes(categoria);
        return combinaCidade && combinaCategoria;
    });

    // 2. Coloca as peneiras da cidade do jogador primeiro
    const daMinhaCidade = filtradas.filter(function (peneira) {
        return peneira.cidade === usuario.cidade;
    });
    const outrasCidades = filtradas.filter(function (peneira) {
        return peneira.cidade !== usuario.cidade;
    });
    const listaFinal = daMinhaCidade.concat(outrasCidades);

    // 3. Limpa a lista antiga e desenha a nova
    lista.innerHTML = '';
    if (listaFinal.length === 0) {
        lista.append(criarAvisoVazio());
    } else {
        listaFinal.forEach(function (peneira) {
            lista.append(criarCartao(peneira));
        });
    }

    // 4. Avisa os leitores de tela quantas peneiras apareceram
    contagem.textContent = listaFinal.length + ' peneiras encontradas';
}

// Só roda se a amostra existir na página
if (lista) {
    const idade = calcularIdade(usuario.dataNasc);

    // Mostra a idade do jogador de exemplo na legenda
    document.getElementById('idade-exemplo').textContent = idade;

    // A lista se atualiza enquanto a pessoa digita
    campoCidade.addEventListener('input', mostrarPeneiras);
    campoCategoria.addEventListener('input', mostrarPeneiras);

    // "Para minha idade" preenche o filtro de categoria com a categoria do jogador
    botaoIdade.addEventListener('click', function () {
        campoCategoria.value = categoriaPelaIdade(idade);
        mostrarPeneiras();
    });

    mostrarPeneiras();
}

// Mantém o ano do rodapé sempre atualizado
const ano = document.getElementById('ano');
if (ano) {
    ano.textContent = new Date().getFullYear();
}
