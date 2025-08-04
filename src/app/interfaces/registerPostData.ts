export interface RegisterPostData {
    name: string,
    email: string,
    country: string,
    birthDate: Date,
    state: string,
    cpf: string,
    number: string,
    numberType: { name: string }
}