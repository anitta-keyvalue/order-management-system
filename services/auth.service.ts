import UserService from "./user.service";

class AuthService {
  constructor(private userService: UserService) {}

  async login(email: string, password: string) {
    
    return  {
        tokenType: "Bearer",
        accessToken: "",
       
    }
  }
}

export default AuthService;
