export interface IAdmin {
    id: number;
    adminID: string;
    name: string;
    email: string;
    mobile: string;
    address: string;
    password: string;
    role: "superadmin" | "admin";
    image: string;
    status: string;
}