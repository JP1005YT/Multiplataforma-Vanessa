export class Vagas {
    constructor(id, numero, tipo, disponivel) {
        this._id = id;
        this._numero = numero;
        this._tipo = tipo;
        this._disponivel = disponivel;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get numero() {
        return this._numero;
    }

    set numero(value) {
        this._numero = value;
    }

    get tipo() {
        return this._tipo;
    }

    set tipo(value) {
        this._tipo = value;
    }

    get disponivel() {
        return this._disponivel;
    }

    set disponivel(value) {
        this._disponivel = value;
    }
}