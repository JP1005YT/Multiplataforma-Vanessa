class Veiculos {
    constructor(id, marca, modelo, ano, cor, cliente_id) {
        this.id = id;
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
        this.cor = cor;
        this.cliente_id = cliente_id;
    }
}

class Clientes {
    constructor(id, nome, telefone, email) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
    }
}

class Vagas {
    constructor(id, numero, tipo, disponivel) {
        this.id = id;
        this.numero = numero;
        this.tipo = tipo;
        this.disponivel = disponivel;
    }
}