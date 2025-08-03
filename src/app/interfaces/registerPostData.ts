export interface RegisterPostData {
    name: string,
    email: string,
    country: string,
    date: Date,
    state: string,
    cpf: string,
    number: string,
    numberType: { name: string }
}