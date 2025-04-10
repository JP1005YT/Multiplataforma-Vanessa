export class Veiculo {
    constructor(id, marca, modelo, ano, cor, cliente_id) {
        this._id = id;
        this._marca = marca;
        this._modelo = modelo;
        this._ano = ano;
        this._cor = cor;
        this._cliente_id = cliente_id;
    }

    // Getters
    get id() {
        return this._id;
    }

    get marca() {
        return this._marca;
    }

    get modelo() {
        return this._modelo;
    }

    get ano() {
        return this._ano;
    }

    get cor() {
        return this._cor;
    }

    get cliente_id() {
        return this._cliente_id;
    }

    // Setters
    set id(value) {
        this._id = value;
    }

    set marca(value) {
        this._marca = value;
    }

    set modelo(value) {
        this._modelo = value;
    }

    set ano(value) {
        this._ano = value;
    }

    set cor(value) {
        this._cor = value;
    }

    set cliente_id(value) {
        this._cliente_id = value;
    }
}