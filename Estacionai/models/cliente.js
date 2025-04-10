export class Cliente {
    constructor(id, nome, telefone, email) {
        this._id = id;
        this._nome = nome;
        this._telefone = telefone;
        this._email = email;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get nome() {
        return this._nome;
    }

    set nome(value) {
        this._nome = value;
    }

    get telefone() {
        return this._telefone;
    }

    set telefone(value) {
        this._telefone = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }
}