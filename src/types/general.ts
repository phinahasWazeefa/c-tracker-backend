export type StatusCodes = 200 | 201 | 409;
export type Roles = 'admin'|'customer'|'staff'


export interface Return {

    statusCode:StatusCodes,
    message ?:string

}

export interface User {
    name:string,
    email:string,
    age?:number,
    password?:string,
    address:string,
    role:Roles
}

